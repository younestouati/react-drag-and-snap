import React, {Component} from 'react';
import DragSnapContext from '../../lib/drag-snap-context';
import {SquareSnapTarget} from './targets';

import './styles.css';

class EasyEscapeDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ballIndex: 2
        };
    }

	render() {
        const {ballIndex} = this.state;

		return (
            <div className="easy-escape-demo">
                <DragSnapContext>
                    <div className="target-wrapper">
                        <SquareSnapTarget 
                            hasBall={ballIndex === 0}
                            onDropComplete={
                                () => this.setState({ballIndex: 0})
                            }
                        />
                    </div>
                    <div className="target-wrapper">
                        <SquareSnapTarget
                            hasBall={ballIndex === 1}
                            onDropComplete={
                                () => this.setState({ballIndex: 1})
                            }
                            easyEscape={true}
                        />
                    </div>
                    <div className="target-wrapper">
                        <SquareSnapTarget
                            hasBall={ballIndex === 2}
                            onDropComplete={
                                () => this.setState({ballIndex: 2})
                            }
                            easyEscape={true}
                        />
                    </div>
                </DragSnapContext>
            </div>
		);
	}
}

export {EasyEscapeDemo};