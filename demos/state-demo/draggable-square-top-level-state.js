import React from 'react';
import {makeDraggable} from '../lib-proxy';

class SquareWithTopLevelState extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0
		};

		this.interval = setInterval(() => this.setState({counter: this.state.counter + 1}), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="state-square">
				{this.state.counter}
			</div>
		);
	}
}

const DraggableSquareWithTopLevelState = makeDraggable()(SquareWithTopLevelState);

export {DraggableSquareWithTopLevelState};

