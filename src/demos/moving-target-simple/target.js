import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';

const Target = () => <div className="target"/>;
const SnapTarget = makeSnapTarget()(Target);

export {SnapTarget};