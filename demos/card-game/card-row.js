import React from 'react';
import { makeSnapTarget, SnapCriteria, SnapTransforms, SnapTargetCollectors } from '../lib-proxy';
import { CardRow, Card } from './tmp';

const snapToContainer = (draggableDescriptor, snapTargetDescriptor) => {

    const { x, y } = draggableDescriptor.transform;
    const { width, height, props } = snapTargetDescriptor;
    const { draggedItems } = props;
    const snappedItems = draggedItems.filter(d => d.isSnappingToThisTarget);

    const cardCount = props.children.length - draggedItems.length + snappedItems.length;
    const index = CardRow.getCardIndexClosestToPoint(props, { width, height }, cardCount, { x, y });

    const t = CardRow.predictCardTransform(props, { width, height }, cardCount, index);

    return t;
};

const snapAllIncludingCustomSnapProps = ({ faceUp }) => (
    SnapTransforms.withCustomSnapProps(snapToContainer, { faceUp })
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

const dragSnapTransform = (draggableDescriptor, targetDescriptor) => ({
    /*...snapToContainer(draggableDescriptor, targetDescriptor),*/
    x: draggableDescriptor.transform.x,
    y: draggableDescriptor.transform.y,
});

class SnapCardRow extends React.Component {
    render() {
        const { children, draggedItems, snapTargetSize, ...rest } = this.props;
        const childrenToRender = React.Children.toArray(children);
        const snappedItems = draggedItems.filter(d => d.isSnappingToThisTarget);

        let ghostCardIndices = [];

        if (snappedItems.length) {
            const cardCount = childrenToRender.length - draggedItems.length + snappedItems.length;
            ghostCardIndices = snappedItems.map(snappedItem => CardRow.getCardIndexClosestToPoint(
                this.props,
                snapTargetSize,
                cardCount,
                snappedItem.cursorPosition
            ));
/*
            // 1 Get indices of draggedItems!!
            const draggedIndices = draggedItems.map(({ dragData }) => {
                const { suit: draggedSuit, rank: draggedRank } = dragData;
                return childrenToRender.map(child => ({ suit: child.props.suit, rank: child.props.rank }))
                    .findIndex(({ rank, suit }) => suit === draggedSuit && rank === draggedRank);
            });

            ghostCardIndices.forEach((ghostIndex) => {
                const toAdd = draggedIndices.filter(index => index <= ghostIndex).length;
                childrenToRender.splice(ghostIndex + toAdd, 0, <Card frontStyle={{ visibility: 'hidden' }} key={ghostIndex} />);
            });
*/
            console.log(`${ghostCardIndices.length} ghost cards`);
        } else {
            console.log('No ghost cards');
        }

        return (
            <CardRow {...rest} ref={el => this.el = el} emptyIndices={ghostCardIndices}>
                { childrenToRender}
            </CardRow>
        );
    }
}

const config = {
    dragSnapTransform: SnapTransforms.noSnapping,
    releaseSnapTransform,
    snapCriteria: SnapCriteria.isCenterWithinRadius('150%'),
    dragSnapCriteria: SnapCriteria.isCenterWithinRadius('150%'),
};

const collect = SnapTargetCollectors.allProps;
export default makeSnapTarget(config, collect)(SnapCardRow);

/*
    The ghostcards must be removed again when the card is dropped.

    1) When dropped on this container - we should wait until the drop has completed

    2) When dropped on another container we should (maybe) do it immediately
*/