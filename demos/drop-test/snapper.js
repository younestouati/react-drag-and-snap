import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';
import SnapTransformers from '../../src/defaults/default-snap-transformers';
import Criteria from '../../src/defaults/default-snap-criteria';

const Snapper = () => <div className="snapper"/>;

const snapConfig = {
	snapTransform: SnapTransformers.noSnapping,
	dragSnapCriteria: Criteria.never,
	releaseSnapCriteria: Criteria.always
};

const SnapTarget = makeSnapTarget(snapConfig)(Snapper);

export {SnapTarget};

