import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransformers } from '../lib-proxy';

const config = {
    snapTransform: SnapTransformers.snapAll,
    snapCriteria: SnapCriteria.isCenterWithinRadius('100%'),
};

const CardStack = ({ children }) => (
    <div className="card-stack">
        {children}
    </div>
);

const CardStackAsTarget = makeSnapTarget(config)(CardStack);

export { CardStackAsTarget };
