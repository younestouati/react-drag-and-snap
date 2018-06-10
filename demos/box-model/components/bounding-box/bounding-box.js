import React from 'react';
import PropTypes from 'prop-types';
import './bounding-box.css';
import { getCenterOfContentBox, getTransformationMatrix } from '../../../../src/utils/matrix-utils';
import DOMElementHelper from '../../../../src/helpers/misc/dom-element-helper';

class BoundingBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boundingClientRect: props.element.getBoundingClientRect(),
        };
    }

    render() {
        const {
            width, height, left, top,
        } = this.state.boundingClientRect;

        const elementStyles = {
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
        };

        const { x, y } = getCenterOfContentBox(
            new DOMElementHelper(this.props.element),
            getTransformationMatrix(this.props.element)
        );

        return (
            <div style={elementStyles} className="bounding-box">
                <div
                    className="estimated-content-center"
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                    }}
                />
            </div>
        );
    }
}

BoundingBox.propTypes = {
    /* eslint-disable */
    element: PropTypes.object.isRequired,
};

export default BoundingBox;
