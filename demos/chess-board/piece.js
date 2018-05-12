import React from 'react';
import PropTypes from 'prop-types';
import makeDraggable from '../../src/make-draggable';

const Piece = ({piece, dragState, dragVelocity, isDragClone}) => {
	const draggedClass = dragState !== 'inactive' && false ? 'is-dragged' : '';
	const draggedClass2 = isDragClone ? 'is-clone' : 'is-not-clone';

	return <div className={`piece ${piece} ${draggedClass} ${draggedClass2}`}/>;
};

Piece.propTypes = {
	piece: PropTypes.oneOf(['knight']).isRequired, //Only knights are supported in this demo
	dragState: PropTypes.oneOf(['grabbed', 'dragged', 'released', 'inactive'])
};

const config = {
	stiffness: 600,
	damping: 30,
	mode: 'clone'
};

const DraggablePiece = makeDraggable(config)(Piece);
export {DraggablePiece};