import React, {Component} from 'react';
import {DraggableSquareWithTopLevelState} from './draggable-square-top-level-state';
import {DraggableSquareWithDeepState} from './draggable-square-deep-state';
import DragSnapContext from '../../lib/drag-snap-context';
import './styles.css';

class StateDemo extends Component {
	render() {
		return (
			<div className="state-demo">
				<DragSnapContext>
					<h1>State demo</h1>
					Explanation of the demo
					<div className="row">
						<div>
							<h2>Will work</h2>
							<DraggableSquareWithTopLevelState/>
						</div>
						<div>
							<h2>Will not work</h2>
							<DraggableSquareWithDeepState/>
						</div>
					</div>
				</DragSnapContext>
			</div>
		);
	}
}

export {StateDemo};
