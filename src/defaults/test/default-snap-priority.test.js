import SnapPriorities from '../default-snap-priorities';

test('lowestPriority is the highest possible number', () => {
    expect(SnapPriorities.lowestPriority).toEqual(Number.MAX_VALUE);
});

test('highestPriority is 1', () => {
    expect(SnapPriorities.highestPriority).toEqual(1);
});

test('defaultPriority is 10', () => {
    expect(SnapPriorities.defaultPriority).toEqual(10);
});
