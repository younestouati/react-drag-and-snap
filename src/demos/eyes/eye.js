import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import {Criteria} from '../../lib/defaults/default-snap-criteria';
import {snapTargetCollectors} from '../../lib/defaults/default-snap-target-collectors';

const EYE_RADIUS = 32;
const IRIS_RADIUS = 8;
const Eye = ({draggedItems}) => {
    let offsetX = 0;
    let offsetY = 0;

    if (draggedItems.length) {
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
    snapCriteria: Criteria.never
};

const EyeTarget = makeSnapTarget(config, snapTargetCollectors.allProps)(Eye);

export {EyeTarget};