import {EDGES, getClosestEdge} from '../utils/edge-utils';
import SnapTransformers from '../../../lib/defaults/default-snap-transformers';
import {extend} from '../utils/extend';

const snapRotation = (draggableDescriptor, targetSize) => {
	return extend(
		SnapTransformers.noSnapping(draggableDescriptor),
		{rotate: EDGES[getClosestEdge(draggableDescriptor.transform, targetSize).edge].rotation}
	);
};

export {snapRotation};