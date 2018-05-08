import React from 'react';
import PropTypes from 'prop-types';
import BoxComponent from '../box-component/box-component';
import { toArray } from '../../utils/to-array';
import { qrDecompose} from '../../../../lib/utils/matrix-utils';
import { normalizeTransform } from '../../../../lib/drag-snap-logic/normalize-transform';
import { createSnapMatrix } from '../../../../lib/drag-snap-logic/create-snapping-matrix';
import './test-component.css';

const snapTargetTransform = {x: 20, y: 100, scaleX: 1.2, scaleY: 0.9, rotate: 15, skewX: 5, skewY: 10};
const draggableTransform = {x: 170, y: 150, scale: .8, rotate: -5, skewX: 15, skewY: 20};
//const snapTargetTransform = {x: 20, y: 100, scaleX: 1, scaleY: 1, rotate: 10, skewX: 10, skewY: 0};
//const draggableTransform = {x: 170, y: 150, scale: 1, rotate: 0, skewX: 14, skewY: 0};

//const snapTargetTransform = {x: 20, y: 100, scaleX: 1, scaleY: 1, rotate: 0, skewX: 10, skewY: 0};
//const draggableTransform = {x: 170, y: 150, scale: 1, rotate: 0, skewX: 0, skewY: 0};


//Upper left corner snap Transform:
const snapTransform = {scale: .50, x: "-25%", y: "-25%", rotate: 0, skewY: 0};
//const snapTransform = {scale: 1};

class TestComponent extends React.Component {
    getMatrix() {
        const {mode} = this.props;

        if (mode === 'snap') {
            const {scaleX: draggableScaleX, scaleY: draggableScaleY} = qrDecompose(this.draggable.getTransformationMatrix());
            const draggableScaledSize = this.draggable.getDOMElementHelper().getScaledSize(draggableScaleX, draggableScaleY);
            const {scaleX: snapTargetScaleX, scaleY: snapTargetScaleY} = qrDecompose(this.snapTarget.getTransformationMatrix());
            const snapTargetScaledSize = this.snapTarget.getDOMElementHelper().getScaledSize(snapTargetScaleX, snapTargetScaleY);

            const normalizedSnapTransform = normalizeTransform(snapTransform, draggableScaledSize, snapTargetScaledSize); 
            
            const s = createSnapMatrix(
                this.snapTarget.getTransformationMatrix(),
                normalizedSnapTransform,
                this.snapTarget.getDOMElementHelper(),
                this.draggable.getDOMElementHelper()
            );

            return s;
        }

        if (mode === 'global') {
            return this.draggable.getTransformationMatrix()
        }

        return null;
    }

    render () {
        const {
            draggableBoxSizing = 'content-box',
            draggablePadding = 0,
            draggableMargin = 0,
            snapTargetBoxSizing = 'content-box',
            snapTargetPadding = 0,
            snapTargetMargin = 0,
            renderIn
        } = this.props;

        return (
            <div className="test-component">
                <table className="prop-table">
                    <tbody>
                        <tr>
                            <th/>
                            <th>Box Sizing</th>
                            <th>Padding</th>
                            <th>Margin</th>
                        </tr>
                        <tr>
                            <th>Draggable</th>
                            <td>{draggableBoxSizing}</td>
                            <td>{toArray(draggablePadding).join('/')}</td>
                            <td>{toArray(draggableMargin).join('/')}</td>
                        </tr>
                        <tr>
                            <th>Snap Target</th>
                            <td>{snapTargetBoxSizing}</td>
                            <td>{toArray(snapTargetPadding).join('/')}</td>
                            <td>{toArray(snapTargetMargin).join('/')}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <BoxComponent
                        className="draggable"
                        ref={el => this.draggable = el}
                        name="Draggable"
                        boxSizing={draggableBoxSizing}
                        padding={draggablePadding}
                        margin={draggableMargin}
                        renderIn={renderIn}
                        transform={draggableTransform}
                        matrix={this.getMatrix()}
                    />
                    <BoxComponent
                        className="snapTarget"
                        ref={el => this.snapTarget = el}
                        name="Snap Target"
                        boxSizing={snapTargetBoxSizing}
                        padding={snapTargetPadding}
                        margin={snapTargetMargin}
                        transform={snapTargetTransform}
                    />
                </div>
            </div>
        );
    }
};

TestComponent.propTypes = {
    draggableBoxSizing: PropTypes.oneOf(['content-box', 'border-box']),
    draggablePadding: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    draggableMargin: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    snapTargetBoxSizing: PropTypes.oneOf(['content-box', 'border-box']),
    snapTargetPadding: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    snapTargetMargin: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    renderIn: PropTypes.object,
    mode: PropTypes.oneOf(['normal', 'global', 'snap']).isRequired
};

export default TestComponent;