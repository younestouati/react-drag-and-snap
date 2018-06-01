import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransformers } from '../lib-proxy';

const Square = () => <div className="square" />;
const Round = () => <div className="circle" />;

const squareConfigDefault = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(100),
    snapTransform: SnapTransformers.withCustomSnapProps(SnapTransformers.snapAllButScale, { gray: 1 }),
};

const roundConfigDefault = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(100),
    snapTransform: SnapTransformers.withCustomSnapProps(SnapTransformers.snapAllButScale, { radius: 50 }),
};

const squareConfigProportional = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(200),
    snapTransform: SnapTransformers.withCustomSnapProps(SnapTransformers.noSnapping, ({ distance }) => ({ gray: 1 - distance / 200 })),
};

const roundConfigProportional = {
    snapCriteria: SnapCriteria.isCenterWithinRadius(200),
    snapTransform: SnapTransformers.withCustomSnapProps(SnapTransformers.noSnapping, ({ distance }) => ({ radius: 50 * (1 - distance / 200) })),
};

const SquareTargetDefault = makeSnapTarget(squareConfigDefault)(Square);
const RoundTargetDefault = makeSnapTarget(roundConfigDefault)(Round);
const SquareTargetProportional = makeSnapTarget(squareConfigProportional)(Square);
const RoundTargetProportional = makeSnapTarget(roundConfigProportional)(Round);

export { SquareTargetDefault, RoundTargetDefault, SquareTargetProportional, RoundTargetProportional };
