import PropTypes from 'prop-types';
import { DRAG_MODES } from '../drag-snap-logic/drag-modes';

const handleMissingProp = (isRequired, propName, componentName) => {
    if (isRequired) {
        return new Error(`Missing required property ${propName} in ${componentName}`);
    }

    return null;
};

const createSpringConfigPropType = (isRequired) => {
    const shape = PropTypes.shape({
        damping: PropTypes.number.isRequired,
        stiffness: PropTypes.number.isRequired,
    });

    return isRequired ? shape.isRequired : shape;
};

const createDragModePropType = isRequired => (props, propName, componentName) => {
    const prop = props[propName];
    const type = typeof prop;

    if (type === 'undefined') {
        return handleMissingProp(isRequired, propName, componentName);
    }

    if (type !== 'string' || DRAG_MODES.indexOf(prop.toLowerCase()) === -1) {
        return new Error(`${propName} in ${componentName} must be one of the strings: ${DRAG_MODES.join(', ')}`);
    }

    return null;
};

const createTransformPropType = (isRequired) => {
    const shape = PropTypes.shape({
        rotate: PropTypes.number,
        skewX: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        scaleX: PropTypes.number,
        scaleY: PropTypes.number,
    });

    return isRequired ? shape.isRequired : shape;
};

const createSizePropType = (isRequired) => {
    const shape = PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequried,
    });

    return isRequired ? shape.isRequired : shape;
};

const createPointPropType = (isRequired) => {
    const shape = PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequried,
    });

    return isRequired ? shape.isRequired : shape;
};

const createChildrenPropType = (isRequired) => {
    const children = PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]);

    return isRequired ? children.isRequired : children;
};

const springConfig = createSpringConfigPropType(false);
springConfig.isRequired = createSpringConfigPropType(true);

const dragMode = createDragModePropType(false);
dragMode.isRequired = createDragModePropType(true);

const transform = createTransformPropType(false);
transform.isRequired = createTransformPropType(true);

const size = createSizePropType(false);
size.isRequired = createSizePropType(true);

const point = createPointPropType(false);
point.isRequired = createPointPropType(true);

const children = createChildrenPropType(false);
children.isRequired = createChildrenPropType(true);

const CustomPropTypes = {
    springConfig, dragMode, transform, size, point, children,
};
export default CustomPropTypes;
