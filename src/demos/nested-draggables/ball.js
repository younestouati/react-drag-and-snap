import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const Ball = ({radius, children, onClick}) => (
    <div 
        className="nested-ball"
        style={{
            width: `${radius}px`,
            height: `${radius}px`
        }}
        onClick={onClick}
    >
        {children}
    </div>
);

const DraggableBall = makeDraggable()(Ball); 

export {DraggableBall};