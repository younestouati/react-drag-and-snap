import React from 'react';
import DragSnapContext from '../../src/drag-snap-context';
import {SnapTarget} from './target';
import {DraggableBall} from './ball';
import './styles.css';

const DELTA = 3;

class MovingTargetDemoSimple extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            direction: 1
        };

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    } 

    componentWillUnmount() {
        cancelAnimationFrame(this.animationId);
    }

    animate() {
        const {x, direction} = this.state;
        const nextX = x + direction * DELTA;

        if (nextX > 0 && nextX < window.innerWidth) {
            this.setState({x: nextX});
        } else {
            this.setState({direction: direction * (-1)});
        }

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

	render() {
        const {x} = this.state;

		return (
			<DragSnapContext>
                <div className="ball-wrapper">
                    <DraggableBall/>
                </div>
                <div
                    className="target-wrapper"
                    style={{left: `${x}px`}}
                >
                    <SnapTarget continuousUpdate={true}/>
                </div>
			</DragSnapContext>
		);
	}
}

export {MovingTargetDemoSimple};