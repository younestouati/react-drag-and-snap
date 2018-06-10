import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import CustomPropTypes from '../prop-types/custom-prop-types';
import PositionSpringSwitch from './position-spring-switch';
import { getCSSHidingRulesAsObject } from '../helpers/misc/css-hider';
import { isNullOrUndefined } from '../utils/type-utils';
import { shallowEqual } from '../utils/object-utils';

const SpringRendererApplier = (props) => {
    const {
        onRegrab,
        isVisible,
        children,
        transform,
        contextSize,
        draggableCenterInBorderBoxCoordinates,
    } = props;
    const {
        x, y, rotate, scaleX, scaleY, skewX,
    } = transform;
    /*
    * Offset x and y by half the context size, since x and y are in a coordinate system that
    * has its origo in the middle of the dragSnapContext - not the upper left corner. It would
    * be tempting just to set left: 50%, and top: 50% to achieve this, thus eliminating the
    * need of know the contextSize. However, 'splitting' the positioning across left/top and
    * transform sometimes leads to rounding errors in Chrome
    */
    const xToApply = (contextSize.width / 2) + x;
    const yToApply = (contextSize.height / 2) + y;
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            onTouchStart={onRegrab}
            onMouseDown={onRegrab}
            style={{
                lineHeight: 0,
                display: 'inline-block',
                transformOrigin: '0 0',
                transform: `${'' +
                    'translate3d('}${xToApply}px, ${yToApply}px, 0) ` +
                    `rotate(${rotate}deg) ` +
                    `scaleX(${scaleX}) ` +
                    `scaleY(${scaleY}) ` +
                    `skewX(${skewX}deg) ` +
                    /* eslint-disable max-len */
                    `translate3d(-${draggableCenterInBorderBoxCoordinates.x}px, -${draggableCenterInBorderBoxCoordinates.y}px, 0) ` +
                /* eslint-enable max-len */
                '',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                position: 'absolute',
                left: 0,
                top: 0,
                ...(isVisible ? {} : getCSSHidingRulesAsObject()),
            }}
        >
            {children}
        </div>
    );
};

SpringRendererApplier.propTypes = {
    contextSize: CustomPropTypes.size.isRequired,
    draggableCenterInBorderBoxCoordinates: CustomPropTypes.point.isRequired,
    transform: CustomPropTypes.transform.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onRegrab: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

// Component needed because react motion only support a single child,
// whereas we want to pass in an array of children (original element and drag clone)
const Tweener = ({ children, transform, displacement }) => children(transform, displacement);

const nullTransform = {
    x: 0,
    y: 0,
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
};

class SpringRenderer extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const newState = {
            snapTargetId: props.snapTargetId,
            isPositionSnapped: props.isPositionSnapped,
            isSnappingBack: props.isSnappingBack,
            isActive: props.isActive,
            flipIsActive: !state.isActive && props.isActive,
        };

        const isSwichingSnapTarget = (
            props.snapTargetId !== state.snapTargetId
            && !isNullOrUndefined(props.snapTargetId)
            && !isNullOrUndefined(state.snapTargetId)
        );

        const isStartingOrStoppingSnapping = (
            props.isPositionSnapped !== state.isPositionSnapped
            && !isNullOrUndefined(props.isPositionSnapped)
            && !isNullOrUndefined(state.isPositionSnapped)
        );

        const isSnappingBack = props.isSnappingBack && !state.isSnappingBack;

        return (isSwichingSnapTarget || isStartingOrStoppingSnapping || isSnappingBack)
            ? { ...newState, springActivations: state.springActivations + 1 }
            : newState;
    }

    constructor(props) {
        super(props);

        this.state = {
            flipIsActive: false,
            springActivations: 0,
        };

        this.atRest = true;
        this.boundRestHandler = this.restHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        // If transform hasn't changed (the draggable is not moving), consider at rest, unless it is
        // still active - that is grabbed (but not moved)
        if (!shallowEqual(prevProps.transform, this.props.transform)) {
            this.atRest = !this.props.isActive;
        }

        if (!prevProps.isReleased && this.props.isReleased && this.atRest) {
            this.props.onRestAfterRelease();
        }
        
        // Flip isActive flag for one frame allowing react motion to update to right start position before animation
        if (this.state.flipIsActive) {
            /* eslint-disable-next-line react/no-did-update-set-state */
            this.setState({ flipIsActive: false });  
        }
    }

    activateSpring() {
        const { springActivations } = this.state;
        this.setState({ springActivations: springActivations + 1 });
    }

    restHandler() {
        this.atRest = true;
        if (this.props.isReleased) {
            this.props.onRestAfterRelease();
        }

        // Important that this is called after onRestAfterRelease as the unit tests rely
        // on it (this method is only needed for testing anyway)
        this.props.onRest();
    }

    render() {
        const {
            transform, children, springConfig, sticky, isReleased, isActive,
        } = this.props;
        const { springActivations, flipIsActive } = this.state;
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
                onRest={this.boundRestHandler}
            >
                {
                    springTransform => (
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
    /* eslint-disable */
    snapTargetId: PropTypes.string,
    isPositionSnapped: PropTypes.bool,
    isSnappingBack: PropTypes.bool.isRequired,
    /* eslint-enable */
    springConfig: CustomPropTypes.springConfig.isRequired,
    sticky: PropTypes.bool.isRequired,
};

SpringRenderer.defaultProps = {
    transform: nullTransform,
    onRest: () => {},
};

export { SpringRenderer, SpringRendererApplier };
