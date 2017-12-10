class DOMElementHelper {
	constructor(el) {
		this.basePosition = null;
		this.dimensions = null;
		this.computedStyles = this.getEmptyComputedStyles();
		this.padding = null;
		this.el = el;

		if (this.el) {
			this.updateElement(this.el);
		}
	}

	getEmptyComputedStyles() {
		return {
			base: [],
			before: [],
			after: []
		};
	}

	updateComputedStyles() {
		this.computedStyles = this.getEmptyComputedStyles();
		const computedStyles = {
			base: window.getComputedStyle(this.el),
			before: window.getComputedStyle(this.el, ':before'),
			after: window.getComputedStyle(this.el, ':after')
		};

		['base', 'before', 'after'].forEach((elementType) => {
			for (let i=0;i<computedStyles[elementType].length;i++) {
				const key = computedStyles[elementType][i];
				const value = computedStyles[elementType][computedStyles[elementType][i]];

				if (key !== 'display' && key !== 'visibility') {
					this.computedStyles[elementType].push({key,value});
				}
			}
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

		const paddingLeft = window.parseFloat(this.computedStyles.base.find(({key}) => key === 'padding-left').value);
		const paddingRight = window.parseFloat(this.computedStyles.base.find(({key}) => key === 'padding-right').value);
		const paddingTop = window.parseFloat(this.computedStyles.base.find(({key}) => key === 'padding-top').value);
		const paddingBottom = window.parseFloat(this.computedStyles.base.find(({key}) => key === 'padding-bottom').value);

		this.padding = {
			paddingLeft,
			paddingRight,
			paddingTop,
			paddingBottom
		};

		this.dimensions = {
			width: this.el.clientWidth - (paddingLeft + paddingRight),
			height: this.el.clientHeight - (paddingTop + paddingBottom)
		};
	};

	startMonitoring(callback) {
        const config = {
            attributes: true,
            attributeFilter: ['style', 'class'],
            childList: false,
            characterData: false
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe(this.el, config);
    }

    stopMonitoring() {
        this.observer.disconnect();
    }

	getDimensions() {
		return this.dimensions;
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