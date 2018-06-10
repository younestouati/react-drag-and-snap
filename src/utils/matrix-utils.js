import {
    transform,
    translate,
    identity,
    fromObject,
    rotateDEG,
    scale,
    applyToPoint,
    inverse,
    rotate,
} from 'transformation-matrix';
import DOMElementHelper from '../helpers/misc/dom-element-helper';
import { isNullOrUndefined } from './type-utils';

function matrixFromString(string) {
    const entries = string.replace(/^.*\((.*)\)$/g, '$1').split(/, +/);

    const parsedEntries = (entries.length === 6)
        ? entries.map(parseFloat)
        : [1, 0, 0, 1, 0, 0];

    return {
        a: parsedEntries[0],
        b: parsedEntries[1],
        c: parsedEntries[2],
        d: parsedEntries[3],
        e: parsedEntries[4],
        f: parsedEntries[5],
    };
}

function extractRotation(matrix) {
    return Math.atan2(matrix.b, matrix.a) / (Math.PI / 180);
}

function extractScale(matrix) {
    const denom = (matrix.a ** 2) + (matrix.b ** 2);
    const x = Math.sqrt(denom);
    const y = ((matrix.a * matrix.d) - (matrix.c * matrix.b)) / x;
    return { x, y };
}

function extractSkew(matrix) {
    const denom = (matrix.a ** 2) + (matrix.b ** 2);
    const skewX = Math.atan2((matrix.a * matrix.c) + (matrix.b * matrix.d), denom) / (Math.PI / 180);

    return {
        x: skewX,
        y: 0,
    };
}

function extractTranslation(matrix) {
    return {
        x: matrix.e,
        y: matrix.f,
    };
}

function skewXMatrix(x) {
    return fromObject({
        a: 1,
        b: 0,
        c: Math.tan((x / 180) * Math.PI),
        d: 1,
        e: 0,
        f: 0,
    });
}

function skew(x, y) {
    return fromObject({
        a: 1,
        b: Math.tan((y / 180) * Math.PI),
        c: Math.tan((x / 180) * Math.PI),
        d: 1,
        e: 0,
        f: 0,
    });
}

function translationOnly(matrix) {
    return {
        ...matrix, a: 1, b: 0, c: 0, d: 1,
    };
}

function overrideTranslation(matrix, { x, y }) {
    return { ...matrix, e: x, f: y };
}

// Based on this: https://github.com/kangax/fabric.js/blob/master/src/util/misc.js
function qrDecompose(matrix) {
    const sc = extractScale(matrix);
    const sk = extractSkew(matrix);

    return {
        rotate: extractRotation(matrix), // rotation in degrees
        scaleX: sc.x,
        scaleY: sc.y,
        skewX: sk.x, // skewX in degrees
        skewY: 0, // skewY in degrees
        x: matrix.e,
        y: matrix.f,
    };
}

function getCenterOfBorderBox(domElementHelper) {
    const {
        left, top, width, height,
    } = domElementHelper.getBoundingClientRect();

    return {
        x: left + (width / 2),
        y: top + (height / 2),
    };
}

function transformMultiple(...matrices) {
    return matrices.reduce((acc, cur) => transform(acc, cur), identity());
}

/*
 * The snapping functionality is based on the outermost HTML elements of the draggable and the
 * snapTarget. That is, if the snapTransform dictates that the draggable should snap to the
 * snapTarget by - say - exactly covering it, it will make the outermost element of the draggable
 * adapt in position, size, rotation, and skew, to exactly match that of the outer most element of
 * the snapTarget when snapping.
 *
 * React-drag-and-snap will use the element’s content-boxes or border-boxes in these snapping calculations
 * depending on the values of the box-sizing CSS properties of the given elements.
 *
 * To do the snapping react-drag-and-snap needs to determine the transformation matrices of the draggable
 * and snap target. That is the matrices that describe the element’s poses in the global window coordinate system.
 * The scaling, rotation and skew parts are determined by reading and accumulating the CSS transforms for the
 * element and its entire ancestor tree. However, the position - defined as the position of the center of the
 * element - is hard to determine analytically, as it is the result of CSS transformations, left/top/bottom/right
 * props if position is relative/absolute/fixed, and the element's natural position in the document flow given
 * the current viewport size. Consequently, the position is determined by ‘measuring’, i.e. using
 * getBoundingClientRect().
 *
 * GetBoundingClientRect returns the position and size of the boundingBox, which is the smallest axis-aligned
 * rectangle that fully contains the entire element, including padding and border (that is the border box - not
 * the content box)! The center of this rectangle will always coincide with the center of the content box
 * (regardless of any affine transformation that might have be applied to the the element or any ancestor)
 * provided that:
 *   1) The sum of padding left and border left width equals the sum of padding right and border right width
 *   2) The sum of padding top and border top width equals the sum of padding bottom and border bottom width
 *
 * When the criteria above aren’t met, the non-uniform padding/border needs to be accounted for, in order to find
 * the center of the content box. That is the reason for the complexity of this method.
 */
