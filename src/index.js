import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Container} from './demos/container/container';
import {FloatingHeadsDemo} from './demos/floating-heads/index';
import {StateDemo} from './demos/state-demo/index';
import {ChessBoard} from './demos/chess-board/index';
import {DropTest} from './demos/drop-test/index';
import {EasyEscapeDemo} from './demos/easy-escape-demo/index';
import {NestedDraggablesDemo} from './demos/nested-draggables/index';
import {RendererDemo} from './demos/renderer-demo/index';
import {EyeDemo} from './demos/eyes/index';
import {MovingTargetDemo} from './demos/moving-target/index';
import {MovingTargetDemoSimple} from './demos/moving-target-simple/index';
import {CustomPropertyDemo} from './demos/custom-property/index';
import {SpringEnablerTest} from './demos/spring-enabler-test/spring-enabler-test';
import {Overlap} from './demos/overlap/overlap';
import {CSSTransitionDemo} from './demos/css-transition/index';

const demoComponents = {
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
    }
}

class Demos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDemo: 'easyEscapeDemo'
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
                <div style={{width: '100%', height: `calc(100% - 50px)`, position: 'relative', outline: '1px solid lightgray'}}>
                    {demoComponents[this.state.currentDemo].component}
                </div>
            </div>
        )    
    }
}

ReactDOM.render(<Demos/>, document.getElementById('root'));