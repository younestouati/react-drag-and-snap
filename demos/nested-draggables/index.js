import React from 'react';
import {DragSnapContext} from '../lib-proxy';
import {DraggableBall} from './ball';

import './styles.css';

class NestedDraggablesDemo extends React.Component {
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