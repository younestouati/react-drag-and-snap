import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import {noSnapping} from '../../lib/defaults/default-snap-descriptors';
import {Criteria} from '../../lib/defaults/default-snap-criteria';

const Snapper = () => <div className="snapper"/>;

const snapConfig = {
	snapDescriptor: noSnapping,
	dragSnapCriteria: Criteria.never,
	releaseSnapCriteria: Criteria.always
};

const SnapTarget = makeSnapTarget(snapConfig)(Snapper);

export {SnapTarget};

