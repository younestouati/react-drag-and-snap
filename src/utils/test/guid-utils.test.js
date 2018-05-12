import {createGuid} from '../guid-utils';

test('createGuid return a valid guid', () => {
    const g = createGuid();
    expect(typeof g).toBe("string");
    expect(g.length).toBe(36);
});

test('createGuid returns different values each time', () => {
    const g1 = createGuid();
    const g2 = createGuid();

    expect(g1 === g2).toBe(false);
});