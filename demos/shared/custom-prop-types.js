const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const handleMissingProp = (isRequired, propName, componentName) => {
    if (isRequired) {
        return new Error(`Missing required property ${propName} in ${componentName}`);
    }

    return null;
};

const createPoint2DPropType = isRequired => (props, propName, componentName) => {
    const prop = props[propName];
    const type = typeof prop;

    if (prop === null) {
        return handleMissingProp(isRequired, propName, componentName);
    }

    if (type !== 'object') {
        return new Error(`${propName} in ${componentName} must be an object. Was of type ${type}`);
    }

    if (!isNumber(prop.x) || !isNumber(prop.y)) {
        return new Error(`${propName} in ${componentName} must be an object with a numeric 'x' and 'y' property. Was ${prop}`);
    }

    return null;
};

const createSpringConfigPropType = isRequired => (props, propName, componentName) => {
    const prop = props[propName];
    const type = typeof prop;

    if (type === 'undefined') {
        return handleMissingProp(isRequired, propName, componentName);
    }

    if (type !== 'object') {
        return new Error(`${propName} in ${componentName} must be an object. Was of type ${type}`);
    }

    if (!isNumber(prop.stiffness) || !isNumber(prop.damping)) {
        return new Error(`${propName} in ${componentName} must be an object with positive numeric 'stiffness' and 'damping' properties. Was ${prop}`);
    }

    return null;
};

const point2D = createPoint2DPropType(false);
point2D.isRequired = createPoint2DPropType(true);

const springConfig = createSpringConfigPropType(false);
springConfig.isRequired = createSpringConfigPropType(true);

const CustomPropTypes = { point2D, springConfig };

export { CustomPropTypes };
