import { isBoolean, isFunction, isObject, isNumber, isString, isArray, isNullOrUndefined } from '../type-utils';

test('isBoolean correctly recognizes a boolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);

    expect(isBoolean()).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean(4)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean(() => {})).toBe(false);
});

test('isFunction correctly recognizes a function', () => {
    /* eslint-disable-next-line func-names */
    const f1 = function () {};
    const f2 = () => {};
    function f3() {}

    expect(isFunction(f1)).toBe(true);
    expect(isFunction(f2)).toBe(true);
    expect(isFunction(f3)).toBe(true);

    expect(isFunction()).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction('')).toBe(false);
    expect(isFunction(4)).toBe(false);
    expect(isFunction(0)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(true)).toBe(false);
});

test('isObject correctly recognizes an object', () => {
    const o1 = {};
    /* eslint-disable-next-line no-new-object */
    const o2 = new Object();

    expect(isObject(o1)).toBe(true);
    expect(isObject(o2)).toBe(true);

    expect(isObject()).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(4)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(true)).toBe(false);
});

test('isNumber correctly recognizes a number', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(5)).toBe(true);
    expect(isNumber(1 / 3)).toBe(true);
    expect(isNumber(Math.PI)).toBe(true);

    expect(isNumber()).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber('3')).toBe(false);
    expect(isNumber(() => {})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(true)).toBe(false);
});

test('isString correctly recognizes a string', () => {
    expect(isString('')).toBe(true);
    expect(isString(String('test'))).toBe(true);
    expect(isString('Hello')).toBe(true);

    expect(isString()).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(3)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(0)).toBe(false);
    expect(isString(() => {})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(true)).toBe(false);
});

test('isArray correctly recognizes an array', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(new Array(1))).toBe(true);

    expect(isArray()).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(3)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(0)).toBe(false);
    expect(isArray(() => {})).toBe(false);
    expect(isArray('')).toBe(false);
    expect(isArray('string')).toBe(false);
    expect(isArray(true)).toBe(false);
});

test('isNullOrUndefined correctly recognizes null and undefined', () => {
    expect(isNullOrUndefined()).toBe(true);
    expect(isNullOrUndefined(null)).toBe(true);
    expect(isNullOrUndefined(undefined)).toBe(true);

    expect(isNullOrUndefined([1, 2, 3])).toBe(false);
    expect(isNullOrUndefined([])).toBe(false);
    expect(isNullOrUndefined(3)).toBe(false);
    expect(isNullOrUndefined({})).toBe(false);
    expect(isNullOrUndefined(0)).toBe(false);
    expect(isNullOrUndefined(() => {})).toBe(false);
    expect(isNullOrUndefined('')).toBe(false);
    expect(isNullOrUndefined('string')).toBe(false);
    expect(isNullOrUndefined(true)).toBe(false);
});
