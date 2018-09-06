import React from 'react';
import { DragSnapContext, makeDraggable } from '../lib-proxy';
import Target from './target';

import './styles.css';

const DraggableSquare = makeDraggable({ sticky: false })(() => <div className="square" />);

const ProportionalDemo = () => (
    <div className="proportional-demo">
        <DragSnapContext>
            <div className="target-wrapper">
                <Target />
            </div>
            <div className="draggable-wrapper">
                <DraggableSquare />
            </div>
        </DragSnapContext>
    </div>
);

export default ProportionalDemo;
