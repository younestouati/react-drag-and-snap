import React, {Component} from 'react';

class Square extends Component {
	render() {
		const {isSnapping, isDragged, counter = ''} = this.props;

		const snapText = isSnapping ? 'Is snapping' : '';
		const dragText = isDragged ? 'Is dragged' : '';

		return (
			<div style={{
				display: 'inline-block',
				outline: '3px dashed #333',
				width: '250px',
				height: '100px'
			}}>
				Hej ({counter}) {dragText} and {snapText}
			</div>
		);
	}
}

export {Square};
