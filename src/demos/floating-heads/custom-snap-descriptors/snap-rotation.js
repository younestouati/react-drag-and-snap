import {EDGES, getClosestEdge} from '../utils/edge-utils';
import {noSnapping} from '../../../lib/defaults/default-snap-descriptors';
import {extend} from '../utils/extend';

const snapRotation = (dragStateDescriptor) => {
	const targetSize = {
		width: dragStateDescriptor.targetWidth,
		height: dragStateDescriptor.targetHeight
	};

	return extend(
		noSnapping(dragStateDescriptor),
		{rotation: EDGES[getClosestEdge(dragStateDescriptor.transform, targetSize).edge].rotation}
	);
};

export {snapRotation};