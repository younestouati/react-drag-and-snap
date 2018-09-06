import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransforms } from '../lib-proxy';

const snapScaleAndRotationProportionally = (denominator, innerRadius = 0) => (draggable) => {
    const { transform, distance } = draggable;
    const { scaleX, scaleY, rotate } = transform;

    return distance < innerRadius
        ? SnapTransforms.snapAll(draggable)
        : {
            ...draggable.transform,
            scaleX: scaleX + ((1 - scaleX) * (1 - (distance / denominator))),
            scaleY: scaleY + ((1 - scaleY) * (1 - (distance / denominator))),
            rotate: (rotate * distance) / denominator,
        };
};

const config = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(300),
    releaseSnapCriteria: SnapCriteria.never,
    snapTransform: snapScaleAndRotationProportionally(300, 50),
};

const Target = () => <div className="proportional-target" />;

export default makeSnapTarget(config)(Target);
