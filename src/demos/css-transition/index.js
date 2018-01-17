import React, {Component} from 'react';
import DragSnapContext from '../../lib/drag-snap-context';
import {DraggableTransitionElement} from './transition-element';
import './styles.css';

class CSSTransitionDemo extends Component {
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