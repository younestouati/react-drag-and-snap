import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransformers } from '../lib-proxy';

const Snapper = () => <div className="snapper" />;

const snapConfig = {
    snapTransform: SnapTransformers.noSnapping,
    dragSnapCriteria: SnapCriteria.never,
    releaseSnapCriteria: SnapCriteria.always,
};

const SnapTarget = makeSnapTarget(snapConfig)(Snapper);

export { SnapTarget };

