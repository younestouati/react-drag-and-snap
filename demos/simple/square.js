import React from 'react';

class Square extends React.Component {
	render() {
		const {borderWidth = 0, borderWidth2, isBorderBox = false, padding = 0, className} = this.props;

		return (
			<div 
				style={{
					display: 'inline-block',
					border: `${borderWidth}px dashed #333`,
					borderRightWidth: (borderWidth2 || borderWidth) + 'px',
					borderBottomWidth: (borderWidth2 || borderWidth) + 'px',
					padding: `${padding}px`,
					boxSizing:  isBorderBox ? 'border-box' : 'context-box',
					opacity: 0.5,
					background: 'hotpink',
					width: '250px',
					height: '100px',
					//transform: 'scale(1.2)'
				}}
				className={className}
			>
				<div
					style={{
						display: 'block',
						boxSizing: 'border-box',
						background: 'orange'
					}}
				>
				BorderWidth: {borderWidth}, is borderBox: {isBorderBox ? 'Yes' : 'No'}
				</div>
			</div>
		);
	}
}

export {Square};
