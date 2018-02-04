import {scale, translate, rotateDEG} from 'transformation-matrix';
import {transformMultiple, skewXMatrix, qrDecompose, translationOnly, extractSkew} from './matrix';
import {extend} from '../utils/object-utils';

const propsSupportingPercentage = [
	{name: 'x', relativeTo: 'width'},
	{name: 'y', relativeTo: 'height'}
];

const defaultDescriptor = (snapTargetTransform, snapTargetDimensions, draggableTransform, draggableDimensions) => ({
	x: 0,
	y: 0,
	scaleX: (draggableTransform.scaleX * draggableDimensions.width) / (snapTargetTransform.scaleX * snapTargetDimensions.width),
	scaleY: (draggableTransform.scaleY * draggableDimensions.height) / (snapTargetTransform.scaleY * snapTargetDimensions.height),
	skewX: 0,
	skewY: 0,
	rotation: 0,
	customSnapProps: {}
});

//Util function that takes a snap descriptor, fills in missing values (with defaults) and converts percentage values to absolutes
const parseSnapDescriptor = function(descriptor, snapTargetTransform, snapTargetDimensions, draggableTransform, draggableDimensions) {
	const completeDescriptor = extend(
		defaultDescriptor(snapTargetTransform, snapTargetDimensions, draggableTransform, draggableDimensions),
		descriptor
	);
	
	propsSupportingPercentage.forEach((p) => {
		const value = completeDescriptor[p.name];

		try {
			if (typeof value === 'string' && value.slice(-1) === '%') {
				const percentage = parseFloat(value);

				if (isNaN(percentage)) {
					throw new Error('invalid-percentage');
				}

				completeDescriptor[p.name] = percentage / 100 * snapTargetDimensions[p.relativeTo];
			} else if (typeof value !== 'number') {
				throw new Error('not-a-number');
			}
		} catch(e) {
			throw new Error(`Unable to parse property '${p.name}'. Value was ${completeDescriptor[p.name]}. Must be either a number or percentage encoded as a string (e.g. '50%')`);
		}
	});

	return completeDescriptor;
};

//http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
const createSnappingMatrix = function (snapTargetMatrix, snapTargetDimensions, draggableTransform, draggableDimensions, snapTransform) {
	const {scaleX, scaleY, skewX, rotation} = qrDecompose(snapTargetMatrix);

	const currentScaleX = (draggableTransform.scaleX * draggableDimensions.width) / (scaleX * snapTargetDimensions.width);
	const currentScaleY = (draggableTransform.scaleY * draggableDimensions.height) / (scaleY * snapTargetDimensions.height);

	const scalingMatrix = scale(
		(snapTransform.scaleX / currentScaleX),
		(snapTransform.scaleY / currentScaleY)
	);

	const rotationMatrix = rotateDEG(snapTransform.rotation + rotation);

	//The descriptors scaling will impact that translation and skew (but leave rotation unaffected)
	const descriptorScalingMatrix = scale(snapTransform.scaleX, snapTransform.scaleY);

	//Create skew matrix taking the descriptor's scaling (in x and y directions) into account
	const scaledSkewMatrix = transformMultiple(skewXMatrix(snapTransform.skewX + skewX), descriptorScalingMatrix);
	const skewMatrix = skewXMatrix(extractSkew(scaledSkewMatrix).x); //Extract the skew part of the matrix, and create a skew only matrix

	//Create a translation matrix taking the descriptor's scaling (in x and y directions) into account.
	const localTranslationMatrix = translate(snapTransform.x, snapTransform.y);
	const translationMatrix = translationOnly(transformMultiple(snapTargetMatrix, localTranslationMatrix, descriptorScalingMatrix)); //Extract the translation part and create a translation only matrix

	return transformMultiple(translationMatrix, rotationMatrix, scalingMatrix, skewMatrix);
};

export {parseSnapDescriptor, createSnappingMatrix};
