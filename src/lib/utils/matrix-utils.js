import {transform, translate, identity, fromObject, rotateDEG, scale, applyToPoint, inverse} from 'transformation-matrix';
import {isNullOrUndefined} from './type-utils';
import {extend} from './object-utils';

const floating = '(\\-?[\\d\\.e]+)';
const commaSpace = '\\,?\\s*';

const reg = {
	matrix: new RegExp(
		'^matrix\\(' +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + '\\)$')
};

function matrixFromString(string){
	let matrix = reg.matrix.exec(string);
	if (matrix) {
		matrix.shift();

		for (let i = matrix.length-1; i >= 0 ; i--) {
			matrix[i] = parseFloat(matrix[i]);
		}
	}

	matrix = matrix || [ 1, 0, 0, 1, 0, 0 ];

	return {
		a: matrix[0],
		b: matrix[1],
		c: matrix[2],
		d: matrix[3],
		e: matrix[4],
		f: matrix[5]
	};
}

function extractRotation(matrix) {
	return Math.atan2(matrix.b, matrix.a) / (Math.PI / 180);
}

function extractScale(matrix) {
	const denom = Math.pow(matrix.a, 2) + Math.pow(matrix.b, 2);
	const x = Math.sqrt(denom);
	const y = (matrix.a * matrix.d - matrix.c * matrix.b) / x;
	return {x, y};
}

function extractSkew(matrix) {
	const denom = Math.pow(matrix.a, 2) + Math.pow(matrix.b, 2);
	const skewX = Math.atan2(matrix.a * matrix.c + matrix.b * matrix.d, denom) / (Math.PI / 180);

	return {
		x: skewX,
		y: 0
	};
}

function extractTranslation(matrix) {
	return {
		x: matrix.e,
		y: matrix.f
	};
}

function skewXMatrix(x) {
	return fromObject({
		a: 1,
		b: 0,
		c: Math.tan(x / 180 * Math.PI),
		d: 1,
		e: 0,
		f: 0
	});
}

function translationOnly(matrix) {
	return extend(matrix, {a: 1, b: 0, c: 0, d: 1});
}

function overrideTranslation (matrix, {x, y}) {
	return extend(matrix, {e: x, f: y});
}

//Based on this: https://github.com/kangax/fabric.js/blob/master/src/util/misc.js
function qrDecompose(matrix) {
	const scale = extractScale(matrix);
	const skew = extractSkew(matrix);

	return {
		rotate: extractRotation(matrix), 	// rotation in degrees
		scaleX: scale.x,
		scaleY: scale.y,
		skewX: skew.x,		 			 	// skewX in degrees
		skewY: 0,                      		// skewY in degrees
		x: matrix.e,
		y: matrix.f
	};
}

function getCSSTransformsMatrix(DOMElement) {
	const elementTransform = window.getComputedStyle(DOMElement).transform;
	return elementTransform && elementTransform !== 'none' ? matrixFromString(elementTransform) : identity();
}

function getAccumulatedMatrix(DOMElement) {
	let accumulatedMatrix = identity();

	do {
		accumulatedMatrix = transform(getCSSTransformsMatrix(DOMElement), accumulatedMatrix);
		DOMElement = DOMElement.offsetParent
	} while(DOMElement);

	return accumulatedMatrix;
}

function getTransformationMatrix(DOMElement) {
	const bcr = DOMElement.getBoundingClientRect();
	const translation = {
		x: (bcr.left + window.scrollX + bcr.width/2),
		y: (bcr.top + window.scrollY + bcr.height/2)
	};

	return overrideTranslation(getAccumulatedMatrix(DOMElement), translation);
}

function transformMultiple (...matrices) {
	return matrices.reduce((acc, cur) => transform(acc, cur), identity());
}

function transformPosition(matrix, position) {
	return applyToPoint(inverse(matrix), position);
}

function transformVelocity(matrix, velocity) {
	const {x, y} = extractTranslation(matrix);
	const translatedVelocityVector = {
		x: velocity.x + x,
		y: velocity.y + y
	};

	return applyToPoint(inverse(matrix), translatedVelocityVector);
}

function transformRotation(matrix, rotation) {
	return rotation - extractRotation(matrix);
}

function transformScale(actualSnapTargetSize, actualDraggableSize) {
	return {
		scaleX: actualDraggableSize.width / actualSnapTargetSize.width,
		scaleY: actualDraggableSize.height / actualSnapTargetSize.height
	};
}

function transformSkew(matrix, skew) {
	const targetSkew = extractSkew(matrix);

	return {
		skewX: skew.x - targetSkew.x,
		skewY: skew.y - targetSkew.y
	};
}

/* 
 * Given to transforms (objects with properties x, y, rotate, scale (or scaleX and scaleY), and skewX),
 * this function returns the matrix that represents the transformation from the first transform to the second.
 * If any of the transforms is only partially defined, any missing value will default to 0, except scale which
 * defaults to 1.
 */
function deltaMatrix (oldTransform = {}, newTransform = {}) {
	const DETAULT_TRANSFORM = {x: 0, y: 0, rotate: 0, skewX: 0, scale: 1};
	const o = extend(DETAULT_TRANSFORM, oldTransform);
	const n = extend(DETAULT_TRANSFORM, newTransform);

	const oScaleX = !isNullOrUndefined(o.scaleX) ? o.scaleX : o.scale;
	const oScaleY = !isNullOrUndefined(o.scaleY) ? o.scaleY : o.scale;
	const nScaleX = !isNullOrUndefined(n.scaleX) ? n.scaleX : n.scale;
	const nScaleY = !isNullOrUndefined(n.scaleY) ? n.scaleY : n.scale;

	return transform(
		translate(n.x - o.x, n.y - o.y),
		rotateDEG(n.rotate - o.rotate),
		scale(nScaleX/oScaleX, nScaleY/oScaleY),
		skewXMatrix(n.skewX - o.skewX)
	);
}

export {
	getAccumulatedMatrix,
	getTransformationMatrix,
	qrDecompose,
	extractRotation,
	extractScale,
	extractSkew,
	extractTranslation,
	skewXMatrix,
	transformMultiple,
	translationOnly,
	deltaMatrix,
	overrideTranslation,
	transformVelocity,
	transformPosition,
	transformRotation,
	transformScale,
	transformSkew
};