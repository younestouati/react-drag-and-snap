import React from 'react';
import { Square } from './square';
import { Target } from './target';
import { DragSnapContext, makeDraggable, makeSnapTarget, SnapCriteria, SnapTargetCollectors, SnapTransforms } from '../lib-proxy';

const DraggableSquare = makeDraggable()(Square);

const config1 = {
    dragSnapCriteria: SnapCriteria.isCenterWithinRadius(200),
    dragSnapTransform: SnapTransforms.withCustomSnapProps(SnapTransforms.snapAll, { borderRadius: 100 }),
    releaseSnapCriteria: SnapCriteria.never,
};

const config2 = {
    releaseSnapCriteria: SnapCriteria.never,
};

const config3 = {
    dragSnapCriteria: SnapCriteria.isCenterWithinRadius(200),
    dragSnapTransform: SnapTransforms.snapAll,
    releaseSnapCriteria: SnapCriteria.never,
};

// const additions = {rotate: 25, skewX: 65, skewY: 0, x: 10, y: 10, width: 100, height: 160, scaleX: .4, scaleY: 1.6};
const additions = {
    rotate: 0, skewX: 0, skewY: 20, x: 10, y: 10, scaleX: 1, scaleY: 1,
};
const config4 = {
    dragSnapCriteria: SnapCriteria.isCenterWithinRadius(200),
    dragSnapTransform: additions,
    releaseSnapCriteria: SnapCriteria.never,
};

const SnapTargetType1 = makeSnapTarget(config1, SnapTargetCollectors.allProps)(Target);
const SnapTargetType2 = makeSnapTarget(config2, SnapTargetCollectors.allProps)(Target);
const SnapTargetType3 = makeSnapTarget(config3, SnapTargetCollectors.allProps)(Target);
const SnapTargetType4 = makeSnapTarget(config4, SnapTargetCollectors.allProps)(Target);

class Container extends React.Component {
    render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        margin: '20px',
                        transform: 'rotate(0deg) scale(1)',
                    }}
                >
                    <DragSnapContext>
                        <DraggableSquare />
                        <div
                            style={{
                                position: 'absolute',
                                transform: 'translate(300px, 100px) skewX(-65deg) rotate(40deg)',
                            }}
                        >
                            <SnapTargetType1 ref={el => this.target1 = el} />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                transform: 'translate(650px, 350px) rotate(35deg) scale(1.5) skewY(30deg)',
                            }}
                        >
                            <SnapTargetType2 ref={el => this.target2 = el} />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                transform: 'translate(900px, 100px) skew(50deg)',
                            }}
                        >
                            <SnapTargetType3 ref={el => this.target3 = el} />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                transform: 'translate(50px, 300px)',
                            }}
                        >
                            <SnapTargetType4 ref={el => this.target4 = el}>
                                <div
                                    style={{
                                        transform: `translate(calc(${additions.x}px - 50%), calc(${additions.y}px - 50%)) rotate(${additions.rotate}deg) skewX(${additions.skewX}deg) skewY(${additions.skewY}deg) scaleX(${additions.scaleX}) scaleY(${additions.scaleY})`,
                                        display: 'inline-block',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '250px',
                                        height: '100px',
                                        outline: '2px dotted gray',
                                    }}
                                    ref={el => this.inner = el}
                                />
                            </SnapTargetType4>
                        </div>
                    </DragSnapContext>
                </div>
            </div>
        );
    }
}

export { Container };
/*
import React, { Component } from 'react';
import Square from './square';
import Target from './target';
import makeDraggable from './lib/make-draggable';
import makeSnapTarget from './lib/make-snap-target';
import DragSnapContext from './lib/drag-snap-context';
import Criteria from './lib/defaults/default-snap-criteria';
import {snapProportionally} from './lib/defaults/default-snap-transfomers';

const DraggableSquare = makeDraggable()(Square);

const config = {
	snapCriteria: [
		Criteria.isCenterWithinRadius(200),
		Criteria.isDragDataProp('type', 'square')
	],
	snapTransform: snapProportionally(200, 10)
};

const SnapTarget = makeSnapTarget(config)(Target);

class Container extends Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: 0
		};

		setInterval(() => {
			this.setState({counter: this.state.counter + 1})
		}, 1000);
	}

	render() {
		return (
			<DragSnapContext>
				<div style={{left: '200px', top: '100px', position: 'absolute', transform: 'scaleY(1.8) scaleX(0.6) rotate(15deg) ', transformOrigin: '50% 50%'}}>
					<div style={{position: 'absolute', transform: 'scaleY(1.3) translateX(50px) rotate(2deg)', width: '400px', height: '350px', transformOrigin: '0% 50%'}}>
						<div style={{display: 'inline-block', left: '110px', top: '50px', position: 'absolute', transform: 'skewX(0deg)  scaleX(0.8) translateX(-50px) rotate(0deg)', width: '400px', height: '300px'}}>
							<DraggableSquare
								counter={this.state.counter}
								dragData={{type: 'square'}}
								snapBack={true}
							/>
						</div>
					</div>
				</div>
				<div
					style={{
						position: 'absolute',
						left: '600px',
						top: '200px',
						transform: 'translate(50px, 150px) rotate(35deg) scale(1.5) skewY(30deg)'
					}}
				>
					<SnapTarget
						onDrop={(dragData) => console.log('This was dropped on me: ', dragData)}
					/>
				</div>
			</DragSnapContext>
		);
	}
}

export default Container;
*/
