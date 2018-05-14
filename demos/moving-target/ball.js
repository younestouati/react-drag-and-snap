import React from 'react';
import {makeDraggable} from '../lib-proxy';

const Ball = () => <div className="ball"/>;
const DraggableBall = makeDraggable()(Ball);

export {DraggableBall};