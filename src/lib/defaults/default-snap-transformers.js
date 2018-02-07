import {distance} from '../utils/point-utils';
import {extend} from '../utils/object-utils';
import {isFunction} from '../utils/type-utils';

const noSnapping = ({transform}) => transform;

const defaultSnapping = ({transform}) => (
	{
		x: 0,
		y: 0,
		scaleX: transform.scaleX,
		scaleY: transform.scaleY,
		skewX: 0,
		skewY: 0,
		rotate: 0
	}
);

const defaultSnappingAndSize = (draggable) => {
	return extend(
		defaultSnapping(draggable),
		{scaleX: 1, scaleY: 1}
	);
}

const snapPosition = ({transform}) => extend(transform, {x: 0, y: 0});

const snapRotation = ({transform}) => extend(transform, {rotate: 0});

const snapSize = ({transform}) => extend(transform, {scaleX: 1, scaleY: 1});

const snapPositionAndRotation = ({transform}) => extend(transform, {x: 0, y: 0, rotate: 0});

const snapPositionAndSize = ({transform}) => extend(transform, {x: 0, y: 0, scaleX: 1, scaleY: 1});

const snapSizeAndRotation = ({transform}) => extend(transform, {scaleX: 1, scaleY: 1, rotate: 0});

const snapProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {transform} = draggable;
		const {x, y, scaleX, scaleY, skewX, skewY, rotate} = transform;
		const dist = distance({x, y});

		if (dist < innerRadius) {
			return defaultSnappingAndSize(draggable);
		} else {
			return {
				x: x * dist/denominator,
				y: y * dist/denominator,
				scaleX: scaleX + (1 - scaleX) * (1 - dist/denominator),
				scaleY: scaleY + (1 - scaleY) * (1 - dist/denominator),
				skewX: skewX * dist/denominator,
				skewY: skewY * dist/denominator,
				rotate: rotate * dist/denominator
			};
		}
	};
};

const snapRotationProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {transform} = draggable;
		const dist = distance(transform);

		return dist < innerRadius  ?
			defaultSnapping(draggable) :
			extend(transform, {rotate: transform.rotate * dist/denominator})
	};
};

const snapSizeProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {transform} = draggable;
		const {x, y, scaleX, scaleY} = transform;
		const dist = distance({x, y});

		return dist < innerRadius ?
			defaultSnappingAndSize(draggable) :
			extend(
				draggable.transform,
				{
					scaleX: scaleX + (1 - scaleX) * (1 - dist/denominator),
					scaleY: scaleY + (1 - scaleY) * (1 - dist/denominator)
				}
			);
	};
};

const snapSizeAndRotationProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {transform} = draggable;
		const {x, y, scaleX, scaleY, rotate} = transform;
		const dist = distance({x, y});

		return dist < innerRadius ?
			defaultSnappingAndSize(draggable) :
			extend(
				draggable.transform,
				{
					scaleX: scaleX + (1 - scaleX) * (1 - dist/denominator),
					scaleY: scaleY + (1 - scaleY) * (1 - dist/denominator),
					rotate: rotate * dist/denominator
				}
			);
	}
};


const withCustomSnapProps = (_snapTransform, _customSnapProps) => {
	return (...args) => {
		const snapTransform = isFunction(_snapTransform) ? _snapTransform(...args) : _snapTransform;
		const customSnapProps = isFunction(_customSnapProps) ? _customSnapProps(...args) : _customSnapProps;
		return extend(snapTransform, {customSnapProps})
	};
};

export {
	defaultSnapping,
	defaultSnappingAndSize,
	noSnapping,
	snapPosition,
	snapRotation,
	snapSize,
	snapPositionAndRotation,
	snapPositionAndSize,
	snapSizeAndRotation,
	snapProportionally,
	snapRotationProportionally,
	snapSizeProportionally,
	snapSizeAndRotationProportionally,
	withCustomSnapProps
};