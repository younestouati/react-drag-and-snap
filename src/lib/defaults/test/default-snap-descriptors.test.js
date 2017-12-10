import {
	defaultSnapping,
	defaultSnappingAndSize,
	noSnapping,
	snapPosition,
	snapRotation,
	snapSize,
	snapPositionAndRotation,
	snapPositionAndSize,
	snapSizeAndRotation,
	snapProportionally,
	snapRotationProportionally,
	snapSizeProportionally,
	snapSizeAndRotationProportionally,
	withCustomSnapProps
} from '../default-snap-descriptors';

const inputTransform = {
    x: 1,
    y: 2,
    width: 3,
    height: 4,
    skewX: 5,
    skewY: 6,
    rotation: 7
};

test('noSnapping returns the given transform', () => {
    const outputTransform = noSnapping({transform: inputTransform});
    expect(outputTransform).toEqual(inputTransform);
});

test('defaultSnapping returns correct transform', () => {
    const outputTransform = defaultSnapping({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 0,
		y: 0,
		width: 3,
		height: 4,
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('defaultSnappingAndSize returns correct transform', () => {
    const outputTransform = defaultSnappingAndSize({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('snapPosition returns correct transform', () => {
    const outputTransform = snapPosition({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 0,
		y: 0,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
		rotation: 7
	});
});

test('snapRotation returns correct transform', () => {
    const outputTransform = snapRotation({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 1,
		y: 2,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
		rotation: 0
	});
});

test('snapSize returns correct transform', () => {
    const outputTransform = snapSize({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 1,
		y: 2,
		width: '100%',
		height: '100%',
		skewX: 5,
		skewY: 6,
		rotation: 7
	});
});

test('snapPositionAndRotation returns correct transform', () => {
    const outputTransform = snapPositionAndRotation({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 0,
		y: 0,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
		rotation: 0
	});
});

test('snapPositionAndSize returns correct transform', () => {
    const outputTransform = snapPositionAndSize({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		skewX: 5,
		skewY: 6,
		rotation: 7
	});
});

test('snapSizeAndRotation returns correct transform', () => {
    const outputTransform = snapSizeAndRotation({transform: inputTransform});
    expect(outputTransform).toEqual({
		x: 1,
		y: 2,
		width: '100%',
		height: '100%',
		skewX: 5,
		skewY: 6,
		rotation: 0
	});
});

test('snapProportionally returns correct transform when within inner radius', () => {
    const snapper = snapProportionally(30, 10);
     
    const outputTransform = snapper({transform: inputTransform, targetWidth: 10, targetHeight: 20});
    expect(outputTransform).toEqual({
        x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('snapProportionally returns correct transform when outside inner radius', () => {
    const snapper = snapProportionally(30, 10);
     
    const _inputTransform = Object.assign({}, inputTransform, {x: 20, y: 0});
    const outputTransform = snapper({transform: _inputTransform, targetWidth: 10, targetHeight: 20});
    expect(outputTransform).toEqual({
        x: 20 * 20/30,
		y: 0 * 20/30,
		width: 3 + (10 - 3) * (1 - 20/30),
		height: 4 + (20 - 4) * (1 - 20/30),
		skewX: 5 * 20/30,
		skewY: 6 * 20/30,
		rotation: 7 * 20/30
	});
});

test('snapRotationProportionally returns correct transform when within inner radius', () => {
    const snapper = snapRotationProportionally(30, 10);
     
    const outputTransform = snapper({transform: inputTransform});
    expect(outputTransform).toEqual({
        x: 0,
		y: 0,
		width: 3,
		height: 4,
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('snapRotationProportionally returns correct transform when outside inner radius', () => {
    const snapper = snapRotationProportionally(30, 10);
     
    const _inputTransform = Object.assign({}, inputTransform, {x: 20, y: 0});
    const outputTransform = snapper({transform: _inputTransform});
    expect(outputTransform).toEqual({
        x: 20,
		y: 0,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
		rotation: 7 * 20/30
	});
});

test('snapSizeProportionally returns correct transform when within inner radius', () => {
    const snapper = snapSizeProportionally(30, 10);
     
    const outputTransform = snapper({transform: inputTransform});
    expect(outputTransform).toEqual({
        x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('snapSizeProportionally returns correct transform when outside inner radius', () => {
    const snapper = snapSizeProportionally(30, 10);

    const _inputTransform = Object.assign({}, inputTransform, {x: 20, y: 0});
    const outputTransform = snapper({transform: _inputTransform, targetWidth: 10, targetHeight: 20});
    expect(outputTransform).toEqual({
        x: 20,
		y: 0,
		width: 3 + (10 - 3) * (1 - 20/30),
		height: 4 + (20 - 4) * (1 - 20/30),
		skewX: 5,
		skewY: 6,
		rotation: 7
	});
});

test('snapSizeAndRotationProportionally returns correct transform when within inner radius', () => {
    const snapper = snapSizeAndRotationProportionally(30, 10);
     
    const outputTransform = snapper({transform: inputTransform});
    expect(outputTransform).toEqual({
        x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		skewX: 0,
		skewY: 0,
		rotation: 0
	});
});

test('snapSizeAndRotationProportionally returns correct transform when outside inner radius', () => {
    const snapper = snapSizeAndRotationProportionally(30, 10);

    const _inputTransform = Object.assign({}, inputTransform, {x: 20, y: 0});
    const outputTransform = snapper({transform: _inputTransform, targetWidth: 10, targetHeight: 20});
    expect(outputTransform).toEqual({
        x: 20,
		y: 0,
		width: 3 + (10 - 3) * (1 - 20/30),
		height: 4 + (20 - 4) * (1 - 20/30),
		skewX: 5,
		skewY: 6,
		rotation: 7 * 20/30
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
		rotation: 7
	}, {someProp: 'someValue'});

    const outputTransform = snapper({transform: inputTransform});
    expect(outputTransform).toEqual({
        x: 1,
		y: 2,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
        rotation: 7,
        customSnapProps: {
            someProp: 'someValue'
        }
	});
});

test('withCustomSnapProps works with callback functions ', () => {
    const snapper = withCustomSnapProps(noSnapping, () => ({someProp: 'someValue'}));

    const outputTransform = snapper({transform: inputTransform});
    expect(outputTransform).toEqual({
        x: 1,
		y: 2,
		width: 3,
		height: 4,
		skewX: 5,
		skewY: 6,
        rotation: 7,
        customSnapProps: {
            someProp: 'someValue'
        }
	});
});