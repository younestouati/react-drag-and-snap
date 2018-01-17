import React, {Component} from 'react';
import makeDraggable from '../../lib/make-draggable';

class SubComponent extends Component {
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
		return this.state.counter;
	}
}

class SquareWithDeepState extends Component {
	render() {
		return (
			<div className="state-square">
				<SubComponent/>
			</div>
		);
	}
}

const DraggableSquareWithDeepState = makeDraggable()(SquareWithDeepState);

export {DraggableSquareWithDeepState};

