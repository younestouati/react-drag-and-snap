import {scale, translate, rotateDEG} from 'transformation-matrix';
import {transformMultiple, skew, qrDecompose, translationOnly} from '../utils/matrix-utils';

/*
* Given the snapTargetMatrix (the matrix that describes the snapTarget's position in the window coordinate system) and a snapTransform that
* describes a draggable's target position in the coordinate system of the snapTarget, this method returns a snapMatrix that describes the
* draggable's target position in the window coordinate system.
*
* The user defined snapTransform's properties are to be added to the equivalent properties from the the snapTargetMatrix. Consequently, these
* properties are extracted from the snapTargetMartrix, and addition is done indenpendently for each property. These are then converted back to
* matrix form, and multiplied together to produce the final snapMatrix
*/
const createSnapMatrix = function (snapTargetMatrix, snapTransform, snapTargetDOMElementHelper, draggableDOMElementHelper) {
	//Extract properties from snapTarget's matrix so we can add then (independently) with the equivalent values from the snapTransform.
	//After this addition has been done, we will convert back to matrix form
    const {skewX, rotate, scaleX, scaleY} = qrDecompose(snapTargetMatrix);

	const snapTargetScaledSize = snapTargetDOMElementHelper.getScaledSize(scaleX, scaleY);
	const currentScaleX = (draggableDOMElementHelper.getSize().width) / (snapTargetScaledSize.width);
	const currentScaleY = (draggableDOMElementHelper.getSize().height) / (snapTargetScaledSize.height);

	const scalingMatrix = scale(
		(snapTransform.scaleX / currentScaleX),
		(snapTransform.scaleY / currentScaleY)
	);

	const rotationMatrix = rotateDEG(snapTransform.rotate + rotate);

	//The snapTransform's scaling will impact that translation and skew (but leave rotation unaffected)
	const snapTransformScalingMatrix = scale(snapTransform.scaleX, snapTransform.scaleY);

	const skewMatrix = skew(skewX + snapTransform.skewX, snapTransform.skewY);
	//Create a translation matrix taking the snap transform's scaling (in x and y directions) into account.
    const localTranslationMatrix = translate((snapTransform.x)/scaleX, (snapTransform.y)/scaleY);
    //Extract the translation part and create a translation only matrix
	const translationMatrix = translationOnly(
        transformMultiple(snapTargetMatrix, localTranslationMatrix, snapTransformScalingMatrix)
    );

    //Merge all matrices together into one and return
	return transformMultiple(translationMatrix, rotationMatrix, scalingMatrix, skewMatrix);
};

export {createSnapMatrix};