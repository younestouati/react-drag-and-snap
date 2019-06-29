import React from 'react';
import { DragSnapContext } from '../lib-proxy';
import Card from './card';
import CardStack from './card-stack';
import { CardRow } from './tmp'; 
import CardRowTarget from './card-row';
import './styles.css';

// cardContainer is a common term for card stacks, rows and fans.
const cardContainers = [
    /*{
        type: 'stack',
        faceUp: false,
        initialCards: [
            { suit: 'hearts', rank: 5 },
            { suit: 'spades', rank: 11 },
        ],
    },
    {
        type: 'stack',
        faceUp: true,
        initialCards: [
            { suit: 'hearts', rank: 3 },
            { suit: 'hearts', rank: 1 },
            { suit: 'diamonds', rank: 1 },
            { suit: 'clubs', rank: 12 },
        ],
    },*/
    {
        type: 'row',
        faceUp: true,
        initialCards: [
            /*{ suit: 'diamonds', rank: 7 },*/
            { suit: 'clubs', rank: 4 },
            { suit: 'clubs', rank: 13 },
            { suit: 'spades', rank: 2 },
        ],
    },
];

const removeCard = (cards, predicate) => cards.filter(c => !predicate(c));
const insertCardAtIndex = (cards, card, index) => {
    const newCards = [...cards];
    newCards.splice(index, 0, card);
    return newCards;
};

function arrayMove(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
}

class CardGameDemo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardsInContainers: cardContainers.map(container => container.initialCards),
        };

        this.boundHandleDrop = this.handleDrop.bind(this);
    }

    handleDrop(draggableDescriptor, snapTargetDescriptor, releaseTransform) {
        const { dragData } = draggableDescriptor;
        const { containerIndex: sourceContainerIndex, suit, rank } = dragData;
        const { containerIndex: targetContainerIndex } = snapTargetDescriptor.props;

        if (targetContainerIndex === null) {
            return;
        }

        this.setState({
            cardsInContainers: this.state.cardsInContainers.map((cards, containerIndex) => {
                if (containerIndex === sourceContainerIndex && containerIndex === targetContainerIndex) {
                    console.log('XXX: IN HERE!!');
                    // TODO: MAKE SURE THAT WE DON'T SUBTRACT ONE HERE??? CONTINUE
                    //const index = snapTargetDescriptor.snapTarget.getCardIndexClosestToPoint(releaseTransform, 1);
                    
                    const index = CardRow.getCardIndexClosestToPoint(
                        snapTargetDescriptor.props,
                        { width: snapTargetDescriptor.width, height: snapTargetDescriptor.height },
                        this.state.cardsInContainers[containerIndex].length,
                        releaseTransform
                    );

                    const removeIndex = cards.findIndex(card => card.suit === suit && card.rank === rank);
                    const t = arrayMove([...cards], removeIndex, index);

                    console.log('Moving card from index ', removeIndex, ' to index ', index);

                    return t;
                    //const cardsWithout = removeCard(cards, card => card.suit === suit && card.rank === rank);
                    //return insertCardAtIndex(cardsWithout, { rank, suit }, index);

                    //https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
                }
                
                // Remove card from the container it came from
                if (containerIndex === sourceContainerIndex) {
                    return removeCard(cards, card => card.suit === suit && card.rank === rank);
                }

                if (containerIndex === targetContainerIndex) {
                    const index = CardRow.getCardIndexClosestToPoint(
                        snapTargetDescriptor.props,
                        { width: snapTargetDescriptor.width, height: snapTargetDescriptor.height },
                        this.state.cardsInContainers[containerIndex].length,
                        releaseTransform
                    );

                    return insertCardAtIndex(cards, { rank, suit }, index);
                }

                // For other containers - just return the cards as they were
                return cards;
            }),
        });
    }

    renderCardsInContainer(containerIndex) {
        return (
            this.state.cardsInContainers[containerIndex].map(({ suit, rank }) => (
                <Card
                    suit={suit}
                    rank={rank}
                    shadow={2}
                    dragData={{ containerIndex, suit, rank }}
                    key={`${suit}_${rank}`}
                />
            ))
        );
    }

    render() {
        return (
            <DragSnapContext>
                <div className="card-game-demo">
                    {
                        cardContainers.map(({ faceUp, type }, containerIndex) => {
                            switch (type) {
                            case 'stack':
                                return (
                                    <div className="container-wrapper" key={containerIndex}>
                                        <CardStack
                                            style={{ width: '20%' }}
                                            borderRadius="2%"
                                            containerIndex={containerIndex}
                                            faceUp={faceUp ? 180 : 0}
                                            onDropComplete={this.boundHandleDrop}
                                            messy
                                        >
                                            {this.renderCardsInContainer(containerIndex)}
                                        </CardStack>
                                    </div>
                                );
                            case 'row':
                                return (
                                    <div className="container-wrapper" key={containerIndex}>
                                        <CardRowTarget
                                            style={{ width: '80%', marginLeft: '20%' }}
                                            aspectRatio={5}
                                            preferredGap={1}
                                            containerIndex={containerIndex}
                                            faceUp={faceUp ? 180 : 0}
                                            onDropComplete={this.boundHandleDrop}
                                        >
                                            {this.renderCardsInContainer(containerIndex)}
                                        </CardRowTarget>
                                    </div>
                                );
                            default:
                                return null;
                            }
                        })
                    }
                </div>
            </DragSnapContext>
        );
    }
}

export default CardGameDemo;
