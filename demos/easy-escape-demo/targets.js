import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';
import Criteria from '../../src/defaults/default-snap-criteria';
import {DraggableBall} from './ball';

const config = {
    snapCriteria: Criteria.isCenterWithinRadius('300%')
};

const Square = ({hasBall}) => (
    <div className="square">
        {
            hasBall 
                ? <DraggableBall/>
                : null
        }
    </div>
);

const SquareSnapTarget = makeSnapTarget(config)(Square);

export {SquareSnapTarget};