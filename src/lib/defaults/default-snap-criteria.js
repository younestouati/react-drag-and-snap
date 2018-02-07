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

const isCenterOverTarget = ({transform, targetWidth, targetHeight}) => {
	const {x,y} = transform;
	return x > -targetWidth/2 && x < targetWidth/2 && y > -targetHeight/2 && y < targetHeight/2;
};

const isCenterWithinRadius = (radius, hysteresisRadius) => {
	return ({id, transform, targetWidth, targetHeight}, {draggedItems}) => {
		const {x, y} = transform;
		const isSnapping = draggedItems.filter((d) => d.id === id).some((d) => d.isSnappingToThisTarget);
		const _radius = (isSnapping && hysteresisRadius) ? hysteresisRadius : radius;

		let r = _radius;

		if (isPercentageString(_radius)) {
			const diagonal = Math.sqrt(Math.pow(targetWidth, 2) + Math.pow(targetHeight, 2));
			const percentage = parsePercentageString(_radius);

			r = ((diagonal/2) / 100) * percentage;
		}

		return distance({x, y}) < r;
	}
};

const isNoOtherDraggableSnapping = ({id}, {draggedItems}) => {
	return !draggedItems
			.filter((d) => d.id !== id)
			.some((d) => d.isSnappingToThisTarget);
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
	isNoOtherDraggableSnapping
}

export default Criteria;