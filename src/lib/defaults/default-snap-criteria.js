import {distance} from '../utils/point-utils';
import {toArray} from '../utils/array-utils';

const isPercentageString = function (value) {
	return (typeof value === 'string' && value.slice(-1) === '%');
};

const parsePercentageString = function (value) {
	const percentage = parseFloat(value);

	if (isNaN(percentage)) {
		throw new Error('invalid-percentage');
	}

	return percentage;
};

const always = () => true;
const never = () => false;

const isCenterOverTarget = ({transform}, {width, height}) => {
	const {x,y} = transform;
	return x > -width/2 && x < width/2 && y > -height/2 && y < height/2;
};

const isCenterWithinRadius = (radius, hysteresisRadius) => {
	return ({id, transform, isSnappingToThisTarget}, {width, height}, {draggedItems}) => {
		const {x, y} = transform;
		const _radius = (isSnappingToThisTarget && hysteresisRadius) ? hysteresisRadius : radius;

		let r = _radius;

		if (isPercentageString(_radius)) {
			const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
			const percentage = parsePercentageString(_radius);

			r = ((diagonal/2) / 100) * percentage;
		}

		return distance({x, y}) < r;
	}
};

const isNoOtherDraggableSnapping = ({id}, _, {draggedItems}) => {
	return !draggedItems
			.filter((d) => d.id !== id)
			.some((d) => d.isSnappingToThisTarget);
};

/*
 * Usually a target doesn't need to worry about whether or not the draggable is snapping to another target.
 * It is only possible to for draggables to snap to one target at a time, and if multiple targets want the same 
 * draggable to snap simultanously, the conflict is resolved based on the target's snap priorities. This snap
 * criteria allows a target to be 'polite', so that it doesn't take over a draggable that is already 
 * (that is, was in previous 'frame') snapping to another target with a lower snap priority.
 */
const draggableIsNotSnappingToOtherTarget = ({isSnappingToOtherTarget}) => {
	return !isSnappingToOtherTarget;
};

const isDragDataProp = (prop, value) => {
	return ({dragData}) => toArray(value).indexOf(dragData[prop]) > -1;
};

const Criteria = {
	always,
	never,
	isCenterOverTarget,
	isCenterWithinRadius,
	isDragDataProp,
	isNoOtherDraggableSnapping,
	draggableIsNotSnappingToOtherTarget
}

export default Criteria;