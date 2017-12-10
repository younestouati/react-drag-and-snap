import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../prop-types/custom-prop-types';
import {Motion, spring} from 'react-motion';

const STIFF_CONFIG = {damping: 60, stiffness: 2500};

class SmoothSpringDisabler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDisablingSpring: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isSpringEnabled && !nextProps.isSpringEnabled) {
			this.setState({isDisablingSpring: true});
		}
	}

	restHandler() {
		this.setState({isDisablingSpring: false});
	}

	render() {
		const {springConfig, children} = this.props;
		const {isDisablingSpring} = this.state;

		return (
			<Motion
				style={{
					damping: isDisablingSpring ? spring(STIFF_CONFIG.damping, STIFF_CONFIG) : springConfig.damping,
					stiffness: isDisablingSpring ? spring(STIFF_CONFIG.stiffness, STIFF_CONFIG) : springConfig.stiffness
				}}
				onRest={this.restHandler.bind(this)}
			>
				{({stiffness, damping}) => children({stiffness, damping, isDisablingSpring})}
			</Motion>
		);
	}
}

SmoothSpringDisabler.propTypes = {
	isSpringEnabled: PropTypes.bool.isRequired,
	springConfig: CustomPropTypes.springConfig.isRequired,
	children: PropTypes.func.isRequired
};

export {SmoothSpringDisabler};