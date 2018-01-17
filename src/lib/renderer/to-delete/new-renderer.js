import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../prop-types/custom-prop-types';
import {Motion, spring} from 'react-motion';
import {shallowClone} from '../utils/object-utils';
import {SmoothPositionSpringDisabler} from './smooth-position-spring-disabler';
import {PropMonitor} from './prop-monitor';

class SpringRendererApplier extends Component {
	render() {
		const {onRegrab, isVisible, children, transform} = this.props;
		const {x, y, rotation, scaleX, scaleY, skewX} = transform;

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
	transform: CustomPropTypes.transform.isRequired,
	isVisible: PropTypes.bool.isRequired,
	onRegrab: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
};

//Component needed because react motion only support a single child, 
//whereas we want to pass in an array of children (original element and drag clone)
const Tweener = ({children, transform, displacement}) => children(transform, displacement);

const nullTransform = {
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0
};

class SpringRenderer extends Component {
	constructor(props) {
		super(props);

        this.state = {
            flipIsActive: false,
            springActivations: 0
        };

		this.atRest = true;
	}

    //TODO: Consider using componentDidUpdate instead. Seems like this is called synchronously, when state in
    //parent component (make-draggable) is set, which means onRestAfterRelease may be called earlier than
    //one would expect!
	componentWillReceiveProps(nextProps) {
        const {springActivations} = this.state;
        const propMonitor = new PropMonitor(this.props, nextProps);
        propMonitor.ifShallowChange('transform', () => this.atRest = !nextProps.isActive);
        propMonitor.ifBecomingTrue('isReleased', () => this.atRest ? nextProps.onRestAfterRelease() : null);
        propMonitor.ifBecomingFalse('isReleased', () => console.log('Is no longer released!'));
        
        propMonitor.ifValueChange('snapTargetId', () => this.setState({springActivations: springActivations + 1}));
        propMonitor.ifBooleanChange('isPositionSnapped', () => this.setState({springActivations: springActivations + 1}));
        propMonitor.ifBecomingTrue('isSnappingBack', () => this.setState({springActivations: springActivations + 1}));

        //Flip isActive flag for one frame, given react motion a chance to update to right start position before animation
        propMonitor.ifBecomingTrue('isActive', () => requestAnimationFrame(() => this.setState({flipIsActive: false})));
        propMonitor.ifBecomingFalse('isActive', () => this.setState({flipIsActive: true}));
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
		const {transform, children, springConfig, sticky, isReleased, isActive} = this.props;
        const {springActivations, flipIsActive} = this.state;
        const useSpring = isActive && !flipIsActive;

		return (
            <SmoothPositionSpringDisabler
                springActivations={springActivations}
                springConfig={springConfig}
                disableDisabler={!sticky || isReleased}
            >
                {
                    ({damping, stiffness, isSpringEnabledForPosition}) => {
                        const positionSpringConfig = sticky ? {damping, stiffness} : springConfig;

                        return (
                            <Motion
                                style={{
                                    x: useSpring && isSpringEnabledForPosition ? spring(transform.x, positionSpringConfig) : transform.x,
                                    y: useSpring && isSpringEnabledForPosition ? spring(transform.y, positionSpringConfig) : transform.y,
                                    rotation: useSpring ? spring(transform.rotation, springConfig) : transform.rotation,
                                    scaleX: useSpring ? spring(transform.scaleX, springConfig) : transform.scaleX,
                                    scaleY: useSpring ? spring(transform.scaleY, springConfig) : transform.scaleY,
                                    skewX: useSpring ? spring(transform.skewX, springConfig) : transform.skewX,
                                }}
                                onRest={this.restHandler.bind(this)}
                            >
                                {
                                    (springTransform) =>  {
                                        const displacement = {x: 0, y: 0};
                                        const transformToApply = shallowClone(springTransform);

                                        if (isSpringEnabledForPosition) {
                                            displacement.x = springTransform.x - transform.x;
                                            displacement.y = springTransform.y - transform.y;
                                        } else {
                                            transformToApply.x = transform.x;
                                            transformToApply.y = transform.y;
                                        }

                                        return (
                                            <Tweener 
                                                transform={transformToApply}
                                                displacement={displacement}
                                            >
                                                {children}
                                            </Tweener>
                                        );
                                    }
                                }
                            </Motion>
                        )
                    }
                }
            </SmoothPositionSpringDisabler>
		);
	}
}

SpringRenderer.propTypes = {
	transform: CustomPropTypes.transform.isRequired,
	children: PropTypes.func.isRequired,
	onRestAfterRelease: PropTypes.func.isRequired,
    onRest: PropTypes.func,
    isActive: PropTypes.bool.isRequired,
    isReleased: PropTypes.bool.isRequired,
    snapTargetId: PropTypes.string,
    isPositionSnapped: PropTypes.bool.isRequired,
    isSnappingBack: PropTypes.bool.isRequired,
	springConfig: PropTypes.shape({
		stiffness: PropTypes.number.isRequired,
		damping: PropTypes.number.isRequired
	}).isRequired,
	sticky: PropTypes.bool.isRequired
};

SpringRenderer.defaultProps = {
    transform: nullTransform,
	onRest: () => {}
};

export {SpringRenderer, SpringRendererApplier};