import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import {Criteria} from '../../lib/defaults/default-snap-criteria';
import {defaultSnapping, noSnapping, withCustomSnapProps} from '../../lib/defaults/default-snap-descriptors';

const Square = () => <div className="square"/>;
const Round = () => <div className="circle"/>;

const squareConfigDefault = {
    snapCriteria: Criteria.isCenterWithinRadius(200),
    snapDescriptor: withCustomSnapProps(defaultSnapping, {gray: 1})
};

const roundConfigDefault = {
    snapCriteria: Criteria.isCenterWithinRadius(200),
    snapDescriptor: withCustomSnapProps(defaultSnapping, {radius: 50})
};

const squareConfigProportional = {
    snapCriteria: Criteria.isCenterWithinRadius(200),
    snapDescriptor: withCustomSnapProps(noSnapping, ({distance}) => ({gray: 1 - distance/200}))
};

const roundConfigProportional = {
    snapCriteria: Criteria.isCenterWithinRadius(200),
    snapDescriptor: withCustomSnapProps(noSnapping, ({distance}) => ({radius: 50 * (1  - distance/200)}))
};

const SquareTargetDefault = makeSnapTarget(squareConfigDefault)(Square);
const RoundTargetDefault = makeSnapTarget(roundConfigDefault)(Round);
const SquareTargetProportional = makeSnapTarget(squareConfigProportional)(Square);
const RoundTargetProportional = makeSnapTarget(roundConfigProportional)(Round);

export {SquareTargetDefault,RoundTargetDefault, SquareTargetProportional, RoundTargetProportional};