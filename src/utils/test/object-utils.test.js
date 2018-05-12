import {extend, iterate, shallowClone, shallowCloneExcluding} from '../object-utils';

test('extend merges the given objects without mutating them', () => {
    const o1 = {a: 1, b: 2};
    const o2 = {b: 3, c: 4};
    const o3 = extend(o1, o2);

    expect(o1.a).toBe(1);
    expect(o1.b).toBe(2);
    expect(o1.c).toBe(undefined);

    expect(o2.a).toBe(undefined);
    expect(o2.b).toBe(3);
    expect(o2.c).toBe(4);

    expect(o3.a).toBe(1);
    expect(o3.b).toBe(3);
    expect(o3.c).toBe(4);
});

test('iterate iterates over the all the keys of the given object', () => {
    const o1 = {
        key1: 1,
        key2: 2,
        key3: 3
    };

    const o2 = {};

    iterate(o1, (val, key) => o2[key] = val);

    expect(o2.key1).toBe(1);
    expect(o2.key2).toBe(2);
    expect(o2.key3).toBe(3);
});

test('shallowClone clones the given object without mutating it', () => {
    const o1 = {
        a: 1,
        b: 2
    };

    const o2 = shallowClone(o1);
    o2.b = 3;

    expect(o1.a).toBe(1);
    expect(o1.b).toBe(2);

    expect(o2.a).toBe(1);
    expect(o2.b).toBe(3);
});

test('shallowCloneExcluding clones the given object (except the specified keys) without mutating it', () => {
    const o1 = {
        a: 1,
        b: 2,
        c: 3
    };

    const o2 = shallowCloneExcluding(o1, ['c']);
    o2.b = 3;

    expect(o1.a).toBe(1);
    expect(o1.b).toBe(2);
    expect(o1.c).toBe(3);

    expect(o2.a).toBe(1);
    expect(o2.b).toBe(3);
    expect(o2.c).toBe(undefined);
});