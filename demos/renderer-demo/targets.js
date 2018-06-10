import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransformers } from '../lib-proxy';

const Round = () => <div className="square" />;

const largeReachConfig = {
    snapCriteria: SnapCriteria.isCenterWithinRadius('300%'),
};

const leavesPositionConfig = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(100),
    snapTransform: SnapTransformers.snapScaleAndRotation,
};

const LargeReachTarget = makeSnapTarget(largeReachConfig)(Round);
const LeavesPositionTarget = makeSnapTarget(leavesPositionConfig)(Round);

export { LargeReachTarget, LeavesPositionTarget };
