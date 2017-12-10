import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import makeSnapTarget from '../../lib/make-snap-target';
import {isMoveLegal} from './custom-snap-criteria/is-move-legal';
import {Criteria} from '../../lib/defaults/default-snap-criteria';

class Square extends Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.isCenterOverTarget !== nextProps.isCenterOverTarget || 
			this.props.isLegalMove !== nextProps.isLegalMove ||
			!!this.props.children !== !!nextProps.children
		);
	}

	render() {
		const {position, children, width, height, isCenterOverTarget, isLegalMove} = this.props;
		const classes = classNames('square', { //TODO: GET RID OF CLASS NAMES DEPENDENCY!!
			'is-over': isCenterOverTarget,
			'legal-move': isLegalMove,
			'black': (position[0] + position[1]) % 2 === 0
		});

		return (
			<div className={classes} style={{width, height}}>
				{children}
			</div>
		);
	}
} 

Square.propTypes = {
	position: PropTypes.arrayOf(PropTypes.number).isRequired,
	children: PropTypes.element,
	width: PropTypes.string.isRequired,
	height: PropTypes.string.isRequired,
	isCenterOverTarget: PropTypes.bool.isRequired,
	isLegalMove: PropTypes.bool.isRequired
};

Square.defaultProps = { //TODO: GET RID OF THIS. SHOULD ALWAYS BE INJECTED BY SNAP TARGET HOC!
	isLegalMove: false,
	isCenterOverTarget: false
};

const snapConfig = {
	dragSnapCriteria: Criteria.never,
	releaseSnapCriteria: [
		Criteria.isCenterOverTarget,
		isMoveLegal
	]
};

const customCollector = (draggables, ownProps) => {
	return {
		isCenterOverTarget: draggables.some(draggable => Criteria.isCenterOverTarget(draggable, ownProps)),
		isLegalMove: draggables.some(draggable => isMoveLegal(draggable, ownProps))
	};
}

const SquareTarget = makeSnapTarget(snapConfig, customCollector)(Square);
export {SquareTarget};
