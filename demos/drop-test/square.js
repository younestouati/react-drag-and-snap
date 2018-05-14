import React from 'react';
import {makeDraggable} from '../lib-proxy';

const DraggableSquare = makeDraggable()(() => <div className="drag-square"/>);

export {DraggableSquare};