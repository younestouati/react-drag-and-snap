import createSnapMatrix from '../create-snapping-matrix';
import normalizeTransform from '../normalize-transform';

test('parseSnapTransform fills in missing values with defaults', () => {
    const descriptor = normalizeTransform({}, { width: 100, height: 200 }, { width: 300, height: 400 });

    expect(descriptor.x).toBe(0);
    expect(descriptor.y).toBe(0);
    expect(descriptor.width).toBe(300);
    expect(descriptor.height).toBe(400);
    expect(descriptor.skewX).toBe(0);
    expect(descriptor.skewY).toBe(0);
    expect(descriptor.rotate).toBe(0);
});

test('parseSnapTransform returns a fully specificied numeric descriptor as-is', () => {
    const inputDescriptor = {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 7,
    };

    const parsedDescriptor = normalizeTransform(
        inputDescriptor,
        { width: 100, height: 200 }, { width: 300, height: 400 }
    );
    expect(parsedDescriptor).toEqual(Object.assign({}, inputDescriptor, { customSnapProps: {} }));
});

test('parseSnapTransform correctly interprets percentages', () => {
    const inputDescriptor = {
        x: '10%',
        y: '-10%',
        width: '50%',
        height: '100%',
        skewX: 5,
        skewY: 6,
        rotate: 7,
    };

    const parsedDescriptor = normalizeTransform(
        inputDescriptor,
        { width: 100, height: 200 }, { width: 300, height: 400 }
    );
    expect(parsedDescriptor).toEqual({
        x: 10,
        y: -20,
        height: 200,
        width: 50,
        skewX: 5,
        skewY: 6,
        rotate: 7,
        customSnapProps: {},
    });
});


test('parseSnapTransform throws if given an invalid string value (not a percentage)', () => {
    const inputDescriptor = {
        x: '10%',
        y: 'a',
        width: '50%',
        height: '100%',
        skewX: 5,
        skewY: 6,
        rotate: 7,
    };

    expect(() => normalizeTransform(
        inputDescriptor,
        { width: 100, height: 200 }, { width: 300, height: 400 }
    )).toThrow();
});

test('createSnappingMatrix correctly calculates the snapping matrix', () => {
    const baseMatrix = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 10,
    };
    const descriptor = {
        x: 15,
        y: 30,
        width: 50,
        height: 100,
        skewX: 15,
        skewY: 0,
        rotate: 45,
    };
    const draggableSize = { width: 20, height: 30 };

    const m = createSnapMatrix(baseMatrix, descriptor, draggableSize);

    expect(m.a).toBeCloseTo(-1.77);
    expect(m.b).toBeCloseTo(5.3);
    expect(m.c).toBeCloseTo(-11.34);
    expect(m.d).toBeCloseTo(43.45);
    expect(m.e).toBeCloseTo(110);
    expect(m.f).toBeCloseTo(160);
});
