/**
 * The purpose of this utility is to ensure the correct appearance of the draggable while it is being dragged.
 * While dragging, a clone of the original component will be rendered in a 'drag layer', within the DragSnapContext.
 * Rendering in a separate part of the DOM helps overcome z-index and overflow:hidden issues that could otherwise
 * prevent a proper dragging experience. Due to the nature of CSS, rendering in a different part of the DOM, does
 * however present some challenges regarding ensuring that the visual appearance of the component is correct.
 * Specifically, the following needs to be addressed:
 *
 * Inheritance
 * The fact that some CSS properties are inherited can cause inconsistent styling. The original component, and the
 * dragged clone, do not share the same ancestors, and therefore inherits different CSS values. To address this,
 * react-drag-and-snap will extract the computed styles of the original when a drag starts, and apply these directly
 * to the drag clone. This way, the entire subtree of the drag clone will be subject to the same inherited styles
 * (all of which can be overriden) as the subtree of the original component. Note, that the property
 * -webkit-text-fill-color gets special treatment as explained below.
 *
 * Relative Sizes
 * CSS values such as width, height, padding, min-height, etc. can be specified in terms of percentages
 * in which case the applied pixel values are derived based on the size of the parent element. Since the original
 * element and the drag clone have different parents, this may result in different applied sizes. To handle this,
 * react-drag-and-snap will measure the actual sizes, paddings, etc. of the original when a drag starts, and apply
 * these to the drag clone. These CSS properties will be applied in such a way, that they overrule the drag clone's
 * own styles (even if they are inline styles) (see https://css-tricks.com/override-inline-styles-with-css/ for
 * details).
 *
 * The -webkit-text-fill-color property
 * The -webkit-text-fill-color is a special (non-standard) CSS property that is supported by most modern browsers
 * (including non-webkit browsers such as Firefox). It is largely equivalent to the much more common `color` property,
 * in that it allows for specifying the text color (but it supports more values than `color`). The default value of
 * `-webkit-text-fill-color` is 'currentColor', meaning whatever is specified by `color`. When explicitly set,
 * `-webkit-text-fill-color` will overrule  whatever value `color` has. Furthermore, `-webkit-text-fill-color` is an
 * inherited property. These last two points present a problem, in regards to how inherited values are dealt with as
 * described earlier. If we where to extract the computed value of `-webkit-text-fill-color` from the original component
 * and apply that to the drag clone, this would 'lock' the entire subtree of the drag clone to this text color, in a
 * way that can only be overruled using `-webkit-text-fill-color`, and not the much more common `color` property.
 * Consequently, react-drag-and-snap will not copy the computed value of `-webkit-text-fill-color` to the drag clone,
 * except if it has a different value from the `color` property, which would indicate that the developer has explicitly
 * set `-webkit-text-fill-color`.
 *
 * Limitations
 * The approaches outlined above, will mitigate with the majority of styling inconsistencies between original and
 * drag clone, that would otherwise arise. There are, however, certain scenarios it does not address:
 *
 * 1. The transfering of CSS from original to drag clone happens only when dragging starts. If classes or inline
 * styles applied to the draggable (or its subtree) are changed during the drag, these will generally be applied to
 * the drag clone as well, just by virtue of being render output of the same react component. If, however, an inherited
 * style changes in one of the original element's ancestors during the drag, this will not be reflected in the drag
 * clone. Whether or not this would be desired, will probably vary anyway. And the discrepancy that this might lead
 * to (between original element and drag clone) will only be apparent when dragMode is 'clone' (in which case original
 * and clone are rendered simultanously). In general, the recommended way of dealing with this issue, is to not rely
 * on CSS inheritance for styling (which fits badly with a component based architecture anyway).
 *
 * 2. Compound selectors present a challenge similar to the inheritance problem (see above). Basically, a change in
 * the DOM, outside the draggable component, can impact the appearance of the component. Say - for example - the
 * following selector is used in CSS:
 *
 * .class-applied-to-some-parent-ouside-the-component .class-applied-to-the-component {
 *    /* Some CSS rules * /
 * }
 *
 * Assume the latter class is always applied to - say - the outer most element of the component. These rules will not
 * be applied, unless the former class is set on a ancestor in the DOM tree. If this class is set (or removed) during
 * a drag, it will change the styling of the original, but not the drag clone. Like for the inheritance problem, the
 * suggested solution is to not use these kinds of compound selectors that bind the component to the outside DOM. This
 * is very bad practice anyway.
 *
 * 3. React-drag-and-snap ensures correct sizing of the drag clone by measuring the size of the original at the moment
 * the dragging begins (this measurement will also take css scaling into account). If the size/scale is being animated
 * (imagine for example an element that has an infinite css scaling animation alternating between 0.5 and 2),
 * the applied size of the drag clone will depend on the specific moment the dragging starts. The animation would be
 * applied to the drag clone as well - but scaling would be based on a different base size (whatever the size was the
 * moment we sampled). Given that this is only an issue when the size is animating, it will typically not be
 * something developers run into. It can be addressed by wrapping the component in a fixed size container with
 * overflow:visible (as it is the outer element of the draggable component whose size will be sampled), an apply the
 * scaling animation to a child element instead.
 *
 * 4. As explained above the -webkit-text-fill-property value is not copied to the drag clone if it has the same value
 * as the `color` property, as this suggests that it hasn't been explicitly set by the developer. Technically, this
 * might not be true. The developer could have explicitly given both `color` and `-webkit-text-fill-color` the same
 * value. This is however and extreme edge case, and whathever unexpected styling it might cause, will be easy to fix
 * for the developer by explitictly setting the desired text colors wherever needed.
 */
