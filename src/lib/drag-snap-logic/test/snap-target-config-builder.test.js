import {snapTargetConfigBuilder} from '../snap-target-config-builder';

test('SnapTargetConfigBuilder returns a config with the default criteria when no custom config is provided', () => {
    const config = snapTargetConfigBuilder();
    const draggedItems = [{id: 1}];

    const withinRadiusDescriptor = {id: 1, transform: {x: 2, y: 0}, targetWidth:3, targetHeight: 4};
    const outsideRadiusDescriptor = {id: 1, transform: {x: 3, y: 0}, targetWidth:3, targetHeight: 4};

    expect(config.snapCriteria(withinRadiusDescriptor, {draggedItems})).toBe(true);
    expect(config.snapCriteria(outsideRadiusDescriptor, {draggedItems})).toBe(false);
    expect(config.releaseSnapCriteria(withinRadiusDescriptor, {draggedItems})).toBe(true);
    expect(config.releaseSnapCriteria(outsideRadiusDescriptor, {draggedItems})).toBe(false);
    expect(config.dragSnapCriteria(withinRadiusDescriptor, {draggedItems})).toBe(true);
    expect(config.dragSnapCriteria(outsideRadiusDescriptor, {draggedItems})).toBe(false);
});

test('SnapTargetConfigBuilder returns a config with the default snap descriptors when no custom config is provided', () => {
    const config = snapTargetConfigBuilder();
    const transform = {width: 10, height: 20};
    const expectedDescriptor = {
        x: 0,
		y: 0,
		width: 10,
		height: 20,
		skewX: 0,
		skewY: 0,
		rotation: 0    
    }

    expect(config.snapDescriptor({transform})).toEqual(expectedDescriptor);
    expect(config.dragSnapDescriptor({transform})).toEqual(expectedDescriptor);
    expect(config.releaseSnapDescriptor({transform})).toEqual(expectedDescriptor);
});

test('SnapTargetConfigBuilder lets snapCriteria override releaseCriteria and dragCriteria if these are not explicitly set', () => {
    const customSnapCriteria = ({transform}) => transform.x > 2;
    
    const config = snapTargetConfigBuilder({
        snapCriteria: customSnapCriteria
    });

    expect(config.snapCriteria).toEqual(customSnapCriteria);
    expect(config.dragSnapCriteria).toEqual(customSnapCriteria);
    expect(config.releaseSnapCriteria).toEqual(customSnapCriteria);
});

test('SnapTargetConfigBuilder lets snapDescriptor override releaseSnapDescriptor and dragSnapDescriptor if these are not explicitly set', () => {
    const snapDescriptor = () => {};
    const config = snapTargetConfigBuilder({snapDescriptor});

    expect(config.snapDescriptor).toEqual(snapDescriptor);
    expect(config.dragSnapDescriptor).toEqual(snapDescriptor);
    expect(config.releaseSnapDescriptor).toEqual(snapDescriptor);
});

test('SnapTargetConfigBuilder allows independently setting dragSnapCriteria and releaseSnapCriteria', () => {
    const dragSnapCriteria = () => {};
    const releaseSnapCriteria = () => {};
    const config = snapTargetConfigBuilder({dragSnapCriteria, releaseSnapCriteria});

    expect(config.dragSnapCriteria).toEqual(dragSnapCriteria);
    expect(config.releaseSnapCriteria).toEqual(releaseSnapCriteria);
});

test('SnapTargetConfigBuilder allows independently setting dragSnapDescriptor and releaseSnapDescriptor', () => {
    const dragSnapDescriptor = () => {};
    const releaseSnapDescriptor = () => {};
    const config = snapTargetConfigBuilder({dragSnapDescriptor, releaseSnapDescriptor});

    expect(config.dragSnapDescriptor).toEqual(dragSnapDescriptor);
    expect(config.releaseSnapDescriptor).toEqual(releaseSnapDescriptor);
});