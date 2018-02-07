import {EDGES, getClosestEdge} from '../utils/edge-utils';
import SnapTransformers from '../../../lib/defaults/default-snap-transformers';
import {extend} from '../utils/extend';

const snapRotation = (dragStateDescriptor) => {
	const targetSize = {
		width: dragStateDescriptor.targetWidth,
		height: dragStateDescriptor.targetHeight
	};

	return extend(
		SnapTransformers.noSnapping(dragStateDescriptor),
		{rotate: EDGES[getClosestEdge(dragStateDescriptor.transform, targetSize).edge].rotation}
	);
};

export {snapRotation};