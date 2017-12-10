import React, {Component} from 'react';
import {DraggableSquare} from './square';
import {SnapTarget} from './snapper';
import DragSnapContext from '../../lib/drag-snap-context';
import './styles.css';

class DropTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 0
		};
	}

	targetDropHandler({transform, targetWidth, targetHeight}) {
		const x = (transform.x + targetWidth/2 - transform.width/2);
		const y = (transform.y + targetHeight/2 - transform.height/2);

		this.setState({x, y});
	}

	render() {
		const {x, y} = this.state;

		return (
			<div className="drop-test">
				<div
					id="aim1"
					className="drag-square"
					style={{
						pointerEvents: 'none',
						background: 'none',
						outline: '2px dashed white',
						transform: 'translate(200px, 100px)',
						left: 0,
						top: 0,
						position: 'absolute'
					}}
				/>
				<DragSnapContext>
					<SnapTarget onDropComplete={this.targetDropHandler.bind(this)}/>
					<div
						className="square-wrapper"
						style={{
							left: x + 'px',
							top: y + 'px',
							transform: 'translate(-0%,-0%)'
						}}
					>
						<DraggableSquare/>
					</div>
					<div
						id="aim"
						className="drag-square"
						style={{
							pointerEvents: 'none',
							background: 'none',
							outline: '2px dashed gray',
							transform: 'translate(200px, 100px)',
							left: 0,
							top: 0,
							position: 'absolute'
						}}
					/>
				</DragSnapContext>
			</div>
		);
	}
}

export {DropTest};