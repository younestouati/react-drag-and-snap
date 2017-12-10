import {
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
	matrixToDescriptor,
	descriptorToMatrix,
	transformDescriptor,
	transformVelocity,
	transformPosition
} from '../matrix';


/*
    Matrix with:
    x: 10
    y: 20,
    scaleX: 2,
    scaleY: 3
    rotation: 30
    skewX: 15
    skewY: 0 
*/
const m = { 
    a: 1.7320508075688774,
    b: 0.9999999999999999,
    c: -1.0358983848622452,
    d: 2.866025403784439,
    e: 10,
    f: 20
};

test('qrDecompose correctly decomposes a matrix', () => {
    const qrd = qrDecompose(m);

    expect(qrd.x).toBeCloseTo(10);
    expect(qrd.y).toBeCloseTo(20);
    expect(qrd.scaleX).toBeCloseTo(2);
    expect(qrd.scaleY).toBeCloseTo(3);
    expect(qrd.skewX).toBeCloseTo(15);
    expect(qrd.rotation).toBeCloseTo(30);
});

test('overrideTranslation overrides the translation for the given matrix', () => {
    const m1 = overrideTranslation(m, {x: 15, y: 30});

    expect(m1.a).toBeCloseTo(m.a);
    expect(m1.b).toBeCloseTo(m.b);
    expect(m1.c).toBeCloseTo(m.c);
    expect(m1.d).toBeCloseTo(m.d);
    expect(m1.e).toBeCloseTo(15);
    expect(m1.f).toBeCloseTo(30);
});

test('translation only returns given matrix where rotation, scaling and skewing has been reset', () => {
    const m1 = translationOnly(m);

    expect(m1.a).toBeCloseTo(1);
    expect(m1.b).toBeCloseTo(0);
    expect(m1.c).toBeCloseTo(0);
    expect(m1.d).toBeCloseTo(1);
    expect(m1.e).toBeCloseTo(10);
    expect(m1.f).toBeCloseTo(20);
});

test('extractTranslation returns a point representing the translation part of the given matrix', () => {
    const t = extractTranslation(m);

    expect(t.x).toBeCloseTo(10);
    expect(t.y).toBeCloseTo(20);
});

test('extractScale returns an object representing the scaling part of the given matrix', () => {
    const s = extractScale(m);

    expect(s.x).toBeCloseTo(2);
    expect(s.y).toBeCloseTo(3);
});

test('extractRotation returns rotation of the given matrix', () => {
    const r = extractRotation(m);

    expect(r).toBeCloseTo(30);
});

test('extractSkew returns an object representing the skew of the given matrix', () => {
    const s = extractSkew(m);

    expect(s.x).toBeCloseTo(15);
    expect(s.y).toBeCloseTo(0);
});

test('skewXMatrix return a matrix representing the given skew in the X dimensions', () => {
    const sm = skewXMatrix(60);

    expect(sm.a).toBeCloseTo(1);
    expect(sm.b).toBeCloseTo(0);
    expect(sm.c).toBeCloseTo(1.73205);
    expect(sm.d).toBeCloseTo(1);
    expect(sm.e).toBeCloseTo(0);
    expect(sm.f).toBeCloseTo(0);
});

test('matrixToDescriptor returns a descriptor describing the given matrix', () => {
    const d = matrixToDescriptor(m, {width: 4, height: 5});

    expect(d.x).toBeCloseTo(10);
    expect(d.y).toBeCloseTo(20);
    expect(d.width).toBeCloseTo(4 * 2);
    expect(d.height).toBeCloseTo(5 * 3);
    expect(d.skewX).toBeCloseTo(15);
    expect(d.skewY).toBeCloseTo(0);
    expect(d.rotation).toBeCloseTo(30);
});

test('descriptorToMatrix returns a matrix corresponding to the given descriptor', () => {
    const d = {
        x: 10,
        y: 20,
        width: 4 * 2,
        height: 5 * 3,
        skewX: 15,
        skewY: 0,
        rotation: 30
    };

    const m1 = descriptorToMatrix(d, {width: 4, height: 5});

    expect(m1.a).toBeCloseTo(m.a);
    expect(m1.b).toBeCloseTo(m.b);
    expect(m1.c).toBeCloseTo(m.c);
    expect(m1.d).toBeCloseTo(m.d);
    expect(m1.e).toBeCloseTo(m.e);
    expect(m1.f).toBeCloseTo(m.f);
});

