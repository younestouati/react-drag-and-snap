class DOMElementHelper {
	constructor(el) {
		this.basePosition = null;
		this.size = null;
		this.computedStyles = {
			base: new Map(),
			before: new Map(),
			after: new Map()
		};
		this.padding = null;
		this.el = el;

		if (this.el) {
			this.updateElement(this.el);
		}
	}

	updateComputedStyles() {
		const computedStyles = {
			base: window.getComputedStyle(this.el),
			before: window.getComputedStyle(this.el, ':before'),
			after: window.getComputedStyle(this.el, ':after')
		};

		['base', 'before', 'after'].forEach((elementType) => {
			const m = new Map();

			for (let i=0;i<computedStyles[elementType].length;i++) {
				const key = computedStyles[elementType][i];
				const value = computedStyles[elementType][computedStyles[elementType][i]];
				m.set(key, value);
			}

			this.computedStyles[elementType] = m;
		}); 	
	}

	updateElement(el) {
		this.el = el;
		const bcr = this.el.getBoundingClientRect();
		this.basePosition = {
			x: bcr.left + window.scrollX + bcr.width/2,
			y: bcr.top + window.scrollY + bcr.height/2
		};

		this.updateComputedStyles();

		const paddingLeft = window.parseFloat(this.computedStyles.base.get('padding-left'));
		const paddingRight = window.parseFloat(this.computedStyles.base.get('padding-right'));
		const paddingTop = window.parseFloat(this.computedStyles.base.get('padding-top'));
		const paddingBottom = window.parseFloat(this.computedStyles.base.get('padding-bottom'));

		this.padding = {
			paddingLeft,
			paddingRight,
			paddingTop,
			paddingBottom
		};

		this.size = {
			width: this.el.clientWidth - (paddingLeft + paddingRight),
			height: this.el.clientHeight - (paddingTop + paddingBottom)
		};
	};

	getSize() {
		return this.size;
	}

	getPadding() {
		return this.padding;
	}

	getComputedStyles(invalidate = false) {
		if (invalidate) {
			this.updateComputedStyles();
		}

		return this.computedStyles;
	}
}

export {DOMElementHelper};