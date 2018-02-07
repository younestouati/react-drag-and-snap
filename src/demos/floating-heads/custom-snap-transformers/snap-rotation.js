import {EDGES, getClosestEdge} from '../utils/edge-utils';
import SnapTransformers from '../../../lib/defaults/default-snap-transformers';
import {extend} from '../utils/extend';

const snapRotation = (dragStateDescriptor, {width, height}) => {
	const targetSize = {width, height};

	return extend(
		SnapTransformers.noSnapping(dragStateDescriptor),
		{rotate: EDGES[getClosestEdge(dragStateDescriptor.transform, targetSize).edge].rotation}
	);
};

export {snapRotation};