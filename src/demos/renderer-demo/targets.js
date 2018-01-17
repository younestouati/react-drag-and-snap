import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import {Criteria} from '../../lib/defaults/default-snap-criteria';
import {defaultSnapping, snapSizeAndRotation} from '../../lib/defaults/default-snap-descriptors';

const Round = () => <div className="square"/>;

const largeReachConfig = {
    snapCriteria: Criteria.isCenterWithinRadius('300%')
};

const leavesPositionConfig= {
    snapCriteria: Criteria.isCenterWithinRadius(100),
    snapDescriptor: snapSizeAndRotation
};

const LargeReachTarget = makeSnapTarget(largeReachConfig)(Round);
const LeavesPositionTarget = makeSnapTarget(leavesPositionConfig)(Round);

export {LargeReachTarget, LeavesPositionTarget};