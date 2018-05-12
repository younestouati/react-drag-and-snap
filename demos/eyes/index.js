import React from 'react';
import DragSnapContext from '../../src/drag-snap-context';
import {EyeTarget} from './eye';
import {DraggableBall} from './ball';
import './styles.css';

const eyePositions = [
    {x: 10, y: 14},
    {x: 19, y: 44},
    {x: 78, y: 65}, 
    {x: 10, y: 80},
    {x: 33, y: 54},
    {x: 84, y: 61},
    {x: 50, y: 12},
    {x: 70, y: 22},
    {x: 41, y: 63}
];

class EyeDemo extends React.Component {
	render() {
		return (
            <div className="eye-demo">
                <DragSnapContext>
                    <DraggableBall/>
                    {
                        eyePositions.map(({x, y}, i) => (
                            <div
                                key={i}
                                className="eye-wrapper"
                                style={{left: `${x}%`, top: `${y}%`}}
                            >
                                <EyeTarget/>
                            </div>
                        ))
                    }
                </DragSnapContext>
            </div>
		);
	}
}

export {EyeDemo};