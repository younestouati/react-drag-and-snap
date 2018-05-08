import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const DraggableBall = makeDraggable()(({isDragClone}) => <div className="ball" style={{background: isDragClone ? 'blue' : 'red'}}/>); 

export {DraggableBall};