import React from 'react';
import PropTypes from 'prop-types';
import { shallowClone } from './utils/object-utils';
import { SnapTargetContext } from './make-snap-target';

const transformProps = ['x', 'y', 'scaleX', 'scaleY', 'scale', 'skewX', 'skewY', 'rotate'];
const defaultTransform = {
    x: 0,
    y: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    rotate: 0,
};

class InternalSnapTargetTransform extends React.Component {
    constructor(props) {
        super(props);
        this.transform = defaultTransform;
    }

    /* eslint-disable camelcase */
    UNSAFE_componentWillReceiveProps(newProps) {
    /* eslint-enable camelcase */
        if (transformProps.some(prop => this.transform[prop] !== newProps[prop])) {
            this.props.context.setInternalTransformation(shallowClone(newProps));
            this.transform = shallowClone(newProps);
        }
    }

    render() {
        const {
            children, x, y, scale, scaleX, scaleY, rotate, skewX, skewY,
        } = this.props;

        const scaleXToApply = typeof scaleX !== 'undefined' ? `scaleX(${scaleX})` : '';
        const scaleYToApply = typeof scaleY !== 'undefined' ? `scaleY(${scaleY})` : '';

        // Wrapped in extra (non moving) div to ensure that getBoundingClientRect isn't
        // impacted by the transform
        return (
            <div>
                <div
                    style={{
                        transformOrigin: '50% 50%',
                        transform: `
                            translate3d(${x}px, ${y}px, 0)
                            scale(${scale})
                            ${scaleXToApply}
                            ${scaleYToApply}
                            rotate(${rotate}deg)
                            skewX(${skewX}deg)
                            skewY(${skewY}deg)
                        `,
                    }}
                >
                    {children}
                </div>
            </div>
        );
    }
}

InternalSnapTargetTransform.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    scale: PropTypes.number,
    /* eslint-disable react/require-default-props */
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    /* eslint-enable react/require-default-props */
    rotate: PropTypes.number,
    skewX: PropTypes.number,
    skewY: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    context: PropTypes.object.isRequired,
};

InternalSnapTargetTransform.defaultProps = defaultTransform;

const InternalSnapTargetTransformWithContext = props => (
    <SnapTargetContext.Consumer>
        {
            context => <InternalSnapTargetTransform context={context} {...props} />
        }
    </SnapTargetContext.Consumer>
);

export default InternalSnapTargetTransformWithContext;
