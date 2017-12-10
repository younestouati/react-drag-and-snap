import React, {Component} from 'react';
import {SpringRenderer} from './renderers/spring-renderer';

let DELTA = 20;
const SPRING_CONFIG = {stiffness: 120, damping: 14};

class SpringEnablerTest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			x: 0,
			y: 20,
			ignoreSticky: false
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
					sticky={false}
				>
					<div style={{width: '50px', height: '50px', display: 'inline-block', background: 'red', opacity: 0.3}}/>
				</SpringRenderer>
				<SpringRenderer
					x={this.state.x}
					y={this.state.y}
					ignoreSticky={this.state.ignoreSticky}
					springConfig={SPRING_CONFIG}
					sticky={true}
				>
					<div style={{width: '50px', height: '50px', display: 'inline-block', background: 'red'}}/>
				</SpringRenderer>
			</div>
		);
	}
}

export {SpringEnablerTest};
