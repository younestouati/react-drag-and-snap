import React from 'react';
import { makeDraggable } from '../lib-proxy';

const TransitionElement = ({ dragState }) => <div className={`transition-element ${dragState}`} />;
const DraggableTransitionElement = makeDraggable()(TransitionElement);

export { DraggableTransitionElement };
