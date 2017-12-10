import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const Avatar = ({isDragged, isReleased, isTrapped, id, onClick}) => (
	<div
		onClick={onClick}
		className="avatar"
		style={{
			transform: `scale(${(isDragged && !isReleased) || isTrapped ? .75 : 1})`,
			backgroundImage: `url('https://randomuser.me/api/portraits/women/${id}.jpg')`
		}}
	/>
);

const DraggableAvatar = makeDraggable(Avatar);

export {DraggableAvatar, Avatar};

