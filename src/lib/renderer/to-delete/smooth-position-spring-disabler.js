import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../prop-types/custom-prop-types';
import {Motion, spring} from 'react-motion';

//Very 'stiff' spring config that almost corresponds to no spring effect at all.
const TARGET_CONFIG = {damping: 60, stiffness: 1800};

//This config is used for the 'second-order-spring', that interpolates the config of the actual spring. It starts from the user
//applied config and interpolates to the TARGET_CONFIG above. It is chosen to to come to rest quickly (in about 0.2 seconds),
//and not to overshoot too much (almost critically dampend).
const interpolationConfig = {stiffness: 1517, damping: 46};

class SmoothPositionSpringDisabler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSpringEnabledForPosition: false,
			isDisablingSpring: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.springActivations !== nextProps.springActivations) {
			this.setState({isDisablingSpring: false, isSpringEnabledForPosition: true}); //Make sure it starts over in case it was already in the process of disabling. 
			requestAnimationFrame(() => this.setState({isDisablingSpring: true}));
		}
	}

	restHandler() {
		//Rest handler is also invoked when we temporarily set isDisablingSpring to false, when restarting the ongoing disabling process,
		//We won't to ignore this case in here. We can do that by checking that isDisablingSpring is false
		if (this.state.isDisablingSpring) {
			this.setState({isDisablingSpring: false, isSpringEnabledForPosition: false});
		}
	}

	render() {
		const {springConfig, children, disableDisabler} = this.props;
		const {isDisablingSpring, isSpringEnabledForPosition} = this.state;

		return (
			<Motion
				style={{
					damping: isDisablingSpring ? spring(TARGET_CONFIG.damping, interpolationConfig) : springConfig.damping,
					stiffness: isDisablingSpring ? spring(TARGET_CONFIG.stiffness, interpolationConfig) : springConfig.stiffness
				}}
				onRest={this.restHandler.bind(this)}
			>
				{({stiffness, damping}) => disableDisabler ?
					children({...springConfig, isSpringEnabledForPosition: true}) :
					children({stiffness, damping, isSpringEnabledForPosition})}
			</Motion>
		);
	}
}

SmoothPositionSpringDisabler.propTypes = {
	springActivations: PropTypes.number.isRequired,
	springConfig: CustomPropTypes.springConfig.isRequired,
	disableDisabler: PropTypes.bool.isRequired,
	children: PropTypes.func.isRequired
};

export {SmoothPositionSpringDisabler};