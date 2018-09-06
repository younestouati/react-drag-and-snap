import {
    snapAllButScale,
    snapAll,
    noSnapping,
    snapPosition,
    snapRotation,
    snapSize,
    snapPositionAndRotation,
    snapPositionAndScale,
    snapSizeAndRotation,
    withCustomSnapProps,
} from '../default-snap-transforms';

const inputTransform = {
    x: 1,
    y: 2,
    width: 3,
    height: 4,
    skewX: 5,
    skewY: 6,
    rotate: 7,
};

test('noSnapping returns the given transform', () => {
    const outputTransform = noSnapping({ transform: inputTransform });
    expect(outputTransform).toEqual(inputTransform);
});

test('defaultSnapping returns correct transform', () => {
    const outputTransform = snapAllButScale({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 0,
        y: 0,
        width: 3,
        height: 4,
        skewX: 0,
        skewY: 0,
        rotate: 0,
    });
});

test('snapAll returns correct transform', () => {
    const outputTransform = snapAll({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 0,
        y: 0,
        scale: 1,
        skewX: 0,
        skewY: 0,
        rotate: 0,
    });
});

test('snapPosition returns correct transform', () => {
    const outputTransform = snapPosition({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 0,
        y: 0,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 7,
    });
});

test('snapRotation returns correct transform', () => {
    const outputTransform = snapRotation({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 0,
    });
});

test('snapSize returns correct transform', () => {
    const outputTransform = snapSize({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 1,
        y: 2,
        width: '100%',
        height: '100%',
        skewX: 5,
        skewY: 6,
        rotate: 7,
    });
});

test('snapPositionAndRotation returns correct transform', () => {
    const outputTransform = snapPositionAndRotation({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 0,
        y: 0,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 0,
    });
});

test('snapPositionAndSize returns correct transform', () => {
    const outputTransform = snapPositionAndScale({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 0,
        y: 0,
        width: '100%',
        height: '100%',
        skewX: 5,
        skewY: 6,
        rotate: 7,
    });
});

test('snapSizeAndRotation returns correct transform', () => {
    const outputTransform = snapSizeAndRotation({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 1,
        y: 2,
        width: '100%',
        height: '100%',
        skewX: 5,
        skewY: 6,
        rotate: 0,
    });
});

test('withCustomSnapProps correctly appends custom snapProps', () => {
    const snapper = withCustomSnapProps({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 7,
    }, { someProp: 'someValue' });

    const outputTransform = snapper({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 7,
        customSnapProps: {
            someProp: 'someValue',
        },
    });
});

test('withCustomSnapProps works with callback functions ', () => {
    const snapper = withCustomSnapProps(noSnapping, () => ({ someProp: 'someValue' }));

    const outputTransform = snapper({ transform: inputTransform });
    expect(outputTransform).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        skewX: 5,
        skewY: 6,
        rotate: 7,
        customSnapProps: {
            someProp: 'someValue',
        },
    });
});
