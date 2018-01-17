const noProps = () => {};

const staticAndLowFrequencyProps = (draggable) => ({
    dragState: draggable.dragState,
});

const allProps = (draggable) => draggable;

const draggableCollectors = {
    noProps,
    staticAndLowFrequencyProps,
    allProps
};

export {draggableCollectors};

/*
Cheap

1. dragState
2. dragVelocity
3. dragDisplacement

Medium
isBeingDragged      DONE
isReleased          DONE
isSnapping??        PROBABLY EASY

Expensive:
dragVelocity        PROBABLY EASE
dragDisplacement    MAYBE VERY TRICKY! - Maybe just do it inside the springRender callback  - after all it is supposedly very cheap operations. But can it be fed back to original??

draggableConfig:
- stiffness                                         YES
- damping                                           YES
- sticky?? (or is that a prop instead??)            YES
- snapBack                                          MAYBE
- dragMode                                          MAYBE

//And then remove it from the context (sticky and springConfig)
*/