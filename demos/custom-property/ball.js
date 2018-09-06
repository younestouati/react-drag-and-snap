import React from 'react';
import { makeDraggable } from '../lib-proxy';

const Ball = ({
    customSnapProps, dragDisplacement, dragState, isSnapping,
}) => {
    const { radius, gray } = customSnapProps;

    return (
        <div
            className="ball"
            style={{
                borderRadius: `${radius || 0}%`,
                filter: `grayscale(${gray || 0})`,
            }}
        />
    );
};

const DraggableBall = makeDraggable()(Ball);

export { DraggableBall };
