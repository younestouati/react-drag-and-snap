// This proxy imports and reexports the react-drag-and-snap-libraries exports. All demos load the exports through
// this proxy. Makes it easier to switch between having the demos use a production version of the library of the
// a version based on the source files in this repo (during development).

import {
    makeDraggable,
    makeSnapTarget,
    DragSnapContext,
    InternalSnapTargetTransform,
    SnapTransformers,
    SnapCriteria,
    SnapPriorities,
    DraggableCollectors,
    SnapTargetCollectors,
    SpringConfigurations,
} from '../src/index';

export {
    makeDraggable,
    makeSnapTarget,
    DragSnapContext,
    InternalSnapTargetTransform,
    SnapTransformers,
    SnapCriteria,
    SnapPriorities,
    DraggableCollectors,
    SnapTargetCollectors,
    SpringConfigurations,
};
