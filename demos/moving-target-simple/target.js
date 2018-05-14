import React from 'react';
import {makeSnapTarget} from '../lib-proxy';

const Target = () => <div className="target"/>;
const SnapTarget = makeSnapTarget()(Target);

export {SnapTarget};