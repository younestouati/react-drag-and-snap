import React from 'react';
import {makeSnapTarget, SnapCriteria} from '../lib-proxy';

const config = {
	snapCriteria: SnapCriteria.isCenterWithinRadius('400%')
};

const SnapTarget = makeSnapTarget(config)(() => <div className="target"/>);

export {SnapTarget};