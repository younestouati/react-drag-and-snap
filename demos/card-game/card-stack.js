import { makeSnapTarget, SnapCriteria, SnapTransforms } from '../lib-proxy';
import { CardStack } from './tmp';

const snapToStack = (draggableDescriptor, snapDescriptor) => {
    const numberOfCardsInstack = snapDescriptor.props.children.length;

    const targetIndex = (draggableDescriptor.dragData.containerIndex === snapDescriptor.props.containerIndex)
        ? numberOfCardsInstack - 1
        : numberOfCardsInstack;

    return snapDescriptor.snapTarget.predictCardTransform(targetIndex);
};

const snapAllIncludingCustomSnapProps = ({ faceUp }) => (
    SnapTransforms.withCustomSnapProps(snapToStack, { faceUp })
);

/*
const dragSnapTransform = (draggableDescriptor, targetDescriptor, draggedItems) => {
    const isAlreadyInStack = (draggableDescriptor.dragData.stackIndex === targetDescriptor.props.stackIndex);
    const notEscaped = draggableDescriptor.snapCount === 1;

    const transform = isAlreadyInStack && notEscaped
        ? SnapTransforms.noSnapping
        : snapAllIncludingCustomSnapProps(targetDescriptor.props);

    return transform(draggableDescriptor, targetDescriptor, draggedItems);
};
*/


const releaseSnapTransform = (draggableDescriptor, targetDescriptor, draggedItems) => {
    const transform = snapAllIncludingCustomSnapProps(targetDescriptor.props);

    return transform(draggableDescriptor, targetDescriptor, draggedItems);
};

const releaseSnapCriteria = (draggableDescriptor) => {
    if (draggableDescriptor.dragData.containerIndex === null) {
        return false;
    }

    return true;
};

const config = {
    releaseSnapTransform,
    snapCriteria: SnapCriteria.isCenterWithinRadius('150%'),
    dragSnapTransform: SnapTransforms.noSnapping,
};

export default makeSnapTarget(config)(CardStack);
