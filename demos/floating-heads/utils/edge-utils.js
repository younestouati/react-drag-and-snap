import { clamp } from './clamp';

const clampedPercentage = fraction => `${clamp(fraction * 100, -50, 50)}%`;

const EDGES = {
    top: {
        rotation: -180,
        x: ({ x }, { width }) => clampedPercentage(x / width),
        y: () => '-50%',
        distToPoint: ({ y }, { height }) => Math.abs(-height / 2 - y),
    },
    bottom: {
        rotation: 0,
        x: ({ x }, { width }) => clampedPercentage(x / width),
        y: () => '50%',
        distToPoint: ({ y }, { height }) => Math.abs(height / 2 - y),
    },
    left: {
        rotation: 90,
        x: () => '-50%',
        y: ({ y }, { height }) => clampedPercentage(y / height),
        distToPoint: ({ x }, { width }) => Math.abs(-width / 2 - x),
    },
    right: {
        rotation: -90,
        x: () => '50%',
        y: ({ y }, { height }) => clampedPercentage(y / height),
        distToPoint: ({ x }, { width }) => Math.abs(width / 2 - x),
    },
};

const edgesByDistanceToPoint = (point, container) => (
    (e1, e2) => EDGES[e1].distToPoint(point, container) - EDGES[e2].distToPoint(point, container)
);

const getClosestEdge = function (point, containerSize) {
    const edges = Object.keys(EDGES);
    edges.sort(edgesByDistanceToPoint(point, containerSize));

    return {
        edge: edges[0],
        distance: EDGES[edges[0]].distToPoint(point, containerSize),
    };
};

export { getClosestEdge, EDGES };
