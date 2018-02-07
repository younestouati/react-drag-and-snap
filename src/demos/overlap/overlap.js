import React, {Component} from 'react';
import {inverse, applyToPoint, applyToPoints} from 'transformation-matrix';
import {getTransformationMatrix, qrDecompose} from '../../lib/drag-snap-logic/matrix';

class Overlap extends Component {
	constructor(props) {
		super(props);

		this.state = {
            inverseMatrix: null
		}
	}

    componentDidMount() {
        this.setState({
            inverseMatrix: inverse(getTransformationMatrix(this.green))
        })
    }


    renderBoxes(matrix) {
        let transform = '';

        if (matrix) {
            const {x, y, scaleX, scaleY, rotate, skewX, skewY} = qrDecompose(matrix);

            transform = '' +
                'translate3d(calc(' + x + 'px),calc(' + y + 'px), 0) ' +
                'rotate(' + rotate + 'deg) ' +
                'scaleX(' + scaleX + ') ' +
                'scaleY(' + scaleY + ') ' +
                'skewX(' + skewX + 'deg) ' +
                'skewY(' + skewY + 'deg)' +
            '';
        }

        return [
            <div
                style={{
                    position: 'absolute',
                    left: transform ? '200px' : 0,
                    top: transform ? '200px' : 0,
                    transform
                }}
                key="1"
            >
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        transform: 'translate(350px, 100px) rotate(30deg) scaleX(1.1) skewX(15deg)'
                    }}
                >
                    <div
                        style={{
                            width: '200px',
                            height: '100px',
                            background: 'red',
                            display: 'inline-block'
                        }}
                        ref={(el) => this.red = el}
                    />
                </div>
            </div>,
            <div
                style={{
                    position: 'absolute',
                    left: transform ? '200px' : 0,
                    top: transform ? '200px' : 0,
                    transform
                }}
                key="2"
            >
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        transform: 'translate(400px, 100px) rotate(-45deg) scaleX(1.3) skewX(-35deg)'
                    }}
                >
                    <div
                        style={{
                            width: '250px',
                            height: '80px',
                            background: 'green',
                            display: 'inline-block'
                        }}
                        ref={(el) => this.green = el}
                    />
                </div>
            </div>
        ]
	}

	render() {
		return (
			<div className="overlap">
                {this.renderBoxes()}
                {this.state.inverseMatrix ? this.renderBoxes(this.state.inverseMatrix) : null}
			</div>
		);
	}
}

export {Overlap};


/*
Strategy is:
1. Take the targetWidth and targetHeight and transform it by the targets own transformatrix matrix (the four corners)
2. Then transform all four points by the inverse of the other matrix.
3. Then compare the output points with the targetWidth and targetHeight of the other element

4. Do the same the other way around

Consider making a draggableToTarget(point) => point  and targetToDraggable(point) => point

Alternative is to provide the raw matrices...


*/