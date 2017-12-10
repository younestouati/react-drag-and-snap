import {distance} from '../utils/point-utils';
import {extend} from '../utils/object-utils';
import {isFunction} from '../utils/type-utils';

const noSnapping = ({transform}) => transform;

const defaultSnapping = ({transform}) => (
	{
		x: 0,
		y: 0,
		width: transform.width,
		height: transform.height,
		skewX: 0,
		skewY: 0,
		rotation: 0
	}
);

const defaultSnappingAndSize = (draggable) => {
	return extend(
		defaultSnapping(draggable),
		{width: '100%', height: '100%'}
	);
}

const snapPosition = ({transform}) => extend(transform, {x: 0, y: 0});

const snapRotation = ({transform}) => extend(transform, {rotation: 0});

const snapSize = ({transform}) => extend(transform, {width: '100%', height: '100%'});

const snapPositionAndRotation = ({transform}) => extend(transform, {x: 0, y: 0, rotation: 0});

const snapPositionAndSize = ({transform}) => extend(transform, {x: 0, y: 0, width: '100%', height: '100%'});

const snapSizeAndRotation = ({transform}) => extend(transform, {width: '100%', height: '100%', rotation: 0});

const snapProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {targetWidth, targetHeight, transform} = draggable;
		const {x, y, width, height, skewX, skewY, rotation} = transform;
		const dist = distance({x, y});

		if (dist < innerRadius) {
			return defaultSnappingAndSize(draggable);
		} else {
			return {
				x: x * dist/denominator,
				y: y * dist/denominator,
				width: width + (targetWidth - width) * (1 - dist/denominator),
				height: height + (targetHeight - height) * (1 - dist/denominator),
				skewX: skewX * dist/denominator,
				skewY: skewY * dist/denominator,
				rotation: rotation * dist/denominator
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
			extend(transform, {rotation: transform.rotation * dist/denominator})
	};
};

const snapSizeProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {targetWidth, targetHeight, transform} = draggable;
		const {x, y, width, height} = transform;
		const dist = distance({x, y});

		return dist < innerRadius ?
			defaultSnappingAndSize(draggable) :
			extend(
				draggable.transform,
				{
					width: width + (targetWidth - width) * (1 - dist/denominator),
					height: height + (targetHeight - height) * (1 - dist/denominator)
				}
			);
	};
};

const snapSizeAndRotationProportionally = (denominator, innerRadius = 0) => {
	return (draggable) => {
		const {targetWidth, targetHeight, transform} = draggable;
		const {x, y, width, height, rotation} = transform;
		const dist = distance({x, y});

		return dist < innerRadius ?
			defaultSnappingAndSize(draggable) :
			extend(
				draggable.transform,
				{
					width: width + (targetWidth - width) * (1 - dist/denominator),
					height: height + (targetHeight - height) * (1 - dist/denominator),
					rotation: rotation * dist/denominator
				}
			);
	}
};


const withCustomSnapProps = (_snapDescriptor, _customSnapProps) => {
	return (...args) => {
		const snapDescriptor = isFunction(_snapDescriptor) ? _snapDescriptor(...args) : _snapDescriptor;
		const customSnapProps = isFunction(_customSnapProps) ? _customSnapProps(...args) : _customSnapProps;
		return extend(snapDescriptor, {customSnapProps})
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