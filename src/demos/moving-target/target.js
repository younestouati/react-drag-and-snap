import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';

const SnapTarget = makeSnapTarget()(() => <div className="target"/>);

export {SnapTarget};