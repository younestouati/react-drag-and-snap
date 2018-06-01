import { addPoints, subtractPoints, averagePoints, scalePoint, distance, getOrigo } from '../point-utils';

test('addPoints correctly adds two point', () => {
    const p1 = { x: 1, y: 2 };
    const p2 = { x: 3, y: 4 };
    const addedPoint = addPoints(p1, p2);

    expect(addedPoint.x).toBe(4);
    expect(addedPoint.y).toBe(6);
});

test('subtractPoints correctly subtracts second point from the first', () => {
    const p1 = { x: 1, y: 2 };
    const p2 = { x: 3, y: 4 };
    const subtractedPoint = subtractPoints(p1, p2);

    expect(subtractedPoint.x).toBe(-2);
    expect(subtractedPoint.y).toBe(-2);
});

test('averagePoints to return the point representing the center of gravity of the given points', () => {
    const points = [
        { x: -2, y: 2 },
        { x: 2, y: 4 },
        { x: 6, y: 6 },
    ];

    const average = averagePoints(points);
    expect(average.x).toBe(2);
    expect(average.y).toBe(4);
});


test('scalePoints to scale the given point by the given scalar', () => {
    const point = { x: 1, y: 2 };
    const scaledPoint = scalePoint(point, 4);
    expect(scaledPoint.x).toBe(4);
    expect(scaledPoint.y).toBe(8);
});

test('distance to return the distance between two points', () => {
    const p1 = { x: 1, y: 2 };
    const p2 = { x: 4, y: 6 };

    const dist = distance(p1, p2);
    expect(dist).toBe(5);
});

test('distance uses origo as second point as default', () => {
    const p1 = { x: 3, y: 4 };
    const dist = distance(p1);
    expect(dist).toBe(5);
});

test('getOrigo to return origo', () => {
    const origo = getOrigo();
    expect(origo.x).toBe(0);
    expect(origo.y).toBe(0);
});
