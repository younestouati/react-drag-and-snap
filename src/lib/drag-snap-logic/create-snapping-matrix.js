import invariant from 'invariant';
import {scale, translate, rotateDEG} from 'transformation-matrix';
import {transformMultiple, skewXMatrix, qrDecompose, translationOnly, extractSkew} from './matrix';
import {isNullOrUndefined, isNumber} from '../utils/type-utils';

const isPercentage = (value) => typeof value === 'string' && value.slice(-1) === '%';

function firstDefinedValue(...values) {
    let firstDefinedValue;
    
    values.some((value) => {
        if(!isNullOrUndefined(value)) {
            firstDefinedValue = value;
            return true;
		}
		
		return false;
    });

    return firstDefinedValue;
}

const TRANSFORM_PROPS = ['x', 'y', 'rotate', 'scaleX', 'scaleY', 'skewX'];

/*
* Accepts a (partial or complete) transform, and returns an equivalent, completed transform in a normalized format. 
* If the given transform was incomplete, default values will be use for the omitted properties. 
*
* The normalized transform format is an object with the following properties:
*
* - x: number             (default: 0)
* - y: number             (default: 0)
* - scaleX: number        (default: ratio betweens draggable's width and snapTarget's width)
* - scaleY: number        (default: ratio betweens draggable's height and snapTarget's height)
* - rotate: number        (default: 0)
* - skewX: number         (default: 0)
* - customSnapProps: any  (default: {})
*
* Valid input:
* The input transform can have any number of the properties listed below specified. In addition note that:
* - translateX can be used as an alias for x and translateY can be used as an alias for y
* - x and y (and translateX and translateY) can be percentages encoded as string, e.g. '50%'. The percentage is based on the width/height of the snapTarget
* - scale can be used to set scaleX and scaleY to the same value in one go
*/
function normalizeTransform(inputTransform, draggableActualSize, snapTargetActualSize) {
	const normalizedTransform = {};;
    normalizedTransform.x =  firstDefinedValue(inputTransform.x, inputTransform.translateX, 0);
    normalizedTransform.y = firstDefinedValue(inputTransform.y, inputTransform.translateY, 0);
    normalizedTransform.rotate = firstDefinedValue(inputTransform.rotate, 0);
    normalizedTransform.scaleX = firstDefinedValue(inputTransform.scaleX, inputTransform.scale, (draggableActualSize.width/snapTargetActualSize.width));
    normalizedTransform.scaleY = firstDefinedValue(inputTransform.scaleY, inputTransform.scale, (draggableActualSize.height/snapTargetActualSize.height));
    normalizedTransform.skewX = firstDefinedValue(inputTransform.skewX, 0);
    normalizedTransform.customSnapProps = firstDefinedValue(inputTransform.customSnapProps, {});

    normalizedTransform.x = isPercentage(normalizedTransform.x) 
        ? parseFloat(normalizedTransform.x) / 100 * snapTargetActualSize.width 
        : normalizedTransform.x;

    normalizedTransform.y = isPercentage(normalizedTransform.y) 
        ? parseFloat(normalizedTransform.y) / 100 * snapTargetActualSize.height
        : normalizedTransform.y;

    TRANSFORM_PROPS.forEach((p) => {
        invariant(isNumber(normalizedTransform[p]), `Invalid property ${p} in transform ${inputTransform}: ${inputTransform[p]}`);
    });

    return normalizedTransform;
}

/*
* Given the snapTargetMatrix (the matrix that describes the snapTarget's position in the window coordinate system) and a snapTransform that
* describes a draggable's target position in the coordinate system of the snapTarget, this method returns a snapMatrix that describes the
* draggable's target position in the window coordinate system.
*
* The user defined snapTransform's properties are to be added to the equivalent properties from the the snapTargetMatrix. Consequently, these
* properties are extracted from the snapTargetMartrix, and addition is done indenpendently for each property. These are then converted back to
* matrix form, and multiplied together to produce the final snapMatrix
*/
const createSnapMatrix = function (snapTargetMatrix, snapTransform, draggableActualSize, snapTargetActualSize) {
    //Extract properties from snapTarget's matrix so we can add then (independently) with the equivalent values from the snapTransform.
    //After this addition has been done, we will convert back to matrix form
    const {skewX, rotate} = qrDecompose(snapTargetMatrix);

	const currentScaleX = (draggableActualSize.width) / (snapTargetActualSize.width);
	const currentScaleY = (draggableActualSize.height) / (snapTargetActualSize.height);

	const scalingMatrix = scale(
		(snapTransform.scaleX / currentScaleX),
		(snapTransform.scaleY / currentScaleY)
	);

	const rotationMatrix = rotateDEG(snapTransform.rotate + rotate);

	//The snapTransform's scaling will impact that translation and skew (but leave rotation unaffected)
	const snapTransformScalingMatrix = scale(snapTransform.scaleX, snapTransform.scaleY);

	//Create skew matrix taking the snapTransforms's scaling (in x and y directions) into account
	const scaledSkewMatrix = transformMultiple(skewXMatrix(skewX + snapTransform.skewX), snapTransformScalingMatrix);
	const skewMatrix = skewXMatrix(extractSkew(scaledSkewMatrix).x); //Extract the skew part of the matrix, and create a skew only matrix

	//Create a translation matrix taking the descriptor's scaling (in x and y directions) into account.
    const localTranslationMatrix = translate(snapTransform.x, snapTransform.y);
    //Extract the translation part and create a translation only matrix
	const translationMatrix = translationOnly(
        transformMultiple(snapTargetMatrix, localTranslationMatrix, snapTransformScalingMatrix)
    );

    //Merge all matrices together into one and return
	return transformMultiple(translationMatrix, rotationMatrix, scalingMatrix, skewMatrix);
};

export {normalizeTransform, createSnapMatrix};