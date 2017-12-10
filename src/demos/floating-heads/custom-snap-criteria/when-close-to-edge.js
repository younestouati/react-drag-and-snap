import {getClosestEdge} from '../utils/edge-utils';

const whenCloseToEdge = (dist) => ({transform, targetWidth: width, targetHeight: height}) => (
	getClosestEdge(transform, {width, height}).distance < dist
);

export {whenCloseToEdge};