import React from 'react';
import { makeDraggable } from '../lib-proxy';

const DraggableBall = makeDraggable()(({ isDragClone }) => <div className="ball" style={{ background: isDragClone ? 'blue' : 'red' }} />);

export { DraggableBall };
