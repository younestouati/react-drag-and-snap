import guidUtils from '../guid-utils';

test('createGuid return a valid guid', () => {
    const g = guidUtils.createGuid();
    expect(typeof g).toBe('string');
    expect(g).toHaveLength(36);
});

test('createGuid returns different values each time', () => {
    const g1 = guidUtils.createGuid();
    const g2 = guidUtils.createGuid();

    expect(g1 === g2).toBe(false);
});
