import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import SnapTransformers from '../../lib/defaults/default-snap-transformers';
import Criteria from '../../lib/defaults/default-snap-criteria';

const Snapper = () => <div className="snapper"/>;

const snapConfig = {
	snapTransform: SnapTransformers.noSnapping,
	dragSnapCriteria: Criteria.never,
	releaseSnapCriteria: Criteria.always
};

const SnapTarget = makeSnapTarget(snapConfig)(Snapper);

export {SnapTarget};

