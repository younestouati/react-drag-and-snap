import React, {Component} from 'react';
import makeDraggable from '../../lib/make-draggable';

class SquareWithTopLevelState extends Component {
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

const DraggableSquareWithTopLevelState = makeDraggable(SquareWithTopLevelState);

export {DraggableSquareWithTopLevelState};