import React from 'react';
import PropTypes from 'prop-types';
import guidUtils from '../../utils/guid-utils';
import StyleInjector from '../misc/style-injector';

class StyleEnforcer extends React.Component {
    static cleanUpComputedStyles(computedStyles) {
        const cleanUpComputedStyles = {};

        ['base', 'before', 'after'].forEach((elementType) => {
            const m = new Map(computedStyles[elementType]);
            // m.delete('display'); //TODO: EXPLAIN THIS AS WELL. FIGURE OUT WHEN IT IS RELEVANT!!!!!!
            m.delete('visibility'); // PROBABLY BECAUSE CLONE IS VISIBILTY:HIDDEN ON GRABBED (BEFORE DRAGGED)!

            // See documentation at the top of this file for info about the -webkit-text-fill-color property
            if (m.get('color') === m.get('-webkit-text-fill-color')) {
                m.delete('-webkit-text-fill-color');
            }

            cleanUpComputedStyles[elementType] = m;
        });

        return cleanUpComputedStyles;
    }

    constructor(props) {
        super(props);

        this.state = {
            id: `ID_${props.createGuid()}`,
        };

        this.styleInjector = new props.StyleInjector();
    }

    componentWillMount() {
        const size = this.props.DOMElementHelper.getSize();
        const padding = this.props.DOMElementHelper.getPadding();
        const borderWidth = this.props.DOMElementHelper.getBorderWidth();
        const computedStyles = StyleEnforcer.cleanUpComputedStyles(this.props.DOMElementHelper.getComputedStyles());

        this.injectStyles({
            ...size, padding, borderWidth, computedStyles,
        });
    }

    componentWillUnmount() {
        this.removeStyles();
    }

    injectStyles(props) {
        const {
            width, height, padding, borderWidth, computedStyles,
        } = props;

        const baseStyles = [];
        const beforeStyles = [];
        const afterStyles = [];

        computedStyles.base.forEach((value, key) => baseStyles.push(`${key}: ${value};`));
        computedStyles.before.forEach((value, key) => beforeStyles.push(`${key}: ${value};`));
        computedStyles.after.forEach((value, key) => afterStyles.push(`${key}: ${value};`));

        this.lowPriorityStyles = this.styleInjector.inject(`
            .${this.state.id} > * {
                ${baseStyles.join('')}
            }
            .${this.state.id} > *:before {
                ${beforeStyles.join('')}
            }
            .${this.state.id} > *:after {
                ${afterStyles.join('')}
            }
        `, true);

        // [style] is a way of overwriting even inline styles (https://css-tricks.com/override-inline-styles-with-css/)
        // Also setting transform to none. Transform is already account for (for element itself) as well
        // as ancestor in the matrix applied while dragging
        this.highPriorityStyles = this.styleInjector.inject(`
            #${this.state.id} > *,
            #${this.state.id} > *[style] {
                display: inline-block !important;
                float: none !important;
                position: static !important;
                min-width: none !important;
                max-width: none !important;
                min-height: none !important;
                max-height: none !important;
                width: ${width}px !important;
                height: ${height}px !important;
                padding-left: ${padding.left}px !important;
                padding-right: ${padding.right}px !important;
                padding-top: ${padding.top}px !important;
                padding-bottom: ${padding.bottom}px !important;
                border-left-width: ${borderWidth.left}px !important;
                border-right-width: ${borderWidth.right}px !important;
                border-top-width: ${borderWidth.top}px !important;
                border-bottom-width: ${borderWidth.bottom}px !important;
                pointer-events: none !important;
                transform: none !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
            }
            `);
    }

    removeStyles() {
        StyleInjector.remove(this.lowPriorityStyles);
        StyleInjector.remove(this.highPriorityStyles);
    }

    render() {
        const { children } = this.props;
        const { id } = this.state;

        return (
            <div id={id} className={id}>
                {children}
            </div>
        );
    }
}

StyleEnforcer.propTypes = {
    /* eslint-disable-next-line react/forbid-prop-types */
    DOMElementHelper: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    StyleInjector: PropTypes.func.isRequired,
    createGuid: PropTypes.func.isRequired,
};

StyleEnforcer.defaultProps = {
    /* eslint-disable react/default-props-match-prop-types */
    createGuid: guidUtils.createGuid,
    StyleInjector,
    /* eslint-enable react/default-props-match-prop-types */
};

export default StyleEnforcer;
