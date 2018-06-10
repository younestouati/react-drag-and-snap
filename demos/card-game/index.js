import React from 'react';
import { DragSnapContext } from '../lib-proxy';
import { DraggablePlayingCard } from './draggable-playing-card';
import { CardStackAsTarget } from './card-stack';

import './styles.css';

class CardGameDemo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stackIndex: 0,
        };
    }

    render() {
        const { stackIndex } = this.state;

        const card = <DraggablePlayingCard width={140} height={200} />;

        return (
            <div className="card-game-demo">
                <DragSnapContext>
                    <div className="target-wrapper">
                        <CardStackAsTarget
                            onDropComplete={
                                () => this.setState({ stackIndex: 0 })
                            }
                            easyEscape={true}
                        >
                            {stackIndex === 0 && card}
                        </CardStackAsTarget >
                    </div>
                    <div className="target-wrapper">
                        <CardStackAsTarget
                            onDropComplete={
                                () => this.setState({ stackIndex: 1 })
                            }
                            easyEscape={true}
                        >
                            {stackIndex === 1 && card}
                        </CardStackAsTarget>
                    </div>
                    <div className="target-wrapper">
                        <CardStackAsTarget
                            onDropComplete={
                                () => this.setState({ stackIndex: 2 })
                            }
                            easyEscape={true}
                        >
                            {stackIndex === 2 && card}
                        </CardStackAsTarget>
                    </div>
                </DragSnapContext>
            </div>
        );
    }
}

export { CardGameDemo };

/*
<div className="target-wrapper">
                        <CardStackAsTarget
                            onDropComplete={
                                () => this.setState({stackIndex: 1})
                            }
                        >
                            {stackIndex === 1 && <DraggablePlayingCard/>}
                        </CardStackAsTarget>
                    </div>
                    <div className="target-wrapper">
                        <CardStackAsTarget
                            onDropComplete={
                                () => this.setState({stackIndex: 2})
                            }
                        >
                            {stackIndex === 2 && <DraggablePlayingCard/>}
                        </CardStackAsTarget>
                    </div>
                    */
