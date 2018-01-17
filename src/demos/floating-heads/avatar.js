import React from 'react';
import makeDraggable from '../../lib/make-draggable';

const Avatar = ({dragState, isTrapped, id, onClick}) => (
	<div
		onClick={onClick}
		className="avatar"
		style={{
			transform: `scale(${dragState === 'dragged' || isTrapped ? .75 : 1})`,
			backgroundImage: `url('https://randomuser.me/api/portraits/women/${id}.jpg')`
		}}
	/>
);

//{stiffness: 180, damping: 12} (wobbly gives a pretty nice effect, although more wobbly that fb)
//{stiffness: 120, damping: 14} (gentle) is also alright...
const config = {stiffness: 120, damping: 14};//{stiffness: 170, damping: 14};

const DraggableAvatar = makeDraggable(config)(Avatar);
export {DraggableAvatar, Avatar};

