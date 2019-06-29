import React from 'react';

import { Container } from './container/container';
import { FloatingHeadsDemo } from './floating-heads/index';
import { StateDemo } from './state-demo/index';
import { ChessBoard } from './chess-board/index';

import { NestedDraggablesDemo } from './nested-draggables/index';
import { RendererDemo } from './renderer-demo/index';
import { EyeDemo } from './eyes/index';
import { MovingTargetDemo } from './moving-target/index';
import { CustomPropertyDemo } from './custom-property/index';
import { SelfTransformDemo } from './self-transform/index';
import ProportionalDemo from './proportional-demo/index';
import CardGameDemo from './card-game/index';

import { BoxModelDemo } from './box-model/box-model';
import './demo-styles.css';

const demoComponents = {
    boxModelDemo: {
        component: <BoxModelDemo />,
        displayName: 'Box Model Demo',
    },
    nestedDraggablesDemo: {
        component: <NestedDraggablesDemo />,
        displayName: 'Nested Draggables',
    },
    rendererDemo: {
        component: <RendererDemo />,
        displayName: 'Renderer Demo',
    },
    eyeDemo: {
        component: <EyeDemo />,
        displayName: 'Eye Demo',
    },
    container: {
        component: <Container />,
        displayName: 'Container',
    },
    floatingHeads: {
        component: <FloatingHeadsDemo />,
        displayName: 'Floating Heads',
    },
    chess: {
        component: <ChessBoard />,
        displayName: 'Chess',
    },
    stateDemo: {
        component: <StateDemo />,
        displayName: 'State Demo',
    },
    movingTarget: {
        component: <MovingTargetDemo />,
        displayName: 'Moving Target',
    },
    customDemo: {
        component: <CustomPropertyDemo />,
        displayName: 'Custom Property Demo',
    },
    selfTransform: {
        component: <SelfTransformDemo />,
        displayName: 'Self Transform',
    },
    proportionalDemo: {
        component: <ProportionalDemo/>,
        displayName: 'Proportional Snapping',
    },
    cardGame: {
        component: <CardGameDemo />,
        displayName: 'Card Game',
    },
};

class Demos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDemo: 'cardGame',
        };
    }

    demoChangeHandler(e) {
        this.setState({ currentDemo: e.target.value });
    }

    render() {
        const values = Object.keys(demoComponents);

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ height: '50px' }}>
                    <select
                        defaultValue={this.state.currentDemo}
                        onChange={this.demoChangeHandler.bind(this)}
                    >
                        {values.map(val => (
                            <option value={val} key={val}>
                                {demoComponents[val].displayName}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{
                    width: '100%', height: 'calc(100% - 50px)', position: 'relative', outline: '1px solid lightgray', overflow: 'auto',
                }}
                >
                    {demoComponents[this.state.currentDemo].component}
                </div>
            </div>
        );
    }
}
export default Demos;
