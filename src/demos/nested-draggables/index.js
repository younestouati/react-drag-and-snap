import React, {Component} from 'react';
import DragSnapContext from '../../lib/drag-snap-context';
import {DraggableBall} from './ball';

import './styles.css';

class NestedDraggablesDemo extends Component {
	render() {
		return (
            <div className="nested-draggables-demo">
                <DragSnapContext>
                    <DraggableBall radius={200} onClick={() => alert('outer clicked')}>
                        <DraggableBall radius={100} onClick={() => alert('inner clicked')}/>
                    </DraggableBall>
                </DragSnapContext>
            </div>
		);
	}
}

export {NestedDraggablesDemo};