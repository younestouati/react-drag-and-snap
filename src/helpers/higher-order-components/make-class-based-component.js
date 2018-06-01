import React from 'react';

function isFunctionalComponent(Component) {
    return !Component.prototype.render;
}

/**
 * Higher order component that returns a class based equivalent to any given functional \
 * component, or the the given component in case it is already class based. Functional
 * components need to be converted because they can't have refs, which this library depends on.
 */
function makeClassBasedComponent(WrappedComponent) {
    if (isFunctionalComponent(WrappedComponent)) {
        /* eslint-disable react/prefer-stateless-function */
        class ClassBasedComponent extends React.Component {
            render() {
                return <WrappedComponent {...this.props} />;
            }
        }
        /* eslint-enable react/prefer-stateless-function */

        return ClassBasedComponent;
    }
    return WrappedComponent;
}

export default makeClassBasedComponent;
