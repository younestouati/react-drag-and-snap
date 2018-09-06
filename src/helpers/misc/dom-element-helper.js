class DOMElementHelper {
    constructor(el) {
        this.computedStyles = {
            base: new Map(),
            before: new Map(),
            after: new Map(),
        };
        this.el = el;

        if (this.el) {
            this.updateElement(this.el);
        }
    }

    updateComputedStyles() {
        const computedStyles = {
            base: window.getComputedStyle(this.el),
            before: window.getComputedStyle(this.el, ':before'),
            after: window.getComputedStyle(this.el, ':after'),
        };

        ['base', 'before', 'after'].forEach((elementType) => {
            const m = new Map();

            for (let i = 0; i < computedStyles[elementType].length; i += 1) {
                const key = computedStyles[elementType][i];
                const value = computedStyles[elementType][computedStyles[elementType][i]];
                m.set(key, value);
            }

            this.computedStyles[elementType] = m;
        });
    }

    updateElement(el) {
        this.el = el;
        this.boundingClientRect = this.el.getBoundingClientRect();
        this.updateComputedStyles();

        this.borderWidth = {
            top: window.parseFloat(this.computedStyles.base.get('border-top-width')),
            bottom: window.parseFloat(this.computedStyles.base.get('border-bottom-width')),
            left: window.parseFloat(this.computedStyles.base.get('border-left-width')),
            right: window.parseFloat(this.computedStyles.base.get('border-right-width')),
        };

        this.padding = {
            left: window.parseFloat(this.computedStyles.base.get('padding-left')),
            right: window.parseFloat(this.computedStyles.base.get('padding-right')),
            top: window.parseFloat(this.computedStyles.base.get('padding-top')),
            bottom: window.parseFloat(this.computedStyles.base.get('padding-bottom')),
        };

        this.margin = {
            left: window.parseFloat(this.computedStyles.base.get('margin-left')),
            right: window.parseFloat(this.computedStyles.base.get('margin-right')),
            top: window.parseFloat(this.computedStyles.base.get('margin-top')),
            bottom: window.parseFloat(this.computedStyles.base.get('margin-bottom')),
        };

        this.isBorderBox = this.computedStyles.base.get('box-sizing') === 'border-box';

        // TODO: HANDLE THAT COMPUTED STYLE ALREADY RETURNS WIDTH/HEIGHT CORRECTLY ACCORDING TO BOX-SIZING!

        // ADVANTAGE 1: SUB PIXEL (AS OPPOSED TO CLIENTWIDTH). 2: ACCORDING TO BOX SIZING!
        const w = window.parseFloat(this.computedStyles.base.get('width'));
        const h = window.parseFloat(this.computedStyles.base.get('height'));

        this.contentBoxSize = {
            //TODO: USE COMPUTED STYLES HERE (WIDTH AND HEIGHT)
            width: w,/*this.el.clientWidth*/ //- (this.padding.left + this.padding.right),
            height: h/*this.el.clientHeight*/ //- (this.padding.top + this.padding.bottom),
        };

        // Border-box size includes padding and border widths (padding already included
        // in clientWidth)
        this.borderBoxSize = {
            width: w,///*this.el.clientWidth*/ + this.borderWidth.left + this.borderWidth.right,
            height: h///*this.el.clientHeight*/ + this.borderWidth.top + this.borderWidth.bottom,
        };

        console.log('The contextBoxSize is: ', this.contentBoxSize);
        console.log('The borderBoxSize is: ', this.borderBoxSize);
    }

    refresh() {
        this.updateElement(this.el);
    }

    getElement() {
        return this.el;
    }

    getSize() {
        return this.isBorderBox ? this.borderBoxSize : this.contentBoxSize;
    }

    getScaledSize(scaleX, scaleY) {
        const size = this.getSize();

        return {
            width: size.width * scaleX,
            height: size.height * scaleY,
        };
    }

    getBoundingClientRect() {
        return this.boundingClientRect;
    }

    getSizeOrDefault(defaultSize) {
        return this.getSize() || defaultSize;
    }

    getPadding() {
        return this.padding;
    }

    getBorderWidth() {
        return this.borderWidth;
    }

    getIsBorderBox() {
        return this.isBorderBox;
    }

    // Returns the center of the border-box or content-box depending on box-sizing CSS prop.
    // Eitherway it will be returned in border box coordinates.
    getCenterInBorderBoxCoordinates() {
        return this.isBorderBox ? {
            x: this.borderBoxSize.width / 2,
            y: this.borderBoxSize.height / 2,
        } : {
            x: (this.contentBoxSize.width / 2) + this.padding.left + this.borderWidth.left,
            y: (this.contentBoxSize.height / 2) + this.padding.top + this.borderWidth.top,
        };
    }

    getComputedStyles(invalidate = false) {
        if (invalidate) {
            this.updateComputedStyles();
        }

        return this.computedStyles;
    }
}

export default DOMElementHelper;
