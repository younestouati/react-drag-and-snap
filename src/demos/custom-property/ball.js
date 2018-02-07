import React from 'react';
import makeDraggable from '../../lib/make-draggable';
/*
const distance = (p1, p2 = {x: 0, y: 0}) => (
	Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))
);*/
/*
TODO: MAKE SURE THAT IT REMEMBERS IF IT IS/WAS SNAPPING. MAKE SURE THAT
EVERYTHING IS TRANSFERED AS CUSTOM PROPS. NO NUMBERS IN HERE!! 

ALSO MAKE SURE THAT IT ONLY SNAPS TO/FROM SHAPE OR COLOR. AT LEAST DON'T
MIX IT UP.
*/
const Ball = ({customSnapProps, dragDisplacement, dragState, isSnapping}) => {
    let {radius, gray} = customSnapProps;
    /*
    if (isSnapping) {
        radius = Math.max(0, 50 * (1 - distance(dragDisplacement)/200));
    } else {
        radius = Math.min(50, 50 * distance(dragDisplacement)/200);
    }
    */
    return (
        <div
            className="ball"
            style={{
                borderRadius: `${radius || 0}%`,
                filter: `grayscale(${gray || 0})`
            }}
        />
    );
};

/*
const config = {
    stiffness: 4,
    damping: 5
};*/

const DraggableBall = makeDraggable(/*config*/)(Ball); 

export {DraggableBall};