import React from 'react';
import PropTypes from 'prop-types';
import {Motion, spring, presets} from 'react-motion';

const TRANSFORM_PROPS = ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotate', 'skewX', 'skewY'];

const AnimatedTransform = (props) =>  {
	const style = {};

	TRANSFORM_PROPS.forEach((prop) => {
		if (typeof props[prop] !== 'undefined') {
			style[prop] = spring(props[prop], props.springConfig);
		}
	});

	return (
		<Motion
			style={style}
			onRest={props.onRest}
		>
		{
			({x, y, scale, scaleX, scaleY, rotate, skewX, skewY}) => {
				const transforms = [`translateZ(0)`];
				if (typeof x !== "undefined") transforms.push(`translateX(${x}px)`);
				if (typeof y !== "undefined") transforms.push(`translateY(${y}px)`);
				if (typeof scale !== "undefined") transforms.push(`scale(${scale})`);
				if (typeof scaleX !== "undefined") transforms.push(`scaleX(${scaleX})`);
				if (typeof scaleY !== "undefined") transforms.push(`scaleY(${scaleY})`);
				if (typeof rotate !== "undefined") transforms.push(`rotate(${rotate}deg)`);
				if (typeof skewX !== "undefined") transforms.push(`skewX(${skewX}deg)`);
				if (typeof skewY !== "undefined") transforms.push(`skewY(${skewY}deg)`);

				return (
					<div
						className={props.className}
						style={{
							transformOrigin: '50% 50%',
							transform: transforms.join(' ')
						}}>
						{
							typeof props.children === 'function' ?
								props.children({x, y, scale, scaleX, scaleY, rotate, skewX, skewY}) :
								props.children
						}
					</div>
				)
			}
		}
		</Motion>
	);
};

AnimatedTransform.propTypes = {
	springConfig: PropTypes.shape({
		damping: PropTypes.number.isRequired,
		stiffness: PropTypes.number.isRequired
	})
};

AnimatedTransform.defaultProps = {
	springConfig: presets.stiff
};

export {AnimatedTransform};