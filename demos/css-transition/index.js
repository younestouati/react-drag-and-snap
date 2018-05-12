import React from 'react';
import DragSnapContext from '../../src/drag-snap-context';
import {DraggableTransitionElement} from './transition-element';
import './styles.css';

class CSSTransitionDemo extends React.Component {
	render() {
		return (
			<DragSnapContext>
                <div className="transition-element-wrapper">
                    <DraggableTransitionElement/>
                </div>
			</DragSnapContext>
		);
	}
}
export {CSSTransitionDemo};