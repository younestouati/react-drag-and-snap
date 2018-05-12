import React from 'react';
import DragSnapContext from '../../src/drag-snap-context';
import makeDraggable from '../../src/make-draggable';
import makeSnapTarget from '../../src/make-snap-target';
import './styles.css';

const Item = () => <div className="item">Drag me</div>;
const Target = () => <div className="target">I am a snap target!</div>;

const DraggableItem = makeDraggable()(Item);
const SnapTarget = makeSnapTarget()(Target);

const BasicDemo = () => (
	<div className="basic-demo">
		<DragSnapContext>
			<DraggableItem/>
			<SnapTarget onDropComplete={() => alert('Item was dropped on target')}/>
		</DragSnapContext>
	</div>
);

export {BasicDemo};