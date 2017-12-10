import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';

//const STIFF_CONFIG = {damping: 30, stiffness: 300}; //TODO: CAN THIS BE FIXED?? OR SHOULD IT DEPEND ON THE STIFFNESS/DAMPING OF THE DRAGGABLE??
//{stiffness: 180, damping: 12} (wobbly gives a pretty nice effect, although more wobbly that fb)
//{stiffness: 120, damping: 14} (gentle) is also alright...q
const STIFF_CONFIG = {stiffness: 120, damping: 14};

/*
 * The smoothSpringEnabler makes it possible to transition from a mode where x and y of the draggable has been applied in a
 * raw fashion, to a spring based animation. This is needed when a draggable has the sticky prop set to true (default value)
 * and is released at which point it should animate (spring animation) to its release snap position.
 * 
 *  Without the SmootSpringEnabler this transition from sticky movement (sticking to the cursor/finger without any spring
 *  effect) to spring animation will cause the draggable to abrubtly jump backwards when released (since the spring position
 *  is trailing the 'raw' position). To mitigate this, the smootSpringEnabler adds and offset to the spring-based position.
 *  However, in order to ensure that the draggable doesn't overshoot its final target position, this offset must be gradually
 *  phased out while draggable finishes its animation. 
*/
class SmoothSpringEnabler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isEnablingSpring: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isSpringEnabled && nextProps.isSpringEnabled) {
			//console.log('GOT IT AS A PROP HERE AND X DIFF IS: ', (nextProps.x - nextProps.xSpring));
			this.setState({isEnablingSpring: true});
		}

		if (this.props.isSpringEnabled && !nextProps.isSpringEnabled) {
			this.setState({isEnablingSpring: false});
		}
	}

	restHandler() {
		this.setState({isEnablingSpring: false});
	}

	render() {
		const {x, xSpring, y, ySpring, children} = this.props;
		const {isEnablingSpring} = this.state;
//console.log('Diff is: ', (x - xSpring), ' but is enabling is: ', isEnablingSpring);
		return (
			<Motion
				style={{
					deltaX: isEnablingSpring ? spring(0, STIFF_CONFIG) : x - xSpring,
					deltaY: isEnablingSpring ? spring(0, STIFF_CONFIG) : y - ySpring
				}}
				onRest={this.restHandler.bind(this)}
			>
				{
					({deltaX, deltaY}) => {
						const _x = isEnablingSpring ? xSpring + deltaX : xSpring;
						const _y = isEnablingSpring ? ySpring + deltaY : ySpring;

						/*if(isEnablingSpring) {
							console.log('The deltaXx is: ', deltaX);
						}*/

						return children({xSpring: _x, ySpring: _y, isEnablingSpring})
					}
				}
			</Motion>
		);
	}
}

SmoothSpringEnabler.propTypes = {
	isSpringEnabled: PropTypes.bool.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	xSpring: PropTypes.number.isRequired,
	ySpring: PropTypes.number.isRequired,
	children: PropTypes.func.isRequired
}

export {SmoothSpringEnabler};