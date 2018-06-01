import { getClosestEdge } from '../utils/edge-utils';

const whenCloseToEdge = dist => ({ transform }, { width, height }) => (
    getClosestEdge(transform, { width, height }).distance < dist
);

export { whenCloseToEdge };
