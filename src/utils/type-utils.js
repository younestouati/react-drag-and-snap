const isBoolean = val => typeof val === 'boolean';
const isFunction = val => typeof val === 'function';
const isArray = val => Array.isArray(val);
const isObject = val => val !== null && typeof val === 'object' && !isArray(val);
const isNumber = val => typeof val === 'number';
const isString = val => typeof val === 'string';
const isNullOrUndefined = val => typeof val === 'undefined' || val === null;

export { isBoolean, isFunction, isObject, isNumber, isString, isArray, isNullOrUndefined };
