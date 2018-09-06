import React from 'react';
import { DragSnapContext } from '../lib-proxy';
import Card from './card';
import DummyCard from './dummy-card';
import CardStack from './card-stack';
import './styles.css';

const stacks = [
    {
        faceUp: false,
        initialCards: [
            { suit: 'hearts', rank: 5 },
            { suit: 'spades', rank: 11 },
        ],
    },
    {
        faceUp: true,
        initialCards: [
            /*{ suit: 'hearts', rank: 1 },
            { suit: 'diamonds', rank: 1 },
            { suit: 'clubs', rank: 9 },*/
            { suit: 'clubs', rank: 12 },
        ],
    },
];

class CardGameDemo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardsInStacks: stacks.map(stack => stack.initialCards),
        };
    }

    handleDrop(dragData, targetStackIndex) {
        const { stackIndex: sourceStackIndex, suit, rank } = dragData;

        if (sourceStackIndex === targetStackIndex || targetStackIndex === null) {
            return;
        }

        this.setState({
            cardsInStacks: this.state.cardsInStacks.map((cards, stackIndex) => {
                // Remove card from the stack it came from
                if (stackIndex === sourceStackIndex) {
                    return cards.filter(card => !(card.suit === suit && card.rank === rank));
                }

                // Add card to the stack it was dropped on
                if (stackIndex === targetStackIndex) {
                    return [
                        ...cards,
                        { rank, suit },
                    ];
                }

                // For other stacks - just return the cards as they were
                return cards;
            }),
        });
    }

    render() {
        const { cardsInStacks } = this.state;

        return (
            <DragSnapContext>
                <div className="card-game-demo">
                    {stacks.map(({ faceUp }, index) => (
                        <div className="stack-wrapper" key={index}>
                            <CardStack
                                width="20%"
                                height="200px"
                                borderRadius="2%"
                                stackIndex={index}
                                stackBorder={0} //Remove
                                rotateY={faceUp ? 180 : 0}
                                shadow={0} //2
                                onDropComplete={({ dragData }) => this.handleDrop(dragData, index)}
                                messy={false}
                                messAngle={10}
                            >
                                {
                                    cardsInStacks[index].map(({ suit, rank }) => (
                                        <Card
                                            border={1} // Remove
                                            suit={suit}
                                            rank={rank}
                                            dragData={{ stackIndex: index, suit, rank }}
                                            key={`${suit}_${rank}`}
                                        />
                                    ))
                                }
                            </CardStack>
                        </div>
                    ))}
                    <div>
                        <DummyCard
                            width="20%"
                            height="200px"
                            dragData={{ stackIndex: null }}
                        />
                    </div>
                    <div>
                        <Card
                            width="20%"
                            height="200px"
                            border={1} // Remove
                            suit="c"
                            rank={12}
                            faceUp
                            shadow={false}
                            borderRadius="2%"
                            dragData={{ stackIndex: null }}
                        />
                    </div>
                </div>
            </DragSnapContext>
        );
    }
}

export default CardGameDemo;
