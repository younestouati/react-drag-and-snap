import React from 'react';
import {DragSnapContext, makeDraggable, makeSnapTarget} from 'react-drag-and-snap';
import './styles.css';

const DraggableItem = makeDraggable()(() => <div className="item"/>);
const SnapTarget = makeSnapTarget()(() => <div className="target"/>);

export default BasicDemo = () => (
	<DragSnapContext>
		<DraggableItem/>
		<SnapTarget onDrop={() => alert('Item dropped on target')}/>
	</DragSnapContext>
);