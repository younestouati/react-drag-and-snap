import React, { Component } from 'react';

const distance = function (p1, p2 = {x: 0., y: 0}) {
	return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
};

class Target extends Component {
	render() {
		const {draggedItems, children} = this.props;
		const text = draggedItems.length ? `Dist: ${distance(draggedItems[0].transform)}` : '';

		return (
			<div
				style={{
					display: 'inline-block',
					outline: '5px dashed green',
					position: 'relative',
					width: '250px',
					height: '100px',
					background: draggedItems.some((d) => d.isSnappingToThisTarget)  ? 'red' : 'white'
				}}
			>
				{children ? children : `Target ${text}`}
			</div>
		);
	}
}

export {Target};
