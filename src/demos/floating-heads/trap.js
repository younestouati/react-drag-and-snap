import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from '../shared/custom-prop-types';
import {scalePoint, getOrigo, byDistance, extractPoint, addPoints, arePointsDifferent} from './utils/point-utils';
import {sort} from './utils/sort';
import {extend} from './utils/extend';
import makeSnapTarget from '../../lib/make-snap-target';
import {Motion, spring, presets} from 'react-motion';
import InternalSnapTargetTransform from '../../lib/internal-snap-target-transform';
import {Criteria} from '../../lib/defaults/default-snap-criteria';
import {snapTargetCollectors} from '../../lib/defaults/default-snap-target-collectors';
import {AnimatedTransform} from '../shared/animated-transform';
import {Avatar} from './avatar';

class Trap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			trappedUserPosition: getOrigo()
		};
	}

	componentWillReceiveProps({trappedUserPosition}) {
		if (arePointsDifferent(trappedUserPosition, this.props.trappedUserPosition)) {
			this.setState(
				{trappedUserPosition: extend(trappedUserPosition)},
				() => this.setState({trappedUserPosition: getOrigo()})
			);
		}
	}

	getPosition(basePosition) {
		const {draggedItems, trappedUser} = this.props;
		const snappedItem = draggedItems.find((d) => d.isSnappingToThisTarget);
		let offset = getOrigo();

		if (snappedItem) {
			offset = snappedItem.cursorPosition;
		} else if (draggedItems.length) {
			offset = scalePoint(extractPoint(sort(draggedItems, byDistance)[0].transform), .15);
		}

		return trappedUser ? basePosition : addPoints(offset, basePosition);
	}

	render() {
		const {trappedUserPosition} = this.state;
		const {draggedItems, trappedUser, onKillUser, show} = this.props;
		const basePosition = {
			x: 0,
			y: show ? -20 : 200
		};
		const {x,y} = this.getPosition(basePosition);
		const scale = draggedItems.some((d) => d.isSnappingToThisTarget) || trappedUser ? 1.3 : 1;

		return (
			<Motion
				style={{
					x: spring(x, {stiffness: 120, damping: 14}),
					y: spring(y, {stiffness: 120, damping: 14}),
					scale: spring(scale, presets.wobbly)
				}}
				onRest={onKillUser}
			>
				{
					({x, y, scale}) => (
						<InternalSnapTargetTransform x={x} y={y}>
							<div className="trap">
								{
									trappedUser ? (
										<AnimatedTransform x={trappedUserPosition.x} y={trappedUserPosition.y}>
											<Avatar id={trappedUser.id} isTrapped={true}/>
										</AnimatedTransform>
									) : null
								}
								<div className="trap-background" style={{transform: `scale(${scale})`}}/>
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
	trappedUserPosition: CustomPropTypes.point2D
};

const snapConfig = {
	snapCriteria: [
		Criteria.isCenterWithinRadius('250%'),
		Criteria.isNoOtherDraggableSnapping
	]
};

const collect = snapTargetCollectors.allProps;

const TrapTarget = makeSnapTarget(snapConfig, collect)(Trap);

export {TrapTarget};