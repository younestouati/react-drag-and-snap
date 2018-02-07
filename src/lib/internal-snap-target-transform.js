import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {shallowClone} from './utils/object-utils'; 

const transformProps = ['x', 'y', 'scaleX', 'scaleY', 'scale', 'skewX', 'skewY', 'rotate'];
const defaultTransform = {
	x: 0,
	y: 0,
	scale: 1,
	skewX: 0,
	skewY: 0,
	rotate: 0
};

class InternalSnapTargetTransform extends Component {
	constructor(props) {
		super(props);
		this.transform = defaultTransform;
	}

	componentWillReceiveProps(newProps) {
		if (transformProps.some((prop) => this.transform[prop] !== newProps[prop])) {
			this.context.setInternalTransformation(shallowClone(newProps));
			this.transform = shallowClone(newProps);
		}
	}

	render() {
		const {children, x, y, scale, scaleX, scaleY, rotate, skewX, skewY} = this.props;

		const _scaleX = typeof scaleX !== 'undefined' ? `scaleX(${scaleX})` : '';
		const _scaleY = typeof scaleY !== 'undefined' ? `scaleY(${scaleY})` : '';

		//Wrapped in extra (non moving) div to ensure that getBoundingClientRect isn't impacted by the transform
		return (
			<div>
				<div
					style={{
						transformOrigin: '50% 50%',
						transform: `
							translate3d(${x}px, ${y}px, 0)
							scale(${scale})
							${_scaleX}
							${_scaleY}
							rotate(${rotate}deg)
							skewX(${skewX}deg)
							skewY(${skewY}deg)
						`
					}}
				>
					{children}
				</div>
			</div>
		);
	};
}

InternalSnapTargetTransform.contextTypes = {
	setInternalTransformation: PropTypes.func.isRequired
};

InternalSnapTargetTransform.propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	scale: PropTypes.number,
	scaleX: PropTypes.number,
	scaleY: PropTypes.number,
	rotate: PropTypes.number,
	skewX: PropTypes.number,
	skewY: PropTypes.number
};

InternalSnapTargetTransform.defaultProps = defaultTransform;

export default InternalSnapTargetTransform;
