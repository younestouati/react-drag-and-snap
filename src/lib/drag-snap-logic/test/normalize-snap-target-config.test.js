import {normalizeSnapTargetConfig} from '../normalize-snap-target-config';

test('SnapTargetConfigBuilder returns a config with the default criteria when no custom config is provided', () => {
    const config = normalizeSnapTargetConfig();
    const draggedItems = [{id: 1}];
    const targetDescriptor = {width:3, height: 4}

    const withinRadiusDescriptor = {id: 1, transform: {x: 2, y: 0}};
    const outsideRadiusDescriptor = {id: 1, transform: {x: 3, y: 0}};

    expect(config.snapCriteria(withinRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(true);
    expect(config.snapCriteria(outsideRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(false);
    expect(config.releaseSnapCriteria(withinRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(true);
    expect(config.releaseSnapCriteria(outsideRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(false);
    expect(config.dragSnapCriteria(withinRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(true);
    expect(config.dragSnapCriteria(outsideRadiusDescriptor, targetDescriptor, {draggedItems})).toBe(false);
});

test('SnapTargetConfigBuilder returns a config with the default snap descriptors when no custom config is provided', () => {
    const config = normalizeSnapTargetConfig();
    const transform = {width: 10, height: 20};
    const expectedDescriptor = {
        x: 0,
		y: 0,
		width: 10,
		height: 20,
		skewX: 0,
		skewY: 0,
		rotate: 0    
    }

    expect(config.snapTransform({transform})).toEqual(expectedDescriptor);
    expect(config.dragSnapTransform({transform})).toEqual(expectedDescriptor);
    expect(config.releaseSnapTransform({transform})).toEqual(expectedDescriptor);
});

test('SnapTargetConfigBuilder lets snapCriteria override releaseCriteria and dragCriteria if these are not explicitly set', () => {
    const customSnapCriteria = ({transform}) => transform.x > 2;
    
    const config = normalizeSnapTargetConfig({
        snapCriteria: customSnapCriteria
    });

    expect(config.snapCriteria).toEqual(customSnapCriteria);
    expect(config.dragSnapCriteria).toEqual(customSnapCriteria);
    expect(config.releaseSnapCriteria).toEqual(customSnapCriteria);
});

test('SnapTargetConfigBuilder lets snapTransform override releaseSnapTransform and dragSnapTransform if these are not explicitly set', () => {
    const snapTransform = () => {};
    const config = normalizeSnapTargetConfig({snapTransform});

    expect(config.snapTransform).toEqual(snapTransform);
    expect(config.dragSnapTransform).toEqual(snapTransform);
    expect(config.releaseSnapTransform).toEqual(snapTransform);
});

test('SnapTargetConfigBuilder allows independently setting dragSnapCriteria and releaseSnapCriteria', () => {
    const dragSnapCriteria = () => {};
    const releaseSnapCriteria = () => {};
    const config = normalizeSnapTargetConfig({dragSnapCriteria, releaseSnapCriteria});

    expect(config.dragSnapCriteria).toEqual(dragSnapCriteria);
    expect(config.releaseSnapCriteria).toEqual(releaseSnapCriteria);
});

test('SnapTargetConfigBuilder allows independently setting dragSnapTransform and releaseSnapTransform', () => {
    const dragSnapTransform = () => {};
    const releaseSnapTransform = () => {};
    const config = normalizeSnapTargetConfig({dragSnapTransform, releaseSnapTransform});

    expect(config.dragSnapTransform).toEqual(dragSnapTransform);
    expect(config.releaseSnapTransform).toEqual(releaseSnapTransform);
});