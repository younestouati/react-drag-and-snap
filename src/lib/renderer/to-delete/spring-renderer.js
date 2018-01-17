import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';
import {SmoothSpringDisabler} from './smooth-spring-disabler';
import {SmoothSpringEnabler} from './smooth-spring-enabler';
import {shallowEqual} from '../utils/object-utils';

class SpringRendererApplier extends Component {
	render() {
		const {onRegrab, isVisible, children, transform} = this.props;
		const {x, y, rotation, scaleX, scaleY, skewX, skewY} = transform;

		return (
			<div
				onTouchStart={onRegrab}
				onMouseDown={onRegrab}
				style={{
					display: 'inline-block',
					transformOrigin: '50% 50%',
					transform: '' +
						'translate3d(calc(' + x + 'px - 50%),calc(' + y + 'px - 50%), 0) ' +
						'rotate(' + rotation + 'deg) ' +
						'scaleX(' + scaleX + ') ' +
						'scaleY(' + scaleY + ') ' +
						'skewX(' + skewX + 'deg) ' +
						'skewY(' + skewY + 'deg)' +
					'',
					WebkitTouchCallout: 'none',
					WebkitUserSelect: 'none',
					visibility: isVisible ? 'visible' : 'hidden',
					userSelect: 'none',
					position: 'absolute',
					left: '50%',
					top: '50%'
				}}
			>
				{children}
			</div>
		);
	}
}

SpringRendererApplier.propTypes = {
	transform: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		rotation: PropTypes.number.isRequired,
		scaleX: PropTypes.number.isRequired,
		scaleY: PropTypes.number.isRequired,
		skewX: PropTypes.number.isRequired,
		skewY: PropTypes.number.isRequired
	}).isRequired,
	isVisible: PropTypes.bool.isRequired,
	onRegrab: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
};

//Component needed because react motion only support a single child, 
//whereas we want to pass in an array of children (original element and drag clone)
const Tweener = ({children, transform, displacement}) => children(transform, displacement);

class SpringRenderer extends Component {
	constructor(props) {
		super(props);

		this.atRest = true;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.transform && !shallowEqual(this.props.transform || {}, nextProps.transform)) {
			this.atRest = false;
		}

		if (!this.props.isReleased && nextProps.isReleased && this.atRest) {
			nextProps.onRestAfterRelease();
		}
	}

	restHandler() {
		this.atRest = true;
		if (this.props.isReleased) {
			this.props.onRestAfterRelease();
		}

		//Important that this is called after onRestAfterRelease as the unit tests rely on it (this method is only needed for testing anyway)
		this.props.onRest();
	}

	render() {
		const {
			transform,
			children,
			springConfig,
			ignoreSticky,
			isReleased,
			sticky
		} = this.props;

		const isSpringEnabled = !!transform && (!sticky || ignoreSticky || isReleased); //TODO: CONFIRM THAT isReleased IS NEEDED HERE AS WELL
		
		const {
			x = 0,
			y = 0,
			rotation = 0,
			scaleX = 1,
			scaleY = 1,
			skewX = 0,
			skewY = 0
		} = (transform || {});	

		return (
			<SmoothSpringDisabler
				isSpringEnabled={isSpringEnabled}
				springConfig={springConfig}
			>
				{
					({damping, stiffness, isDisablingSpring}) => (
						<Motion
							style={{
								xSpring: spring(x, {damping, stiffness}),
								ySpring: spring(y, {damping, stiffness}),
								rotation: spring(rotation, springConfig),
								scaleX: spring(scaleX, springConfig),
								scaleY: spring(scaleY, springConfig),
								skewX: spring(skewX, springConfig),
								skewY: spring(skewY, springConfig)
							}}
							onRest={this.restHandler.bind(this)}
						>
							{
								({xSpring, ySpring, rotation, scaleX, scaleY, skewX, skewY}) =>  (
									<SmoothSpringEnabler
										isSpringEnabled={isSpringEnabled}
										x={x}
										y={y}
										xSpring={xSpring}
										ySpring={ySpring}
									>
										{
											({xSpring, ySpring, isEnablingSpring}) => {
												const useSpring = isSpringEnabled || isEnablingSpring || isDisablingSpring;
												const _x = useSpring ? xSpring : x;
												const _y = useSpring ? ySpring : y;

												return (
													<Tweener 
														transform={{x: _x, y: _y, rotation, scaleX, scaleY, skewX, skewY}}
														displacement={{x: x - _x, y: y - _y}}
													>
														{children}
													</Tweener>
												);
											}
										}
									</SmoothSpringEnabler>
								)
							}
						</Motion>
					)
				}
			</SmoothSpringDisabler>
		);
	}
}

SpringRenderer.propTypes = {
	transform: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		rotation: PropTypes.number.isRequired,
		scaleX: PropTypes.number.isRequired,
		scaleY: PropTypes.number.isRequired,
		skewX: PropTypes.number.isRequired,
		skewY: PropTypes.number.isRequired,
	}),
	children: PropTypes.func.isRequired,
	onRestAfterRelease: PropTypes.func.isRequired,
	onRest: PropTypes.func,
	isReleased: PropTypes.bool.isRequired,
	ignoreSticky: PropTypes.bool.isRequired,
	springConfig: PropTypes.shape({
		stiffness: PropTypes.number.isRequired,
		damping: PropTypes.number.isRequired
	}).isRequired,
	sticky: PropTypes.bool.isRequired
};

SpringRenderer.defaultProps = {
	onRest: () => {}
};

export {SpringRenderer, SpringRendererApplier};
