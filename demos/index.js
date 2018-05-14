import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from './container/container';
import {FloatingHeadsDemo} from './floating-heads/index';
import {SimpleDemo} from './simple/simple';
import {StateDemo} from './state-demo/index';
import {ChessBoard} from './chess-board/index';
import {DropTest} from './drop-test/index';
import {EasyEscapeDemo} from './easy-escape-demo/index';
import {NestedDraggablesDemo} from './nested-draggables/index';
import {RendererDemo} from './renderer-demo/index';
import {EyeDemo} from './eyes/index';
import {MovingTargetDemo} from './moving-target/index';
import {MovingTargetDemoSimple} from './moving-target-simple/index';
import {CustomPropertyDemo} from './custom-property/index';
import {SpringEnablerTest} from './spring-enabler-test/spring-enabler-test';
import {Overlap} from './overlap/overlap';
import {CSSTransitionDemo} from './css-transition/index';
import {SelfTransformDemo} from './self-transform/index';

import {BoxModelDemo} from './box-model/box-model';
import './demo-styles.css';

const demoComponents = {
    simpleDemo: {
        component: <SimpleDemo/>,
        displayName: 'Simple'
    },
    boxModelDemo: {
        component: <BoxModelDemo/>,
        displayName: 'Box Model Demo'
    },
    easyEscapeDemo: {
        component: <EasyEscapeDemo/>,
        displayName: 'Easy Escape'
    },
    nestedDraggablesDemo: {
        component: <NestedDraggablesDemo/>,
        displayName: 'Nested Draggables'
    },
    rendererDemo: {
        component: <RendererDemo/>,
        displayName: 'Renderer Demo'
    },
    eyeDemo: {
        component: <EyeDemo/>,
        displayName: 'Eye Demo'
    },
    container: {
        component: <Container/>,
        displayName: 'Container'
    },
    floatingHeads: {
        component: <FloatingHeadsDemo/>,
        displayName: 'Floating Heads'
    },
    chess: {
        component: <ChessBoard/>,
        displayName: 'Chess'
    },
    stateDemo: {
        component: <StateDemo/>,
        displayName: 'State Demo'
    },
    movingTarget: {
        component: <MovingTargetDemo/>,
        displayName: 'Moving Target'
    },
    movingTargetSimple: {
        component: <MovingTargetDemoSimple/>,
        displayName: 'Moving Target (Simple)'
    },
    customDemo: {
        component: <CustomPropertyDemo/>,
        displayName: 'Custom Property Demo'
    },
    dropDemo: {
        component: <DropTest/>,
        displayName: 'DropTest'
    },
    springEnablerTest: {
        component: <SpringEnablerTest/>,
        displayName: 'Spring Enabler Test'
    },
    cssTransitionDemo: {
        component: <CSSTransitionDemo/>,
        displayName: 'CSS Transition Demo'
    },
    overlap: {
        component: <Overlap/>,
        displayName: 'Overlap'
    },
    selfTransform: {
        component: <SelfTransformDemo/>,
        displayName: 'Self Transform'
    }
}

class Demos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDemo: 'selfTransform'
        };
    }

    demoChangeHandler(e) {
        this.setState({currentDemo: e.target.value});
    }

    render() {
        const values = Object.keys(demoComponents);

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div style={{height: `50px`}}>
                    <select 
                        defaultValue={this.state.currentDemo}
                        onChange={this.demoChangeHandler.bind(this)}
                    >
                        {values.map((val) => (
                            <option value={val} key={val}>
                                {demoComponents[val].displayName}
                            </option>    
                        ))}
                    </select>
                </div>
                <div style={{width: '100%', height: `calc(100% - 50px)`, position: 'relative', outline: '1px solid lightgray', overflow: 'auto'}}>
                    {demoComponents[this.state.currentDemo].component}
                </div>
            </div>
        )    
    }
}
export default Demos;