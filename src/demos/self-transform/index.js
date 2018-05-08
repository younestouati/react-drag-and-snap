import React, {Component} from 'react';
import DragSnapContext from '../../lib/drag-snap-context';
import makeDraggable from '../../lib/make-draggable';
import makeSnapTarget from '../../lib/make-snap-target';
import Criteria from '../../lib/defaults/default-snap-criteria';

import './styles.css';

const DraggableBall = makeDraggable()(({className = ''}) => <div className={`self-transform-ball ${className}`}/>); 
const SnapTarget = makeSnapTarget({snapCriteria: Criteria.isCenterWithinRadius('100%'), snapTransform: {scale: 1}})(({className = ''}) => <div className={`self-transform-target ${className}`}/>); 

class SelfTransformDemo extends Component {
	render() {
		return (
            <div className="self-transform-demo">
                <DragSnapContext>
                    <DraggableBall className="content-box"/>
                    <DraggableBall className="border-box"/>
                    <div style={{transform: 'translate(200px, 100px)'}}>
                        <SnapTarget className="content-box"/>
                    </div>
                    <div style={{transform: 'translate(400px, 100px)'}}>
                        <SnapTarget className="border-box"/>
                    </div>
                </DragSnapContext>
            </div>
		);
	}
}

export {SelfTransformDemo};