/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import TestComponent from './components/test-component/test-component';
import './box-model.css';

const draggableBoxSizings = ['content-box', 'border-box'];
const draggablePaddings = [0/* , 30 */, [30, 100, 100, 30]];
const draggableMargins = [0/* , 30 */, [30, 100, 100, 30]];
const modes = ['normal', 'global', 'snap'];

const snapBoxSizings = ['content-box', 'border-box'];
const snapPaddings = [0, 30];
const snapMargins = [0, 30];

class BoxModelDemo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'normal',
            animate: false,
        };

        this.setMode = this.setMode.bind(this);
        this.toggleAnimation = this.toggleAnimation.bind(this);
        this.body = document.getElementsByTagName('body')[0];
    }

    componentDidMount() {
        this.DOMElement = ReactDOM.findDOMNode(this.el);
    }

    setMode(changeEvent) {
        this.setState({
            mode: changeEvent.currentTarget.value,
        });
    }

    toggleAnimation(changeEvent) {
        this.setState({
            animate: changeEvent.currentTarget.checked,
        });
    }

    renderControlPanel() {
        return (
            <div className="control-panel">
                <div>
                    <h4>Mode</h4>
                    {modes.map(mode => (
                        <label key={mode}>
                            <input type="radio" name="mode" value={mode} key={mode} onChange={this.setMode} />
                            <span>{mode}</span>
                        </label>
                    ))}
                </div>
                <div>
                    <h4>Animate</h4>
                    <label>
                        <input type="checkbox" name="animate" defaultChecked={false} onChange={this.toggleAnimation} />
                        <span>Animate</span>
                    </label>
                </div>
            </div>
        );
    }

    render() {
        const { mode } = this.state;
        const tests = [];

        draggableBoxSizings.forEach((draggableBoxSizing) => {
            draggablePaddings.forEach((draggablePadding) => {
                draggableMargins.forEach((draggableMargin) => {
                    snapBoxSizings.forEach((snapTargetBoxSizing) => {
                        snapPaddings.forEach((snapTargetPadding) => {
                            snapMargins.forEach((snapTargetMargin) => {
                                tests.push({
                                    draggableBoxSizing,
                                    draggablePadding,
                                    draggableMargin,
                                    snapTargetBoxSizing,
                                    snapTargetPadding,
                                    snapTargetMargin,
                                });
                            });
                        });
                    });
                });
            });
        });

        return (
            <div className="box-model-demo" ref={el => (this.el = el)}>
                {this.renderControlPanel()}
                {
                    tests.map((test, i) => (
                        <TestComponent
                            {...test}
                            key={i}
                            renderIn={mode === 'global' || mode === 'snap' ? this.el : null}
                            mode={mode}
                        />
                    ))
                }
            </div>
        );
    }
}

export { BoxModelDemo };
