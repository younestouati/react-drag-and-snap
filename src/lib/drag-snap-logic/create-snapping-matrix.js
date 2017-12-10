import {scale, translate, rotateDEG} from 'transformation-matrix';
import {transformMultiple, skewXMatrix, qrDecompose, translationOnly, extractSkew} from './matrix';
import {extend} from '../utils/object-utils';

const propsSupportingPercentage = [
	{name: 'x', relativeTo: 'width'},
	{name: 'y', relativeTo: 'height'},
	{name: 'width', relativeTo: 'width'},
	{name: 'height', relativeTo: 'height'}
];

const defaultDescriptor = ({width, height}) => ({
	x: 0,
	y: 0,
	width,
	height,
	skewX: 0,
	skewY: 0,
	rotation: 0,
	customSnapProps: {}
});

//Util function that takes a snap descriptor, fills in missing values (with defaults) and converts percentage values to absolutes
const parseSnapDescriptor = function(descriptor, baseDimensions, draggableDimensions) {
	const completeDescriptor = extend(defaultDescriptor(draggableDimensions), descriptor);
	propsSupportingPercentage.forEach((p) => {
		const value = completeDescriptor[p.name];

		try {
			if (typeof value === 'string' && value.slice(-1) === '%') {
				const percentage = parseFloat(value);

				if (isNaN(percentage)) {
					throw new Error('invalid-percentage');
				}

				completeDescriptor[p.name] = percentage / 100 * baseDimensions[p.relativeTo];
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
const createSnappingMatrix = function (baseMatrix, descriptor, draggableDimensions) {
	const {scaleX, scaleY, skewX, rotation} = qrDecompose(baseMatrix);

	const scalingMatrix = scale(
		scaleX * (descriptor.width / draggableDimensions.width),
		scaleY * (descriptor.height / draggableDimensions.height)
	);

	const rotationMatrix = rotateDEG(descriptor.rotation + rotation);

	//The descriptors scaling will impact that translation and skew (but leave rotation unaffected)
	const descriptorScalingMatrix = scale(
		descriptor.width / draggableDimensions.width,
		descriptor.height / draggableDimensions.height
	);

	//Create skew matrix taking the descriptor's scaling (in x and y directions) into account
	const scaledSkewMatrix = transformMultiple(skewXMatrix(descriptor.skewX + skewX), descriptorScalingMatrix);
	const skewMatrix = skewXMatrix(extractSkew(scaledSkewMatrix).x); //Extract the skew part of the matrix, and create a skew only matrix

	//Create a translation matrix taking the descriptor's scaling (in x and y directions) into account.
	const localTranslationMatrix = translate(descriptor.x, descriptor.y);
	const translationMatrix = translationOnly(transformMultiple(baseMatrix, localTranslationMatrix, descriptorScalingMatrix)); //Extract the translation part and create a translation only matrix

	return transformMultiple(translationMatrix, rotationMatrix, scalingMatrix, skewMatrix);
};

export {parseSnapDescriptor, createSnappingMatrix};
