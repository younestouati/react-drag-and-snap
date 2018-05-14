import React from 'react';
import {Square} from './square';
import {Target} from './target';
import {DragSnapContext, makeDraggable, makeSnapTarget, SnapTargetCollectors, SnapCriteria} from '../lib-proxy';

const DraggableSquare = makeDraggable()(Square);

const config = {
	snapTransform: () => ({scale: .30, x: "-35%", y: "-35%"}),
	releaseSnapCriteria: SnapCriteria.never,
};

const SnapTarget = makeSnapTarget(config, SnapTargetCollectors.allProps)(Target);

class SimpleDemo extends React.Component {
    render() {
        return (
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%'
				}}
			>
				<DragSnapContext>
					<div style={{transform: "scale(1.5)", display: 'inline-block'}}>
						<DraggableSquare className="d1"/>
					</div>
					<div style={{transform: "scale(1.5)", display: 'inline-block'}}>
						<DraggableSquare className="d2" borderWidth={5} padding={5}/>
					</div>
					<div style={{transform: "scale(1.5)", display: 'inline-block'}}>
						<DraggableSquare className="d3" isBorderBox={true}/>
					</div>
					<div style={{transform: "scale(1.5)", display: 'inline-block'}}>
						<DraggableSquare className="d4" isBorderBox={true} borderWidth={5} padding={5}/>
					</div>
					<div style={{transform: "scale(1.5)", display: 'inline-block'}}>
						<DraggableSquare className="d5" isBorderBox={false} borderWidth={5} borderWidth2={40} padding={15}/>
					</div>
					<DraggableSquare className="d6" isBorderBox={true} borderWidth={5} borderWidth2={40} padding={5}/>
					<div
						style={{
							position: 'absolute',
							transform: 'translate(100px, 100px) scale(1) rotate(90deg)'
						}}
					>
						<SnapTarget/>
					</div>
					<div
						style={{
							position: 'absolute',
							transform: 'translate(400px, 100px)'
						}}
					>
						<SnapTarget isBorderBox={true} padding={10} borderWidth={10}/>
					</div>
					<div
						style={{
							position: 'absolute',
							transform: 'translate(800px, 100px) scale(1.2) skewX(20deg)'
						}}
					>
						<SnapTarget padding={10} borderWidth={10} borderWidth2={30}/>
					</div>
				</DragSnapContext>
			</div>
        );
    }
}

export {SimpleDemo};