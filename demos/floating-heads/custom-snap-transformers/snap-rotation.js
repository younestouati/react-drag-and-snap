import { EDGES, getClosestEdge } from '../utils/edge-utils';
import { SnapTransformers } from '../../lib-proxy';
import { extend } from '../utils/extend';

const snapRotation = (draggableDescriptor, targetSize) => ({
    ...SnapTransformers.noSnapping(draggableDescriptor),
    rotate: EDGES[getClosestEdge(draggableDescriptor.transform, targetSize).edge].rotation,
});

export { snapRotation };
