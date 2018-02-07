import React, {Component} from 'react';

class Square extends Component {
	render() {
		const {isSnapping, dragState} = this.props;

		const snapText = isSnapping ? 'Is snapping' : '';

		return (
			<div style={{
				display: 'inline-block',
				outline: '3px dashed #333',
				width: '250px',
				height: '100px'
			}}>
				Hej {dragState} and {snapText}
			</div>
		);
	}
}

export {Square};
