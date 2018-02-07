import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import Criteria from '../../lib/defaults/default-snap-criteria';

const config = {
	snapCriteria: Criteria.isCenterWithinRadius('400%')
};

const SnapTarget = makeSnapTarget(config)(() => <div className="target"/>);

export {SnapTarget};