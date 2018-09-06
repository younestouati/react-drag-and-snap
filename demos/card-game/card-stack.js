import { makeSnapTarget, SnapCriteria, SnapTransforms } from '../lib-proxy';
import { CardStack, getTransformForCardInCardStack } from './tmp';

const snapToStack = (draggableDescriptor, snapDescriptor) => {
    const numberOfCardsInstack = snapDescriptor.props.children.length;

    const targetIndex = (draggableDescriptor.dragData.stackIndex === snapDescriptor.props.stackIndex)
        ? numberOfCardsInstack - 1
        : numberOfCardsInstack;

    return {
        scale: 1,
        ...getTransformForCardInCardStack(snapDescriptor.props, targetIndex),
    };
};

const snapAllIncludingCustomSnapProps = ({ rotateY, shadow }) => (
    SnapTransforms.withCustomSnapProps(snapToStack, { rotateY, shadow })
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
    if (draggableDescriptor.dragData.stackIndex === null) {
        return false;
    }

    return true;
}

const config = {
    /*dragSnapTransform,*/
    releaseSnapTransform,
    /*snapCriteria: SnapCriteria.isCenterWithinRadius('150%'),*/
    dragSnapCriteria: SnapCriteria.never,
    releaseSnapCriteria,/*: SnapCriteria.always,*/
};

export default makeSnapTarget(config)(CardStack);
