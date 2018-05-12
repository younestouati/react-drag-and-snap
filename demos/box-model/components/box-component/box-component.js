import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { toArray } from '../../utils/to-array';
import { DOMElementHelper } from '../../../../src/helpers/misc/dom-element-helper';
import {getTransformationMatrix, qrDecompose} from '../../../../src/utils/matrix-utils';
import './box-component.css';

const defaultSize = {width: 130, height: 260};

class BoxComponent extends React.Component {
    componentDidMount() {
        this.DOMElementHelper = new DOMElementHelper(this.el);
        this.transformationMatrix = getTransformationMatrix(this.el);
    }

    getTransformationMatrix() {
        return this.transformationMatrix;
    }

    getDOMElementHelper() {
        return this.DOMElementHelper;
    }

    render() {
        const {
            className = '',
            name = '',
            renderIn,
            boxSizing = 'content-box',
            padding = 20,
            margin = 20,
            transform,
            matrix = null,
            size = defaultSize
        } = this.props;

        const {x, y, scale, scaleX, scaleY, rotate, skewX, skewY = 0} = matrix
            ? qrDecompose(matrix)
            : transform;

        const center = matrix ? this.DOMElementHelper.getCenterInBorderBoxCoordinates() : {x: 0, y: 0};
        const transformStyles = {transform: (matrix ? `translate(${-center.x}px,${-center.y}px) ` : '') +  `translate(${x}px, ${y}px) rotate(${rotate}deg) scaleX(${scaleX || scale}) scaleY(${scaleY || scale}) skewX(${skewX}deg) skewY(${skewY}deg)`};    
       
        const elementStyles = {
            boxSizing,
            width: `${size.width}px`,
            height: `${size.height}px`,
            margin: toArray(margin).map(m => `${m}px`).join(' '),
            padding: toArray(padding).map(p => `${p}px`).join(' ')
        };

        const topPadding = Array.isArray(padding) ? padding[0] : padding;
        const leftPadding = Array.isArray(padding) ? padding[3] : padding;
        const centerStyles = {
            left: `${size.width/2 + leftPadding}px`,
            top: `${size.height/2 + topPadding}px`
        };

        const output = (
            <div className={`transformer ${className}`} style={transformStyles}>
                <div className="margin-wrapper">
                    <div className="element" style={elementStyles} data-name={name} ref={el => this.el = el}>
                        <div className="element-center" style={centerStyles}>
                            ■
                        </div>
                    </div>
                </div>
            </div>
        );

        return renderIn
            ? ReactDOM.createPortal(output, renderIn)
            : output;
    }
};

BoxComponent.propTypes = {
    className: PropTypes.string,
    boxSizing: PropTypes.oneOf(['border-box', 'content-box']),
    padding: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    margin: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
    transform: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        scale: PropTypes.number,
        scaleX: PropTypes.number,
        scaleY: PropTypes.number,
        rotate: PropTypes.number,
        skewX: PropTypes.number,
        skewY: PropTypes.number
    }).isRequired,
    name: PropTypes.string,
    renderIn: PropTypes.object
};

export default BoxComponent;

/*
1. Consider making a border around what constitutes the edge of the element
2. Get the transform for the d and st on mount, and cache it internally
3. Expose the transform from these using a public method
4. Have test component extract the transforms and set them back
5. Have test component create sn-transform and inject it when mode is snap
6. Make control bar sticky
7. Style control bar better

Later:
- Make them animate
- Make it possible to pause the animation!
- Make it possible to globally set the base transform for S and ST (also width/height) and snap-tranform?
*/
