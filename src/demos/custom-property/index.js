import React, {Component} from 'react';
import DragSnapContext from '../../lib/drag-snap-context';
import {DraggableBall} from './ball';
import {SquareTargetDefault, SquareTargetProportional, RoundTargetDefault, RoundTargetProportional} from './targets';

import './styles.css';

class CustomPropertyDemo extends Component {
	render() {
		return (
            <div className="custom-property-demo">
                <DragSnapContext>
                    <div className="target-wrapper">
                        <SquareTargetDefault/>
                    </div>
                    <div className="target-wrapper">
                        <SquareTargetProportional/>
                    </div>
                    <div className="target-wrapper">
                        <RoundTargetDefault/>
                    </div>
                    <div className="target-wrapper">
                        <RoundTargetProportional/>
                    </div>
                    <div className="ball-wrapper">
                        <DraggableBall/>
                    </div>
                </DragSnapContext>
            </div>
		);
	}
}

export {CustomPropertyDemo};