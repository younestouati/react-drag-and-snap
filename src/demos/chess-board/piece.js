import React from 'react';
import PropTypes from 'prop-types';
import makeDraggable from '../../lib/make-draggable';

const Piece = ({piece, isDragged}) => <div className={`piece ${piece} ${isDragged ? 'is-dragged' : ''}`}/>;

Piece.propTypes = {
	piece: PropTypes.oneOf(['knight']).isRequired, //Only knights are supported in this demo
	isDragged: PropTypes.bool
};

const DraggablePiece = makeDraggable(Piece);
export {DraggablePiece};