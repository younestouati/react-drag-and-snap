import {EDGES, getClosestEdge} from '../utils/edge-utils';
import {clamp} from '../utils/clamp';

const VELOCITY_MULTIPLIER = 80;

const snapToEdge = ({transform, velocity}, {width, height}) => {
	const {x, y} = transform;
	const {x: vx, y: vy} = velocity;

	const extrapolatedPoint = {
		x: clamp(x + vx * VELOCITY_MULTIPLIER, -width/2, width/2),
		y: clamp(y + vy * VELOCITY_MULTIPLIER, -height/2, height/2)
	};

	const closestEdge = EDGES[getClosestEdge(extrapolatedPoint, {width, height}).edge];

	return {
		x: closestEdge.x(extrapolatedPoint, {width, height}),
		y: closestEdge.y(extrapolatedPoint, {width, height}),
		rotate: closestEdge.rotation
	};
};

export {snapToEdge}