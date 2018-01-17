import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const TransitionElement = ({dragState}) => <div className={`transition-element ${dragState}`}/>;
const DraggableTransitionElement = makeDraggable()(TransitionElement);

export {DraggableTransitionElement};