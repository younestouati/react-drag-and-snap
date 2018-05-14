import React from 'react';
import {makeDraggable, makeSnapTarget, SnapCriteria, SnapTargetCollectors} from '../lib-proxy';

const EYE_RADIUS = 32;
const IRIS_RADIUS = 8;
const Eye = ({draggedItems}) => {
    let offsetX = 0;
    let offsetY = 0;

    if (draggedItems.some(d => d.dragState === 'dragged')) {
        //The x and y are in the local coordinate system of the snapTarget (i.e. the eye). Origo is the center of the eye.
        const {x, y} = draggedItems[0].transform;
        const dist = Math.sqrt(x*x + y*y);

        offsetX = x / dist * (EYE_RADIUS - IRIS_RADIUS);
        offsetY = y / dist * (EYE_RADIUS - IRIS_RADIUS);
    }

    return (
        <div
            className="eye"
            style={{
                width: `${EYE_RADIUS * 2}px`,
                height: `${EYE_RADIUS * 2}px`
            }}
        >
            <div
                className="iris"
                style={{
                    width: `${IRIS_RADIUS * 2}px`,
                    height: `${IRIS_RADIUS * 2}px`,
                    transform: `translate(calc(${offsetX}px - 50%), calc(${offsetY}px - 50%)`
                }}
            />
        </div>
    );
};

const config = {
    snapCriteria: SnapCriteria.never
};

const EyeTarget = makeSnapTarget(config, SnapTargetCollectors.allProps)(Eye);

export {EyeTarget};