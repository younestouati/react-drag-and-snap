import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';

const Target = () => <div className="target"/>;
const SnapTarget = makeSnapTarget()(Target);

export {SnapTarget};