import React from 'react';
import {DraggableSquareWithTopLevelState} from './draggable-square-top-level-state';
import {DraggableSquareWithDeepState} from './draggable-square-deep-state';
import {DragSnapContext} from '../lib-proxy';
import './styles.css';

class StateDemo extends React.Component {
	render() {
		return (
			<div className="state-demo">
				<DragSnapContext>
					<h1>State demo</h1>
					<p>Explanation of the demo</p>
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