function getCenterOfContentBox(domElementHelper, CSSTransform) {
    const {
        left, top, width, height,
    } = domElementHelper.getBoundingClientRect();
    const padding = domElementHelper.getPadding();
    const borderWidth = domElementHelper.getBorderWidth();
    const {
        rotate: rotation, scaleX, scaleY, skewX,
    } = qrDecompose(CSSTransform);

    /* eslint-disable max-len */
    const x = (left + (width / 2)) - ((padding.right - padding.left) / 2) - ((borderWidth.right - borderWidth.left) / 2);
    const y = (top + (height / 2)) - ((padding.bottom - padding.top) / 2) - ((borderWidth.bottom - borderWidth.top) / 2);
    /* eslint-enable max-len */

    const matrix = transformMultiple(
        translate(left + (width / 2), top + (height / 2)),
        rotate((rotation * Math.PI) / 180),
        scale(scaleX, scaleY),
        skewXMatrix(skewX),
        translate(-(left + (width / 2)), -(top + (height / 2)))
    );

    return applyToPoint(matrix, { x, y });
}

function getCSSTransformsMatrix(DOMElement) {
    const elementTransform = window.getComputedStyle(DOMElement).transform;
    return elementTransform && elementTransform !== 'none' ? matrixFromString(elementTransform) : identity();
}

function getAccumulatedCSSTransform(DOMElement) {
    let currentDOMElement = DOMElement;
    let accumulatedMatrix = identity();

    do {
        accumulatedMatrix = transform(getCSSTransformsMatrix(currentDOMElement), accumulatedMatrix);
        currentDOMElement = currentDOMElement.offsetParent;
    } while (currentDOMElement);

    return accumulatedMatrix;
}

function getTransformationMatrix(DOMElement) {
    const domElementHelper = new DOMElementHelper(DOMElement);
    const accumulatedCSSTransform = getAccumulatedCSSTransform(DOMElement);

    const elementCenter = domElementHelper.getIsBorderBox()
        ? getCenterOfBorderBox(domElementHelper)
        : getCenterOfContentBox(domElementHelper, accumulatedCSSTransform);

    return overrideTranslation(getAccumulatedCSSTransform(DOMElement), elementCenter);
}

function transformPosition(matrix, position) {
    return applyToPoint(inverse(matrix), position);
}

function transformVelocity(matrix, velocity) {
    const { x, y } = extractTranslation(matrix);
    const translatedVelocityVector = {
        x: velocity.x + x,
        y: velocity.y + y,
    };

    return applyToPoint(inverse(matrix), translatedVelocityVector);
}

function transformRotation(matrix, rotation) {
    return rotation - extractRotation(matrix);
}

function transformScale(actualSnapTargetSize, actualDraggableSize) {
    return {
        scaleX: actualDraggableSize.width / actualSnapTargetSize.width,
        scaleY: actualDraggableSize.height / actualSnapTargetSize.height,
    };
}

function transformSkew(matrix, skewToTransform) {
    const targetSkew = extractSkew(matrix);

    return {
        skewX: skewToTransform.x - targetSkew.x,
        skewY: skewToTransform.y - targetSkew.y,
    };
}

/*
 * Given to transforms (objects with properties x, y, rotate, scale (or scaleX and scaleY), and skewX),
 * this function returns the matrix that represents the transformation from the first transform to the second.
 * If any of the transforms is only partially defined, any missing value will default to 0, except scale which
 * defaults to 1.
 */
function deltaMatrix(oldTransform = {}, newTransform = {}) {
    const DEFAULT_TRANSFORM = {
        x: 0, y: 0, rotate: 0, skewX: 0, scale: 1,
    };
    const o = { ...DEFAULT_TRANSFORM, ...oldTransform };
    const n = { ...DEFAULT_TRANSFORM, ...newTransform };

    const oScaleX = !isNullOrUndefined(o.scaleX) ? o.scaleX : o.scale;
    const oScaleY = !isNullOrUndefined(o.scaleY) ? o.scaleY : o.scale;
    const nScaleX = !isNullOrUndefined(n.scaleX) ? n.scaleX : n.scale;
    const nScaleY = !isNullOrUndefined(n.scaleY) ? n.scaleY : n.scale;

    return transform(
        translate(n.x - o.x, n.y - o.y),
        rotateDEG(n.rotate - o.rotate),
        scale(nScaleX / oScaleX, nScaleY / oScaleY),
        skewXMatrix(n.skewX - o.skewX)
    );
}

export {
    getAccumulatedCSSTransform,
    getTransformationMatrix,
    getCenterOfContentBox,
    getCenterOfBorderBox,
    qrDecompose,
    extractRotation,
    extractScale,
    extractSkew,
    extractTranslation,
    skew,
    transformMultiple,
    translationOnly,
    deltaMatrix,
    overrideTranslation,
    transformVelocity,
    transformPosition,
    transformRotation,
    transformScale,
    transformSkew,
};
