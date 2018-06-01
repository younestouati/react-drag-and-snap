import React from 'react';
import { makeSnapTarget, SnapCriteria } from '../lib-proxy';
import { DraggableBall } from './ball';

const config = {
    snapCriteria: SnapCriteria.isCenterWithinRadius('300%'),
};

const Square = ({ hasBall }) => (
    <div className="square">
        {
            hasBall
                ? <DraggableBall />
                : null
        }
    </div>
);

const SquareSnapTarget = makeSnapTarget(config)(Square);

export { SquareSnapTarget };
