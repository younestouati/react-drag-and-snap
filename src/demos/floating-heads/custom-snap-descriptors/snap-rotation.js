import {EDGES, getClosestEdge} from '../utils/edge-utils';
import {noSnapping} from '../../../lib/defaults/default-snap-descriptors';
import {extend} from '../utils/extend';

const snapRotation = (draggable, ownProps) => {
	const targetSize = {
		width: draggable.targetWidth,
		height: draggable.targetHeight
	};

	return extend(
		noSnapping(draggable, ownProps),
		{rotation: EDGES[getClosestEdge(draggable.transform, targetSize).edge].rotation}
	);
};

export {snapRotation};