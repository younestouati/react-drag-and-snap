import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../prop-types/custom-prop-types';
import {Motion, spring} from 'react-motion';
import {PositionSpringSwitch} from './position-spring-switch';
import {PropMonitor} from './prop-monitor';

class SpringRendererApplier extends Component {
	render() {
		const {onRegrab, isVisible, children, transform, contextSize, draggableSize} = this.props;
		const {x, y, rotate, scaleX, scaleY, skewX} = transform;

        /* 
         * Offset x and y by half the context size, since x and y are in a coordinate system that has its origo
         * in the middle of the dragSnapContext - not the upper left corner. It would be tempting just to set
         * left: 50%, and top: 50% to achieve this, thus eliminating the need of know the contextSize. However,
         * 'splitting' the positioning across left/top and transform sometimes leads to rounding errors in Chrome
         */
        const _x = contextSize.width/2 + x - draggableSize.width/2;
        const _y = contextSize.height/2 + y - draggableSize.height/2;

		return (
			<div
				onTouchStart={onRegrab}
				onMouseDown={onRegrab}
				style={{
                    lineHeight: 0,
					display: 'inline-block',
					transformOrigin: '50% 50%',
					transform: '' +
						'translate3d(calc(' + _x + 'px), calc(' + _y + 'px), 0) ' +
						'rotate(' + rotate + 'deg) ' +
						'scaleX(' + scaleX + ') ' +
						'scaleY(' + scaleY + ') ' +
						'skewX(' + skewX + 'deg) ' +
					'',
					WebkitTouchCallout: 'none',
					WebkitUserSelect: 'none',
					visibility: isVisible ? 'visible' : 'hidden',
					userSelect: 'none',
					position: 'absolute',
					left: 0,
					top: 0
				}}
			>
				{children}
			</div>
		);
	}
}

SpringRendererApplier.propTypes = {
    contextSize: CustomPropTypes.size.isRequired,
    draggableSize: CustomPropTypes.size.isRequired,
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
    rotate: 0,
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

    activateSpring() {
        const {springActivations} = this.state;
        this.setState({springActivations: springActivations + 1});
    }

    //TODO: Consider using componentDidUpdate instead. Seems like this is called synchronously, when state in
    //parent component (make-draggable) is set, which means onRestAfterRelease may be called earlier than
    //one would expect!
	componentWillReceiveProps(nextProps) {
        const propMonitor = new PropMonitor(this.props, nextProps);
        propMonitor.ifShallowChange('transform', () => this.atRest = !nextProps.isActive);
        propMonitor.ifBecomingTrue('isReleased', () => this.atRest ? nextProps.onRestAfterRelease() : null);

        propMonitor.ifDefinedValueChange('snapTargetId', this.activateSpring.bind(this));
        propMonitor.ifDefinedValueChange('isPositionSnapped', this.activateSpring.bind(this));
        propMonitor.ifBecomingTrue('isSnappingBack', this.activateSpring.bind(this));

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
            <Motion
                style={{
                    x: useSpring ? spring(transform.x, springConfig) : transform.x,
                    y: useSpring ? spring(transform.y, springConfig) : transform.y,
                    rotate: useSpring ? spring(transform.rotate, springConfig) : transform.rotate,
                    scaleX: useSpring ? spring(transform.scaleX, springConfig) : transform.scaleX,
                    scaleY: useSpring ? spring(transform.scaleY, springConfig) : transform.scaleY,
                    skewX: useSpring ? spring(transform.skewX, springConfig) : transform.skewX,
                }}
                onRest={this.restHandler.bind(this)}
            >
                {
                    (springTransform) =>  {
                        return (
                            <PositionSpringSwitch
                                isReleased={isReleased}
                                rawTransform={transform}
                                springTransform={springTransform}
                                activations={springActivations}
                                switchOffAutomatically={!isReleased}
                                alwaysOn={!sticky}
                                springConfig={springConfig}
                            >
                                {
                                    (transformToApply, displacement) => (
                                        <Tweener 
                                            transform={transformToApply}
                                            displacement={displacement}
                                        >
                                            {children}
                                        </Tweener>    
                                    )
                                }
                            </PositionSpringSwitch>
                        )
                    }
                }
            </Motion>
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
    isPositionSnapped: PropTypes.bool,
    isSnappingBack: PropTypes.bool.isRequired,
	springConfig: CustomPropTypes.springConfig.isRequired,
	sticky: PropTypes.bool.isRequired
};

SpringRenderer.defaultProps = {
    transform: nullTransform,
	onRest: () => {}
};

export {SpringRenderer, SpringRendererApplier};