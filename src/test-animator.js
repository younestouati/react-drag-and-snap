import React, { Component } from 'react';
import {Motion, spring, presets} from 'react-motion';

class TestAnimator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			x: 0,
			springConfig: {
				damping: 100,
				stiffness: 100
			}
		}
	}

	restHandler() {
		const {springConfig, startTime} = this.state;
		console.log(`The damping ${springConfig.damping} and stiffness ${springConfig.stiffness} time: ${performance.now() - startTime}ms`);
	}

	animate(damping, stiffness) {
		this.setState({
			springConfig: {
				damping,
				stiffness
			},
			x: 500,
			startTime: performance.now()
		});
	}

	render() {
		return (
			<Motion
				style={{
					x: spring(this.state.x, this.state.springConfig)
				}}
				onRest={this.restHandler.bind(this)}
			>
				{
					({x}) => {
						return (
							<div
								style={{
									display: 'inline-block',
									width: '10px',
									height: '10px',
									background: 'red',
									transform: `
										translate3d(${x}px,0, 0)
									`
								}}
							/>
						)
					}
					}
			</Motion>
		);
	}
}

export default {TestAnimator};