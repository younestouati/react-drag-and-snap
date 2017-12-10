import React from 'react';
import PropTypes from 'prop-types';
import {EDGES} from './utils/edge-utils';

function getRotation(x,y) {
	let rotation = EDGES.right.rotation;
	rotation = (x === -50) ?  EDGES.left.rotation : rotation;
	rotation = (y === 50) ? EDGES.bottom.rotation : rotation;
	rotation = (y === -50) ? EDGES.top.rotation: rotation;
	return rotation;
}

const AvatarContainer = ({x, y, z, scale, children}) => (
	<div
		className="avatar-container"
		style={{
			left: `${x + 50}%`,
			top: `${y + 50}%`,
			zIndex: z,
			transform: `translate(-50%,-50%) rotate(${getRotation(x,y)}deg) scale(${scale})`
		}}
	>
		{children}
	</div>
);

AvatarContainer.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	z: PropTypes.number.isRequired,
	scale: PropTypes.number.isRequired,
	children: PropTypes.element.isRequired
};

export {AvatarContainer};
