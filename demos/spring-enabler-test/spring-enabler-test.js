import React from 'react';
import {SpringRenderer} from './renderers/spring-renderer';

let DELTA = 20;
const SPRING_CONFIG = {stiffness: 800, damping: 100};

//THIS SEEMS TO WORK FINE, EXCEPT WHEN THE SYSTEM IS OVERDAMPED!!
function getRestTime() {
	const t = 10 / SPRING_CONFIG.damping * 1000;

	if (Math.pow(SPRING_CONFIG.damping, 2) > 4 * SPRING_CONFIG.stiffness) {
		console.log('It is overdamped!!! ');
	}

	return t;
}

class SpringEnablerTest extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			x: 0,
			y: 20,
			ignoreSticky: false,
			isAtRest: false
		}

		this.animationId = requestAnimationFrame(this.animate.bind(this));
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.animationId);
	}

	animate() {
		const {x} = this.state;

		if (x < 300) {
			this.setState({x: x + DELTA});
			DELTA++;
			this.animationId = requestAnimationFrame(this.animate.bind(this));
		} else {
			this.setState({x: x + 10, ignoreSticky: true});
			setTimeout(() => this.setState({isAtRest: true}), getRestTime());	
		}
	}

	render() {
		return (
			<div className="spring-enabler-test">
				<SpringRenderer
					x={this.state.x}
					y={this.state.y}
					ignoreSticky={this.state.ignoreSticky}
					springConfig={SPRING_CONFIG}
					sticky={true}
				>
					<div style={{width: '50px', height: '50px', display: 'inline-block', background: this.state.isAtRest ? 'green' : 'red'}}/>
				</SpringRenderer>
			</div>
		);
	}
}

export {SpringEnablerTest};
/*
				<SpringRenderer
					x={this.state.x}
					y={this.state.y}
					ignoreSticky={this.state.ignoreSticky}
					springConfig={SPRING_CONFIG}
					sticky={false}
				>
					<div style={{width: '50px', height: '50px', display: 'inline-block', background: this.state.isAtRest ? 'green' : 'red', opacity: 0.3}}/>
				</SpringRenderer>*/