import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransforms } from '../lib-proxy';

const Square = () => <div className="square" />;
const Round = () => <div className="circle" />;

const squareConfigDefault = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(100),
    snapTransform: SnapTransforms.withCustomSnapProps(SnapTransforms.snapAllButScale, { gray: 1 }),
};

const roundConfigDefault = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(100),
    snapTransform: SnapTransforms.withCustomSnapProps(SnapTransforms.snapAllButScale, { radius: 50 }),
};

const SquareTargetDefault = makeSnapTarget(squareConfigDefault)(Square);
const RoundTargetDefault = makeSnapTarget(roundConfigDefault)(Round);

export { SquareTargetDefault, RoundTargetDefault };
