import {lowestPriority, highestPriority, defaultPriority} from '../default-snap-priority';

test('lowestPriority is the highest possible number', () => {
    expect(lowestPriority).toEqual(Number.MAX_VALUE);
});

test('highestPriority is 1', () => {
    expect(highestPriority).toEqual(1);
});

test('defaultPriority is 10', () => {
    expect(defaultPriority).toEqual(10);
});