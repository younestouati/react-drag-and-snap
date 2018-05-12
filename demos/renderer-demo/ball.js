import React from 'react';
import makeDraggable from '../../src/make-draggable';

const Ball = () => <div className="ball"/>;

const DraggableBall = makeDraggable()(Ball); 

export {DraggableBall};