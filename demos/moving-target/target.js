import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';
import Criteria from '../../src/defaults/default-snap-criteria';

const config = {
	snapCriteria: Criteria.isCenterWithinRadius('400%')
};

const SnapTarget = makeSnapTarget(config)(() => <div className="target"/>);

export {SnapTarget};