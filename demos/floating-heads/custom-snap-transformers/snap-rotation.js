import { EDGES, getClosestEdge } from '../utils/edge-utils';
import { SnapTransforms } from '../../lib-proxy';
import { extend } from '../utils/extend';

const snapRotation = (draggableDescriptor, targetSize) => ({
    ...SnapTransforms.noSnapping(draggableDescriptor),
    rotate: EDGES[getClosestEdge(draggableDescriptor.transform, targetSize).edge].rotation,
});

export { snapRotation };