test('transformPosition transforms the given point by the given matrix', () => {
    const p = transformPosition(m, {x: 1, y: 2});

    expect(p.x).toBeCloseTo(-7.407);
    expect(p.y).toBeCloseTo(-3.696);
});

test('transformVelocity transforms the given velocity by the given matrix', () => {
    const v = transformVelocity(m, {x: 1, y: 2});

    expect(v.x).toBeCloseTo(0.82);
    expect(v.y).toBeCloseTo(0.41);
});

test('transformMultiple correctly multiplies multiple matrices', () => {
    const m1 = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};
    const m2 = {a: 7, b: 8, c: 9, d: 10, e: 11, f: 12};
    const m3 = {a: 13, b: 14, c: 15, d: 16, e: 17, f: 18};

    const m4 = transformMultiple(m1, m2, m3);

    expect(m4.a).toBeCloseTo(949);
    expect(m4.b).toBeCloseTo(1410);
    expect(m4.c).toBeCloseTo(1089);
    expect(m4.d).toBeCloseTo(1618);
    expect(m4.e).toBeCloseTo(1281);
    expect(m4.f).toBeCloseTo(1902);
});

describe('Extracting matrices from DOM elements', () => {

    beforeEach(() => {
        const getComputedStyleMock = jest.fn();    
        getComputedStyleMock 
        .mockReturnValueOnce({transform: 'matrix(13,14,15,16,17,18)'})
        .mockReturnValueOnce({transform: 'matrix(7,8,9,10,11,12)'})
        .mockReturnValueOnce({transform: 'matrix(1,2,3,4,5,6)'});
    
        window.getComputedStyle = getComputedStyleMock;
        window.scrollX = 5;
        window.scrollY = 10;
    });

    const DOMElement1 = {};
    const DOMElement2 = {offsetParent: DOMElement1};
    const DOMElement3 = {
        offsetParent: DOMElement2,
        getBoundingClientRect: jest.fn(() => ({left: 5, top: 10, width: 15, height: 20}))
    };

    test('getAccumulatedMatrix returns the accumulated matrix for the given DOMElement', () => {
        const m1 = getAccumulatedMatrix(DOMElement3);

        expect(m1.a).toBeCloseTo(949);
        expect(m1.b).toBeCloseTo(1410);
        expect(m1.c).toBeCloseTo(1089);
        expect(m1.d).toBeCloseTo(1618);
        expect(m1.e).toBeCloseTo(1281);
        expect(m1.f).toBeCloseTo(1902);
    });

    test('getTransformationMatrix returns the transformation matrix for the given DOMElement', () => {
        const m1 = getTransformationMatrix(DOMElement3);

        expect(m1.a).toBeCloseTo(949);
        expect(m1.b).toBeCloseTo(1410);
        expect(m1.c).toBeCloseTo(1089);
        expect(m1.d).toBeCloseTo(1618);
        expect(m1.e).toBeCloseTo(17.5);
        expect(m1.f).toBeCloseTo(30);
    });
});

test('deltaMatrix returns matrix that represents the delta between the two given descriptors', () => {
    const oldDescriptor = {
        x: 0,
        y: 5,
        scaleX: 2,
        scaleY: 2,
        skewX: 15,
        skewY: 0,
        rotation: 30
    };

    const newDescriptor = {
        x: 5,
        y: 15,
        scaleX: 2,
        scaleY: 4,
        skewX: 30,
        skewY: 0,
        rotation: 45   
    };

    const m1 = deltaMatrix(oldDescriptor, newDescriptor);

    expect(m1.a).toBeCloseTo(0.966);
    expect(m1.b).toBeCloseTo(0.259);
    expect(m1.c).toBeCloseTo(-0.259);
    expect(m1.d).toBeCloseTo(2.001);
    expect(m1.e).toBeCloseTo(5);
    expect(m1.f).toBeCloseTo(10);
});

test('transformDescriptor returns the given descriptor transformed by the given matrix', () => {
    const descriptor = {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotation: 7
    };

    const d = transformDescriptor(m, descriptor);

    expect(d.x).toBeCloseTo(-7.41);
    expect(d.y).toBeCloseTo(-3.70);
    expect(d.width).toBeCloseTo(1.5);
    expect(d.height).toBeCloseTo(1.33);
    expect(d.skewX).toBeCloseTo(-10);
    expect(d.skewY).toBeCloseTo(6);
    expect(d.rotation).toBeCloseTo(-23);
});