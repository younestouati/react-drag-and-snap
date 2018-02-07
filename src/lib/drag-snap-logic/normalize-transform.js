import invariant from 'invariant';
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

export {normalizeTransform};