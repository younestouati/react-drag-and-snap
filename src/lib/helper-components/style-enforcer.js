import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createGuid} from '../utils/guid-utils';
import {StyleInjector} from '../helpers/style-injector';
import {extend} from '../utils/object-utils';

/**
 * TODO: UPDATE THIS DOCUMENTATION!
 * React component that fixes the width, height and paddings its child component without directly manipulating the
 * child component. Instead it applies css rules that can override even inline styles.
 *
 * Fixing the paddings and dimensions of a dragged element is needed because these values may be context dependent. If,
 * for example, the draggable has it's width set as a percentage CSS value, the actual width will depend on the width
 * of its parent. When dragging, a clone of the draggable will be rendered, but in a different part of the DOM tree, which
 * means that it will likely  get a different width. To handle this, the element's width etc. is queried when dragging is
 * initiated, and these are applied (using this component) to the dragged clone.
 */
class StyleEnforcer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: 'ID_' + props.createGuid()
		};

		this.styleInjector = new props.StyleInjector();
	}

	injectStyles(props) {
		const {width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, computedStyles} = props;
		
		this.lowPriorityStyles = this.styleInjector.inject(`
			.${this.state.id} > * {
				${computedStyles.base.map((rule => `${rule.key}: ${rule.value};`)).join('')}
			}
			.${this.state.id} > *:before {
				${computedStyles.before.map((rule => `${rule.key}: ${rule.value};`)).join('')}
			}
			.${this.state.id} > *:after {
				${computedStyles.after.map((rule => `${rule.key}: ${rule.value};`)).join('')}
			}
		`, true);

		//TODO: CONSIDER TRANSFORMS APPLIED DIRECTLY TO THE ELEMENT!

		//[style] is a way of overwriting even inline styles (https://css-tricks.com/override-inline-styles-with-css/)
		this.highPriorityStyles = this.styleInjector.inject(`
			#${this.state.id} > *,
			#${this.state.id} > * {
				display: inline-block !important;
				box-sizing: content-box !important;
				float: none !important;
				position: static !important;
				min-width: none !important;
				max-width: none !important;
				min-height: none !important;
				max-height: none !important;
				width: ${width}px !important;
				height: ${height}px !important;
				padding-left: ${paddingLeft}px !important;
				padding-right: ${paddingRight}px !important;
				padding-top: ${paddingTop}px !important;
				padding-bottom: ${paddingBottom}px !important;
				pointer-events: none;
			}`
		);
	}

	removeStyles() {
		this.styleInjector.remove(this.lowPriorityStyles);
		this.styleInjector.remove(this.highPriorityStyles);
	}

	componentWillMount() {
		const dimensions = this.props.DOMElementHelper.getDimensions();
		const padding = this.props.DOMElementHelper.getPadding();
		const computedStyles = this.props.DOMElementHelper.getComputedStyles();

		this.injectStyles(extend(dimensions, padding, {computedStyles}));

		this.props.DOMElementHelper.startMonitoring(() => {
			this.removeStyles(); //Remove old styles
			this.injectStyles(extend(
				dimensions,
				padding,
				{computedStyles: this.props.DOMElementHelper.getComputedStyles(true)}
			)); 
		});
	}

	componentWillUnmount() {
		this.props.DOMElementHelper.stopMonitoring();
		this.removeStyles();
	}

	render() {
		const {children} = this.props;
		const {id} = this.state;

		return (
			<div id={id} className={id}>
				{children}
			</div>
		);
	};
}

StyleEnforcer.propTypes = {
	DOMElementHelper: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	StyleInjector: PropTypes.func.isRequired,
	createGuid: PropTypes.func.isRequired
};

StyleEnforcer.defaultProps = {
	createGuid,
	StyleInjector
};

export {StyleEnforcer};