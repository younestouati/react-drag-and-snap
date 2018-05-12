import React from 'react';
import makeDraggable from '../../src/make-draggable';

const DraggableBall = makeDraggable()(({isDragClone}) => <div className="ball" style={{background: isDragClone ? 'blue' : 'red'}}/>); 

export {DraggableBall};