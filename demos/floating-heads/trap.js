import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from '../shared/custom-prop-types';
import { scalePoint, getOrigo, byDistance, extractPoint, addPoints, arePointsDifferent } from './utils/point-utils';
import { sort } from './utils/sort';
import { makeSnapTarget, InternalSnapTargetTransform, SnapCriteria, SnapTargetCollectors } from '../lib-proxy';
import { Motion, spring, presets } from 'react-motion';
import { AnimatedTransform } from '../shared/animated-transform';
import { Avatar } from './avatar';

class Trap extends React.Component {
    static getDerivedStateFromProps(props) {
        return {
            trappedUserPosition: props.trappedUserPosition,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            trappedUserPosition: getOrigo(),
        };
    }

    componentDidUpdate() {
        if (arePointsDifferent(this.state.trappedUserPosition, getOrigo())) {
            /* eslint-disable-next-line react/no-did-update-set-state */
            this.setState({ trappedUserPosition: getOrigo() });
        }
    }

    getPosition(basePosition) {
        const { draggedItems, trappedUser } = this.props;
        const snappedItem = draggedItems.find(d => d.isSnappingToThisTarget);
        let offset = getOrigo();

        if (snappedItem) {
            offset = snappedItem.cursorPosition;
        } else if (draggedItems.length) {
            offset = scalePoint(extractPoint(sort(draggedItems, byDistance)[0].transform), 0.15);
        }

        return trappedUser ? basePosition : addPoints(offset, basePosition);
    }

    render() {
        const { trappedUserPosition } = this.state;
        const {
            draggedItems, trappedUser, onKillUser, show,
        } = this.props;
        const basePosition = {
            x: 0,
            y: show ? -20 : 200,
        };
        const { x, y } = this.getPosition(basePosition);
        const scale = draggedItems.some(d => d.isSnappingToThisTarget) || trappedUser ? 1.3 : 1;

        return (
            <Motion
                style={{
                    x: spring(x, { stiffness: 120, damping: 14 }),
                    y: spring(y, { stiffness: 120, damping: 14 }),
                    scale: spring(scale, presets.wobbly),
                }}
                onRest={onKillUser}
            >
                {
                    ({ x, y, scale }) => (
                        <InternalSnapTargetTransform x={x} y={y}>
                            <div className="trap">
                                {
                                    trappedUser ? (
                                        <AnimatedTransform x={trappedUserPosition.x} y={trappedUserPosition.y}>
                                            <Avatar id={trappedUser.id} isTrapped />
                                        </AnimatedTransform>
                                    ) : null
                                }
                                <div className="trap-background" style={{ transform: `scale(${scale})` }} />
                            </div>
                        </InternalSnapTargetTransform>
                    )
                }
            </Motion>
        );
    }
}

Trap.propTypes = {
    draggedItems: PropTypes.array.isRequired,
    onKillUser: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    trappedUser: PropTypes.object,
    trappedUserPosition: CustomPropTypes.point2D,
};

const snapConfig = {
    snapCriteria: [
        SnapCriteria.isCenterWithinRadius('250%'),
        SnapCriteria.isNoOtherDraggableSnapping,
    ],
};

const collect = SnapTargetCollectors.allProps;
const TrapTarget = makeSnapTarget(snapConfig, collect)(Trap);

export { TrapTarget };
