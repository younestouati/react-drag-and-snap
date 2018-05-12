import React from 'react';

const distance = function (p1, p2 = {x: 0., y: 0}) {
	return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
};

class Target extends React.Component {
	render() {
		const {borderWidth = 0, borderWidth2, isBorderBox = false, padding = 0} = this.props;
		const {draggedItems, children} = this.props;
		const text = draggedItems.length ? `Dist: ${distance(draggedItems[0].transform)}` : '';

		return (
			<div
				style={{
					display: 'inline-block',
					border: `${borderWidth}px dashed green`,
					borderRightWidth: (borderWidth2 || borderWidth) + 'px',
					borderBottomWidth: (borderWidth2 || borderWidth) + 'px',
					padding: `${padding}px`,
					position: 'relative',
					width: '250px',
					height: '100px',
					boxSizing:  isBorderBox ? 'border-box' : 'context-box',
					background: draggedItems.some((d) => d.isSnappingToThisTarget)  ? 'darkgray' : 'white'
				}}
			>
				<div
					style={{
						display: 'block',
						boxSizing: 'border-box',
						background: 'orange'
					}}
				>
					{children ? children : `Target ${text}`}
				</div>
			</div>
		);
	}
}

export {Target};
