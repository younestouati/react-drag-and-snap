import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Not used, only included for test/development purposes. Replace SpringRenderer with SimpleRenderer in make-draggable to use.

class SimpleRenderer extends Component {
	constructor(props) {
		super(props);

		this.state = props;
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isReleased && nextProps.isReleased) {
			this.setState(nextProps, nextProps.onRestAfterRelease);
		} else {
			this.setState(nextProps);
		}
	}

	render() {
		const {x, y, rotation, scaleX, scaleY, skewX, skewY, children} = this.state;

		return (
			<div
				style={{
					display: 'inline-block',
					transformOrigin: '50% 50%',
					transform: `
						translate3d(calc(${x}px - 50%),calc(${y}px - 50%), 0)
						rotate(${rotation}deg)
						scaleX(${scaleX})
						scaleY(${scaleY})
						skewX(${skewX}deg)
						skewY(${skewY}deg)
					`,
					WebkitTouchCallout: 'none',
					WebkitUserSelect: 'none',
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

SimpleRenderer.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	rotation: PropTypes.number.isRequired,
	scaleX: PropTypes.number.isRequired,
	scaleY: PropTypes.number.isRequired,
	skewX: PropTypes.number.isRequired,
	skewY: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	onRestAfterRelease: PropTypes.func.isRequired,
	isReleased: PropTypes.bool.isRequired
};

export {SimpleRenderer};