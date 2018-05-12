import React from 'react';
import makeDraggable from '../../src/make-draggable';

const TransitionElement = ({dragState}) => <div className={`transition-element ${dragState}`}/>;
const DraggableTransitionElement = makeDraggable()(TransitionElement);

export {DraggableTransitionElement};