import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';
import Criteria from '../../src/defaults/default-snap-criteria';
import SnapTransformers from '../../src/defaults/default-snap-transformers';

const Round = () => <div className="square"/>;

const largeReachConfig = {
    snapCriteria: Criteria.isCenterWithinRadius('300%')
};

const leavesPositionConfig= {
    snapCriteria: Criteria.isCenterWithinRadius(100),
    snapTransform: SnapTransformers.snapScaleAndRotation
};

const LargeReachTarget = makeSnapTarget(largeReachConfig)(Round);
const LeavesPositionTarget = makeSnapTarget(leavesPositionConfig)(Round);

export {LargeReachTarget, LeavesPositionTarget};