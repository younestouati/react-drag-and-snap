import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const DraggableSquare = makeDraggable(() => <div className="drag-square"/>);

export {DraggableSquare};