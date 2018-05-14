import React from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../prop-types/custom-prop-types';
import {shallowClone} from '../utils/object-utils';
import {Motion, spring} from 'react-motion';

class PositionSpringSwitch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialRawTransform: props.rawTransform,
			isSpringOnForPosition: props.alwaysOn,
			startDelta: {x: 0, y: 0}
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.activations !== nextProps.activations) {
			const startDelta = {
				x: this.props.springTransform.x - this.props.rawTransform.x,
				y: this.props.springTransform.y - this.props.rawTransform.y
			};

			this.setState({isSpringOnForPosition: true, startDelta, initialRawTransform: this.props.rawTransform});
			requestAnimationFrame(() => this.setState({isSpringOnForPosition: false}));
		}
	}

	render() {
		const {children, rawTransform: currentRawTransform, springTransform, springConfig, alwaysOn} = this.props;
		const {isSpringOnForPosition, startDelta, initialRawTransform} = this.state;

		//TODO: EXPLAIN THIS!!
		const rawTransform = isSpringOnForPosition ? initialRawTransform : currentRawTransform;

		return (
			<Motion
				style={{
					multiplier: isSpringOnForPosition ? 1 : spring(0, springConfig)
				}}
			>
				{({multiplier}) => {
					const transformToApply = shallowClone(springTransform);

					if (!alwaysOn) {
						const delta = {
							x: springTransform.x - rawTransform.x,
							y: springTransform.y - rawTransform.y
						};

						transformToApply.x = rawTransform.x + (delta.x - startDelta.x) * multiplier;
						transformToApply.y = rawTransform.y + (delta.y - startDelta.y) * multiplier;
					}

					const displacement = {
						x: transformToApply.x - rawTransform.x,
						y: transformToApply.y - rawTransform.y
					};

					return 	children(transformToApply, displacement);	
				}}
			</Motion>
		);
	}
}

PositionSpringSwitch.propTypes = {
	rawTransform: CustomPropTypes.transform.isRequired,
	springTransform: CustomPropTypes.transform.isRequired,
	activations: PropTypes.number.isRequired,
	switchOffAutomatically: PropTypes.bool.isRequired,
	alwaysOn: PropTypes.bool.isRequired,
	springConfig: PropTypes.object.isRequired
};

export {PositionSpringSwitch};