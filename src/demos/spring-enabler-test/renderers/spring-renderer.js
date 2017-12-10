import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';
import {SmoothSpringEnabler} from './smooth-spring-enabler';

class SpringRenderer extends Component {
	render() {
		const {x, y, children, springConfig, ignoreSticky, sticky} = this.props;
		const isSpringEnabled = !sticky || ignoreSticky;

		return (
			<Motion
				style={{
					xSpring: spring(x, springConfig),
					ySpring: spring(y, springConfig),
				}}
			>
				{
					({xSpring, ySpring}) =>  (
						<SmoothSpringEnabler
							isSpringEnabled={isSpringEnabled}
							x={x}
							y={y}
							xSpring={xSpring}
							ySpring={ySpring}
						>
							{
								({xSpring, ySpring, isEnablingSpring}) => {
									const useSpring = isSpringEnabled || isEnablingSpring;
									const _x = useSpring ? xSpring : x;
									const _y = useSpring ? ySpring : y;

									return(
										<div
											style={{
												display: 'inline-block',
												transformOrigin: '50% 50%',
												transform: `translate3d(${_x}px,${_y}px, 0)`,
												position: 'absolute',
												left: 0,
												top: 0
											}}
										>
											{children}
										</div>
									)
								}
							}
						</SmoothSpringEnabler>
					)
				}
			</Motion>
		);
	}
}

SpringRenderer.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	ignoreSticky: PropTypes.bool.isRequired,
	springConfig: PropTypes.shape({
		stiffness: PropTypes.number.isRequired,
		damping: PropTypes.number.isRequired
	}).isRequired,
	sticky: PropTypes.bool.isRequired
};


export {SpringRenderer};
