import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import CustomPropTypes from '../prop-types/custom-prop-types';
import { shallowClone } from '../utils/object-utils';

/**
 * The purpose of the spring switch is to allow for gracefully transitioning between a draggable being and not being
 * subject to spring animation. When the draggable is in 'sticky' mode (which it is by default), the position of it
 * is not subject to spring animation while it is being dragged. Only when transitioning between being in the control
 * of finger/cursor and snapTarget, will it do spring animation of its position (note that other properties - scale,
 * rotation and skew - are subject to spring animation at all times).
 *
 * Let's consider the moment a sticky draggable starts snapping to a snapTarget. In this moment it must transition
 * from being stuck to the finger/cursor into spring animating to the position of the snapTarget. This spring
 * animation must gradually wear off until the draggable gets stuck to the snapTarget.
 *
 * While the draggable is stuck to finger/cursor, the spring position of the draggable is calculated (but not applied).
 * That allows us to transition to using the spring position instantly (and the spring would be 'primed' with built-up
 * energy from the previous movement). The spring will, however, trail behind the applied ('stuck' or 'raw') position
 * of the draggable, so switching instantly would lead to an abrupt change in position. To avoid this, we determine the
 * offset behind the raw position and spring position at the moment we wish to switch, and we add this offset to the
 * spring position, while the spring animation is used.
 *
 * Finally, we use another (higher order, if you will) spring interpolation to gradually transition back from spring
 * animation to being stuck (this time to the snap target).
 */
class PositionSpringSwitch extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const currentDelta = {
            x: props.springTransform.x - props.rawTransform.x,
            y: props.springTransform.y - props.rawTransform.y,
        };

        if (state.activations !== props.activations) {
            const startDelta = state.currentDelta;

            return {
                activations: props.activations,
                isSpringOnForPosition: true,
                startDelta,
                currentDelta,
            };
        }

        return {
            currentDelta,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            isSpringOnForPosition: props.alwaysOn,
            /* eslint-disable react/no-unused-state */
            activations: 0,
            currentDelta: { x: 0, y: 0 },
            /* eslint-enable react/no-unused-state */
            startDelta: { x: 0, y: 0 },
        };
    }

    componentDidUpdate() {
        if (this.state.isSpringOnForPosition) {
            /* eslint-disable-next-line react/no-did-update-set-state */
            this.setState({ isSpringOnForPosition: false });
        }
    }

    render() {
        const {
            children, rawTransform, springTransform, springConfig, alwaysOn,
        } = this.props;
        const { isSpringOnForPosition, startDelta } = this.state;

        return (
            <Motion
                style={{
                    multiplier: isSpringOnForPosition ? 1 : spring(0, springConfig),
                }}
            >
                {({ multiplier }) => {
                    const transformToApply = shallowClone(springTransform);

                    if (!alwaysOn) {
                        /* eslint-disable max-len */
                        transformToApply.x = ((1 - multiplier) * rawTransform.x) + ((springTransform.x - startDelta.x) * multiplier);
                        transformToApply.y = ((1 - multiplier) * rawTransform.y) + ((springTransform.y - startDelta.y) * multiplier);
                        /* eslint-enable max-len */
                    }

                    const displacement = {
                        x: transformToApply.x - rawTransform.x,
                        y: transformToApply.y - rawTransform.y,
                    };

                    return children(transformToApply, displacement);
                }}
            </Motion>
        );
    }
}

PositionSpringSwitch.propTypes = {
    rawTransform: CustomPropTypes.transform.isRequired,
    springTransform: CustomPropTypes.transform.isRequired,
    /* eslint-disable-next-line react/no-unused-prop-types */
    activations: PropTypes.number.isRequired,
    alwaysOn: PropTypes.bool.isRequired,
    springConfig: CustomPropTypes.springConfig.isRequired,
    children: PropTypes.func.isRequired,
};

export default PositionSpringSwitch;
