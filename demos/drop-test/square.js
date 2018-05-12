import React from 'react';
import makeDraggable from '../../src/make-draggable';

const DraggableSquare = makeDraggable()(() => <div className="drag-square"/>);

export {DraggableSquare};