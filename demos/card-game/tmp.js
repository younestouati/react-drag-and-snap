import React from 'react';

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant$1 = invariant_1;
  var warning$1 = warning_1;
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant$1(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        warning$1(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning$1(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';









var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant_1(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning_1(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning_1(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction_1.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';





var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var standardChips = {
	'1': {
		color: '#dddddd',
		textColor: '#cccccc'
	},
	'2': {
		color: 'gold'
	},
	'5': {
		color: '#800000'
	},
	'10': {
		color: '#000099',
		textColor: '#00016C'
	},
	'20': {
		color: '#cccccc'
	},
	'25': {
		color: '#008000'
	},
	'50': {
		color: 'orange'
	},
	'100': {
		color: '#222222',
		textColor: '#000000'
	},
	'250': {
		color: 'pink'
	},
	'500': {
		color: 'purple'
	},
	'1000': {
		color: '#800020'
	},
	'2000': {
		color: 'lightblue'
	},
	'5000': {
		color: 'brown'
	}
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var defaultChipStackStyles = {
	border: '2px dashed lightgray',
	position: 'relative',
	borderRadius: '100%',
	boxSizing: 'border-box',
	fontSize: '12px'
};

var defaultChipStackItemStyles = {
	zIndex: 1,
	position: 'absolute',
	left: 0,
	top: 0,
	width: '100%',
	height: '100%'
};

var ChipStackContext = React.createContext({
	isInStack: false
});

var ChipStack = function (_React$Component) {
	inherits(ChipStack, _React$Component);

	function ChipStack() {
		classCallCheck(this, ChipStack);
		return possibleConstructorReturn(this, (ChipStack.__proto__ || Object.getPrototypeOf(ChipStack)).apply(this, arguments));
	}

	createClass(ChipStack, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    children = _props.children,
			    stackLayerOffset = _props.stackLayerOffset,
			    largeStackLayerOffset = _props.largeStackLayerOffset,
			    style = _props.style,
			    rawDiameter = _props.diameter;


			var chipCount = children ? children.length : 0;
			var diameter = isNaN(rawDiameter) ? rawDiameter : rawDiameter + 'px';
			var offset = chipCount > 5 ? largeStackLayerOffset : stackLayerOffset;

			return React.createElement(
				ChipStackContext.Provider,
				{
					value: {
						isInStack: true
					}
				},
				React.createElement(
					'div',
					{
						style: _extends({}, defaultChipStackStyles, style, {
							width: diameter,
							height: diameter
						})
					},
					React.Children.map(children, function (child, i) {
						var stackItemStyle = {
							'transform': 'translate(' + offset * i + 'px,' + offset * i + 'px)'
						};

						return React.createElement(
							'div',
							{
								style: _extends({}, defaultChipStackItemStyles, stackItemStyle)
							},
							child
						);
					})
				)
			);
		}
	}]);
	return ChipStack;
}(React.Component);

ChipStack.propTypes = {
	children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
	style: propTypes.object,
	stackLayerOffset: propTypes.number,
	stackLayerMaxOffset: propTypes.number,
	diameter: propTypes.number
};

ChipStack.defaultProps = {
	style: {},
	diameter: DEFAULT_CHIP_DIAMETER,
	stackLayerOffset: 2,
	largeStackLayerOffset: 1
};

var isNullOrUndefined = function isNullOrUndefined(val) {
  return typeof val === 'undefined' || val === null;
};

var getFirstDefinedValue = function getFirstDefinedValue() {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
    }

    var firstDefinedValue = void 0;

    values.some(function (value) {
        if (!isNullOrUndefined(value)) {
            firstDefinedValue = value;
            return true;
        }

        return false;
    });

    return firstDefinedValue;
};

var DEFAULT_CHIP_DIAMETER = 120;

var Chip = function Chip(_ref) {
	var value = _ref.value,
	    propDiameter = _ref.diameter,
	    shadow = _ref.shadow,
	    propColor = _ref.color,
	    propTextColor = _ref.textColor;

	var isStandardValue = standardChips.hasOwnProperty(value + '');
	var color = void 0,
	    textColor = void 0;

	if (isStandardValue) {
		var _standardChips = standardChips[value + ''],
		    standardColor = _standardChips.color,
		    standardTextColor = _standardChips.textColor;

		color = propColor || standardColor;
		textColor = standardTextColor && !(propColor || propTextColor) ? standardTextColor : propTextColor || color;
	} else {
		color = propColor || 'grey';
		textColor = propTextColor || color;
	}

	var textFilter = color === textColor ? 'url(#darken)' : 'none';

	var shadowStyle = typeof shadow === "boolean" ? shadow ? { boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.5), 0 0 3px 0 rgba(0, 0, 0, 0.4) inset' } : {} : { boxShadow: shadow };

	return React.createElement(
		ChipStackContext.Consumer,
		null,
		function (_ref2) {
			var isInStack = _ref2.isInStack;

			var diameter = !isInStack ? getFirstDefinedValue(propDiameter, DEFAULT_CHIP_DIAMETER) : '100%';

			return React.createElement(
				'svg',
				{
					viewBox: '0 0 200 200',
					style: _extends({
						borderRadius: '50%',
						width: isNaN(diameter) ? diameter : diameter + 'px',
						height: isNaN(diameter) ? diameter : diameter + 'px'
					}, shadowStyle),
					xmlns: 'http://www.w3.org/2000/svg'
				},
				React.createElement(
					'defs',
					null,
					React.createElement(
						'filter',
						{ id: 'darken' },
						React.createElement(
							'feComponentTransfer',
							null,
							React.createElement('feFuncR', { type: 'linear', slope: '1', intercept: '-.05' }),
							React.createElement('feFuncG', { type: 'linear', slope: '1', intercept: '-.05' }),
							React.createElement('feFuncB', { type: 'linear', slope: '1', intercept: '-.05' })
						)
					)
				),
				React.createElement('circle', {
					cx: '100',
					cy: '100',
					r: '100',
					style: { fill: color }
				}),
				React.createElement('circle', {
					cx: '100',
					cy: '100',
					r: '92',
					style: {
						fill: 'none',
						strokeDasharray: '25.8 70.4',
						strokeDashoffset: '12px',
						stroke: 'white',
						strokeWidth: '17px'
					}
				}),
				React.createElement('circle', {
					filter: textFilter,
					cx: '100',
					cy: '100',
					r: '70',
					style: {
						fill: 'none',
						stroke: textColor,
						strokeWidth: '3px'
					}
				}),
				React.createElement('circle', {
					cx: '100',
					cy: '100',
					r: '70',
					style: {
						fill: 'none',
						strokeDasharray: '18.6 18',
						strokeDashoffset: '9px',
						stroke: 'white',
						strokeWidth: '3px'
					}
				}),
				React.createElement(
					'text',
					{
						x: '100',
						y: '100',
						filter: textFilter,
						fill: textColor,
						textAnchor: 'middle',
						alignmentBaseline: 'central',
						style: {
							fontFamily: 'arial',
							fontSize: '60px',
							fontWeight: 'bold',
							textShadow: '-1px -1px 0px rgba(0, 0, 0, 0.3), 1px 1px 0px rgba(255, 255, 255, 0.2)'
						}
					},
					value
				)
			);
		}
	);
};

Chip.propTypes = {
	value: propTypes.number.isRequired,
	diameter: propTypes.number,
	color: propTypes.string,
	textColor: propTypes.string,
	shadow: propTypes.bool
};

Chip.defaultProps = {
	shadow: true
};

var tileId = 0;

var round = function round(number) {
    return Number(number.toFixed(3));
};

function rotatePoint(pivot, point, angle) {
    return [Math.cos(angle) * (point[0] - pivot[0]) + Math.sin(angle) * (point[1] - pivot[1]) + pivot[0], Math.cos(angle) * (point[1] - pivot[1]) - Math.sin(angle) * (point[0] - pivot[0]) + pivot[1]];
}

function getPoints(radius, borderWidth, n) {
    var vertices = [];
    var angleBorderWidth = borderWidth / Math.sin(Math.PI / 3);
    var deltaAngle = 2 * Math.PI / n;

    for (var i = 0; i < n; i++) {
        var angle = Math.PI / 2 + i * deltaAngle;
        vertices.push([radius + Math.cos(angle) * (radius - angleBorderWidth / 2), //half the stroke width seems to detract from the fill, there divide by 2 
        radius - Math.sin(angle) * (radius - angleBorderWidth / 2)]);
    }

    return vertices.map(function (p) {
        return p.map(round);
    });
}

function getFlatTopPoints(radius, offset, n) {
    return getPoints(radius, offset, n).map(function (p) {
        return rotatePoint([radius, radius], p, Math.PI / n);
    });
}

function NTile(props) {
    var backgroundImage = props.backgroundImage,
        bevel = props.bevel,
        radius = props.radius,
        flatTop = props.flatTop,
        borderWidth = props.borderWidth,
        borderColor = props.borderColor,
        backgroundColor = props.backgroundColor,
        children = props.children,
        shadow = props.shadow,
        n = props.n;

    var ownId = tileId++;
    var bgId = backgroundImage && 'bg-' + ownId;
    var polygonStyle = {
        fill: backgroundImage ? 'url(#' + bgId + ')' : backgroundColor,
        stroke: borderColor,
        strokeWidth: borderWidth
    };
    var points = flatTop ? getFlatTopPoints(radius, borderWidth, n) : getPoints(radius, borderWidth, n);
    var polygonPoints = points.map(function (point) {
        return point.join(',');
    }).join(' ');
    var bevelFilter = bevel ? 'url(#bevel)' : 'none';

    var shadowStyle = typeof shadow === "boolean" ? shadow ? { filter: 'drop-shadow(1px 1px 2px rgba(82,81,82,1))' } : {} : { shadow: shadow };

    var backgroundSize = {
        height: 2 * (flatTop ? radius / (Math.sqrt(3) / 2) : radius),
        width: 2 * (flatTop ? radius : radius / (Math.sqrt(3) / 2))
    };

    return React.createElement(
        'svg',
        {
            viewBox: '0 0 ' + radius * 2 + ' ' + radius * 2,
            style: _extends({
                width: radius * 2 + 'px',
                height: radius * 2 + 'px',
                position: 'relative'
            }, shadowStyle)
        },
        React.createElement(
            'defs',
            null,
            React.createElement(
                'filter',
                { id: 'bevel', filterUnits: 'objectBoundingBox', x: '-10%', y: '-10%', width: '150%', height: '150%' },
                React.createElement('feGaussianBlur', {
                    'in': 'SourceAlpha',
                    stdDeviation: '1.5',
                    result: 'blur'
                }),
                React.createElement(
                    'feSpecularLighting',
                    {
                        'in': 'blur',
                        surfaceScale: '5',
                        specularConstant: '0.5',
                        specularExponent: '30',
                        result: 'specOut',
                        lightingColor: 'lightgrey'
                    },
                    React.createElement('fePointLight', { x: '-5000', y: '-5000', z: '8000' })
                ),
                React.createElement('feComposite', {
                    'in': 'specOut',
                    in2: 'SourceAlpha',
                    operator: 'in',
                    result: 'specOut2'
                }),
                React.createElement('feComposite', {
                    'in': 'SourceGraphic',
                    in2: 'specOut2',
                    operator: 'arithmetic',
                    k1: '0',
                    k2: '1',
                    k3: '1',
                    k4: '0',
                    result: 'litPaint'
                })
            ),
            React.createElement(
                'clipPath',
                { id: 'tileClip' + ownId },
                React.createElement('polygon', { points: polygonPoints })
            ),
            React.createElement(
                'pattern',
                { id: bgId, width: backgroundSize.width, height: backgroundSize.height, patternUnits: 'userSpaceOnUse' },
                React.createElement('image', {
                    width: backgroundSize.width,
                    height: backgroundSize.height,
                    xlinkHref: backgroundImage,
                    preserveAspectRatio: 'xMidYMid slice'
                })
            )
        ),
        React.createElement('polygon', {
            style: polygonStyle,
            filter: bevelFilter,
            points: polygonPoints
        }),
        React.createElement(
            'foreignObject',
            { x: '0', y: '0', width: '100%', height: '100%', clipPath: 'url(#tileClip' + ownId + ')' },
            React.createElement(
                'div',
                {
                    style: {
                        width: 2 * radius + 'px',
                        height: 2 * radius + 'px',
                        position: 'relative',
                        WebkitClipPath: 'url(#tileClip' + ownId + ')',
                        clipPath: 'url(#tileClip' + ownId + ')'
                    }
                },
                children
            )
        )
    );
}

NTile.propTypes = {
    n: propTypes.number.isRequired,
    flatTop: propTypes.bool,
    shadow: propTypes.oneOfType([propTypes.bool, propTypes.string]),
    borderWidth: propTypes.number,
    borderColor: propTypes.string,
    backgroundColor: propTypes.string,
    backgroundImage: propTypes.string,
    children: propTypes.node,
    bevel: propTypes.bool
};

NTile.defaultProps = {
    flatTop: false,
    shadow: false,
    borderWidth: 0,
    borderColor: '#efefef',
    backgroundColor: 'white',
    bevel: false
};

var HexTile = function HexTile(props) {
    return React.createElement(NTile, _extends({ n: 6 }, props));
};

HexTile.propTypes = {
    flatTop: propTypes.bool,
    shadow: propTypes.oneOfType([propTypes.bool, propTypes.string]),
    borderWidth: propTypes.number,
    borderColor: propTypes.string,
    backgroundColor: propTypes.string,
    backgroundImage: propTypes.string,
    children: propTypes.node,
    bevel: propTypes.bool
};

var SquareTile = function SquareTile(props) {
    return React.createElement(NTile, _extends({ n: 4 }, props, { flatTop: true }));
};

SquareTile.propTypes = {
    shadow: propTypes.oneOfType([propTypes.bool, propTypes.string]),
    borderWidth: propTypes.number,
    borderColor: propTypes.string,
    backgroundColor: propTypes.string,
    backgroundImage: propTypes.string,
    children: propTypes.node,
    bevel: propTypes.bool
};

var isBoolean = function isBoolean(val) {
  return typeof val === 'boolean';
};

var containerStyles = {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    perspective: '1000px'
};

var frontStyles = {
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    zIndex: 2,
    transform: 'rotateY(0deg)', //for firefox 31
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
};

var backStyles = {
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
};

var Flipper = function Flipper(_ref) {
    var animateRotation = _ref.animateRotation,
        isFlipped = _ref.isFlipped,
        rotation = _ref.rotation,
        children = _ref.children;
    return React.createElement(
        'div',
        { style: _extends({}, containerStyles) },
        React.createElement(
            'div',
            {
                style: {
                    transition: animateRotation ? isBoolean(animateRotation) ? '0.4s' : animateRotation + 's' : 'none',
                    transform: 'rotateY(' + ((isFlipped ? 180 : 0) + rotation) + 'deg',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }
            },
            React.createElement(
                'div',
                { style: frontStyles },
                children[0]
            ),
            React.createElement(
                'div',
                { style: backStyles },
                children[1]
            )
        )
    );
};

Flipper.propTypes = {
    isFlipped: propTypes.bool,
    rotation: propTypes.number,
    animateRotation: propTypes.oneOfType([propTypes.bool, propTypes.number]),
    children: propTypes.node.isRequired
};

Flipper.defaultProps = {
    isFlipped: false,
    rotation: 0,
    animateRotation: true
};

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var isObject = function isObject(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
};

var defaultStackStyles = {
	position: 'relative'
};

var defaultStackItemStyles = {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: '100%',
	height: '100%'
};

var defaultRandomNumbers = [0.5, 0.14, 0.77, 0.08, 0.40, 0.27, 0.73, 0.33, 0.02, 0.58, 0.91];
var defaultMessy = false;
var defaultMessAngle = 15;
var defaultStackLayerOffset = 1;
var defaultStackLayerMaxOffset = 10;

var CardStackContext = React.createContext({
	isInStack: false
});

function getTransformForCardInCardStack(props, cardIndex) {
	var _props$randomNumbers = props.randomNumbers,
	    randomNumbers = _props$randomNumbers === undefined ? defaultRandomNumbers : _props$randomNumbers,
	    _props$messAngle = props.messAngle,
	    messAngle = _props$messAngle === undefined ? defaultMessAngle : _props$messAngle,
	    _props$messy = props.messy,
	    messy = _props$messy === undefined ? defaultMessy : _props$messy,
	    _props$stackLayerOffs = props.stackLayerOffset,
	    stackLayerOffset = _props$stackLayerOffs === undefined ? defaultStackLayerOffset : _props$stackLayerOffs,
	    _props$stackLayerMaxO = props.stackLayerMaxOffset,
	    stackLayerMaxOffset = _props$stackLayerMaxO === undefined ? defaultStackLayerMaxOffset : _props$stackLayerMaxO;


	return messy ? {
		x: 0,
		y: 0,
		rotate: randomNumbers[cardIndex % randomNumbers.length] * messAngle - messAngle / 2
	} : {
		x: Math.min(cardIndex * stackLayerOffset, stackLayerMaxOffset),
		y: Math.min(cardIndex * stackLayerOffset, stackLayerMaxOffset),
		rotate: 0
	};
}

var CardStack = function (_React$Component) {
	inherits(CardStack, _React$Component);

	function CardStack() {
		classCallCheck(this, CardStack);
		return possibleConstructorReturn(this, (CardStack.__proto__ || Object.getPrototypeOf(CardStack)).apply(this, arguments));
	}

	createClass(CardStack, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    children = _props.children,
			    background = _props.background,
			    style = _props.style,
			    rawWidth = _props.width,
			    rawHeight = _props.height,
			    faceUp = _props.faceUp,
			    rotateY = _props.rotateY,
			    shadow = _props.shadow,
			    border = _props.border,
			    borderRadius = _props.borderRadius,
			    stackBorder = _props.stackBorder,
			    animateRotation = _props.animateRotation,
			    animateShadow = _props.animateShadow;


			var isHeightSet = !isNullOrUndefined(this.props.height) && this.props.height !== 0;
			var width = isNaN(this.props.width) ? this.props.width : this.props.width + 'px';
			var height = void 0,
			    paddingTop = 0;

			if (isHeightSet) {
				height = this.props.height;
			} else {
				paddingTop = 100 / this.props.aspectRatio + '%';
			}

			var stackBorderStyles = { border: stackBorder };
			var borderRadiusStyles = { borderRadius: borderRadius };

			if (isBoolean(stackBorder)) {
				stackBorderStyles = stackBorder ? { border: '2px dashed lightgray' } : '';
			} else if (isNumeric(stackBorder)) {
				stackBorderStyles = { border: stackBorder + 'px dashed lightgray' };
			}

			if (isBoolean(borderRadius)) {
				borderRadiusStyles = borderRadius ? { borderRadius: '6px' } : {};
			} else if (isNumeric(borderRadius)) {
				borderRadiusStyles = { borderRadius: borderRadius + 'px' };
			}

			var backgroundElement = void 0;
			if (background) {
				backgroundElement = isObject(background) ? background : React.createElement('div', { style: { background: 'url(' + background } });
			}

			return React.createElement(
				CardStackContext.Provider,
				{
					value: {
						isInStack: true,
						faceUp: faceUp,
						rotateY: rotateY,
						shadow: shadow,
						border: border,
						borderRadius: borderRadius,
						animateRotation: animateRotation,
						animateShadow: animateShadow
					}
				},
				React.createElement(
					'div',
					{
						style: _extends({}, defaultStackStyles, style, {
							width: width,
							height: height,
							position: 'relative',
							display: 'inline-block'
						})
					},
					React.createElement('div', {
						style: {
							float: 'left',
							paddingTop: paddingTop
						}
					}),
					React.createElement(
						'div',
						{
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0
							}
						},
						React.createElement('div', {
							style: _extends({}, defaultStackItemStyles, stackBorderStyles, borderRadiusStyles, {
								boxSizing: 'border-box'
							})
						}),
						backgroundElement,
						React.Children.map(children, function (child, i) {
							var _getTransformForCardI = getTransformForCardInCardStack(_this2.props, i),
							    x = _getTransformForCardI.x,
							    y = _getTransformForCardI.y,
							    rotate = _getTransformForCardI.rotate;

							return React.createElement(
								'div',
								{
									style: _extends({}, defaultStackItemStyles, {
										transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + rotate + 'deg)'
									})
								},
								child
							);
						})
					)
				)
			);
		}
	}]);
	return CardStack;
}(React.Component);

CardStack.propTypes = {
	children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
	background: propTypes.oneOfType([propTypes.string, propTypes.node]),
	style: propTypes.object,
	messy: propTypes.bool,
	messAngle: propTypes.number,
	stackLayerOffset: propTypes.number,
	stackLayerMaxOffset: propTypes.number,
	width: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
	height: propTypes.oneOfType([propTypes.number, propTypes.string]),
	aspectRatio: propTypes.number,
	faceUp: propTypes.bool,
	rotateY: propTypes.number,
	shadow: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	border: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	borderRadius: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	animateRotation: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	animateShadow: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	randomNumbers: propTypes.arrayOf(propTypes.number),
	stackBorder: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number])
};

CardStack.defaultProps = {
	style: {},
	messy: defaultMessy,
	messAngle: defaultMessAngle,
	stackLayerOffset: defaultStackLayerOffset,
	stackLayerMaxOffset: defaultStackLayerMaxOffset,
	randomNumbers: defaultRandomNumbers,
	width: DEFAULT_CARD_WIDTH,
	aspectRatio: 0.7,
	stackBorder: true,
	borderRadius: 6
};

var DEFAULT_CARD_WIDTH = 210;
var DEFAULT_CARD_HEIGHT = 300;

var baseStyles = {
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	display: 'inline-block',
	boxSizing: 'border-box',
	position: 'absolute',
	overflow: 'hidden',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'white'
};

var renderSide = function renderSide(side, style) {
	return isObject(side) ? React.createElement(
		'div',
		{ style: style },
		side
	) : React.createElement('div', { style: _extends({}, style, { backgroundImage: 'url(' + side + ')' }) });
};

var getStyle = function getStyle(props, stackContext) {
	var shadow = getFirstDefinedValue(props.shadow, stackContext.shadow, true);
	var animateShadow = getFirstDefinedValue(props.animateShadow, stackContext.animateShadow, true);
	var border = getFirstDefinedValue(props.border, stackContext.border, true);
	var borderRadius = getFirstDefinedValue(props.borderRadius, stackContext.borderRadius, true);

	var shadowStyle = { boxShadow: shadow };
	var borderStyle = { border: border };
	var borderRadiusStyle = { borderRadius: borderRadius };

	if (isBoolean(shadow)) {
		shadowStyle = shadow ? { boxShadow: '1px 1px 2px 0px rgba(82,81,82,1)' } : {};
	} else if (isNumeric(shadow)) {
		shadowStyle = { boxShadow: shadow + 'px ' + shadow + 'px ' + shadow + 'px 0px rgba(82,81,82,1)' };
	}

	if (isBoolean(animateShadow)) {
		shadowStyle.transition = animateShadow ? '0.4s box-shadow' : '';
	} else if (isNumeric(animateShadow)) {
		shadowStyle.transition = animateShadow + 's box-shadow';
	}

	if (isBoolean(border)) {
		borderStyle = border ? { border: '1px solid #efefef' } : {};
	} else if (isNumeric(border)) {
		borderStyle = { border: border + 'px solid #efefef' };
	}

	if (isBoolean(borderRadius)) {
		borderRadiusStyle = borderRadius ? { borderRadius: '6px' } : {};
	} else if (isNumeric(borderRadius)) {
		borderRadiusStyle = { borderRadius: borderRadius + 'px' };
	}

	return _extends({}, shadowStyle, borderStyle, borderRadiusStyle, baseStyles);
};

var Card = function Card(props) {
	var frontStyle = props.frontStyle,
	    backStyle = props.backStyle,
	    borderRadius = props.borderRadius,
	    front = props.front,
	    back = props.back;


	return React.createElement(
		CardStackContext.Consumer,
		null,
		function (stackContext) {
			var styles = getStyle(props, stackContext);

			var defaultWidth = stackContext.isInStack ? '100%' : DEFAULT_CARD_WIDTH;
			var defaultHeight = stackContext.isInStack ? '100%' : DEFAULT_CARD_HEIGHT;

			var isWidthSet = !isNullOrUndefined(props.width);
			var isHeightSet = !isNullOrUndefined(props.height) && props.height !== 0;
			var isAspectRatioSet = !isNullOrUndefined(props.aspectRatio);

			var width = isWidthSet ? props.width : defaultWidth;
			var height = void 0,
			    paddingTop = 0;

			if (isHeightSet || isWidthSet && isAspectRatioSet) {
				if (isHeightSet) {
					height = props.height;
				} else {
					paddingTop = 100 / props.aspectRatio + '%';
				}
			} else {
				height = defaultHeight;
			}

			return React.createElement(
				'div',
				{
					style: {
						width: isNaN(width) ? width : width + 'px',
						height: isNaN(height) ? height : height + 'px',
						position: 'relative',
						display: 'inline-block'
					}
				},
				React.createElement('div', {
					style: {
						float: 'left',
						paddingTop: paddingTop
					}
				}),
				React.createElement(
					'div',
					{
						style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
					},
					React.createElement(
						Flipper,
						{
							isFlipped: !getFirstDefinedValue(props.faceUp, stackContext.faceUp, false),
							rotation: getFirstDefinedValue(props.rotateY, stackContext.rotateY, 0),
							animateRotation: getFirstDefinedValue(props.animateRotation, stackContext.animateRotation, true)
						},
						renderSide(front, _extends({}, styles, frontStyle)),
						renderSide(back, _extends({}, styles, backStyle))
					)
				)
			);
		}
	);
};

Card.propTypes = {
	front: propTypes.oneOfType([propTypes.string, propTypes.node]),
	back: propTypes.oneOfType([propTypes.string, propTypes.node]),
	faceUp: propTypes.bool,
	rotateY: propTypes.number,
	shadow: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	border: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	borderRadius: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	animateRotation: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	animateShadow: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	width: propTypes.number,
	height: propTypes.number,
	aspectRatio: propTypes.number,
	frontStyle: propTypes.object,
	backStyle: propTypes.object
};

Card.defaultProps = {
	frontStyle: {},
	backStyle: {}
};

var handleMissingProp = function handleMissingProp(isRequired, propName, componentName) {
	if (isRequired) {
		return new Error('Missing required property ' + propName + ' in ' + componentName);
	}

	return null;
};

var createCaseInsentivePropType = function createCaseInsentivePropType(validValues, isRequired) {
	return function (props, propName, componentName) {
		var prop = props[propName];
		var type = typeof prop === 'undefined' ? 'undefined' : _typeof(prop);
		var caseInsensitiveProp = type === 'string' ? prop.toLowerCase() : prop;

		if (type === 'undefined') {
			return handleMissingProp(isRequired, propName, componentName);
		}

		var isValid = validValues.indexOf(caseInsensitiveProp) > -1;

		if (!isValid) {
			return new Error(propName + ' in ' + componentName + ' must be one of the Values: ' + validValues.join(', '));
		}

		return null;
	};
};

var validRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 'king', 'queen', 'jack', 'ace', 'joker'];
var validSuits = ['hearts', 'spades', 'clubs', 'diamonds'];

var rank = createCaseInsentivePropType(validRanks, false);
rank.isRequired = createCaseInsentivePropType(validRanks, true);

var suit = createCaseInsentivePropType(validSuits, false);
suit.isRequired = createCaseInsentivePropType(validSuits, true);

var defaultCardKey = function defaultCardKey(suit$$1, rank$$1, isJoker) {
    var r = typeof rank$$1 === 'string' ? rank$$1.toLowerCase() : rank$$1;
    r = r === 'ace' ? 1 : r;
    r = r === 'jack' ? 11 : r;
    r = r === 'queen' ? 12 : r;
    r = r === 'king' ? 13 : r;

    return isJoker ? 'joker' : r + suit$$1.charAt(0);
};

var DefaultBack = function DefaultBack() {
    return React.createElement('div', {
        style: {
            background: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzliYTdiNCI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI2RlZiI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik0wIDQwIEE0MCA0MCA0NSAwIDAgNDAgMCBBNDAgNDAgMzE1IDAgMCA4MCA0MCBBNDAgNDAgNDUgMCAwIDQwIDgwIEE0MCA0MCAyNzAgMCAwIDAgNDBaIiBmaWxsPSIjOWJhN2I0Ij48L3BhdGg+Cjwvc3ZnPg=="), padding-box linear-gradient(0deg,#ffffff, #ffffff), white',
            backgroundSize: '4%',
            backgroundRepeat: 'repeat',
            backgroundClip: 'content-box, padding-box',
            padding: '5%',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
        }
    });
};

function getFront(standardCards, key) {
    return React.createElement('div', {
        style: {
            background: 'url("data:image/svg+xml;base64,' + standardCards[key] + '")',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            backgroundSize: '100% 100%'
        }
    });
}

var makeStandardDeck = function makeStandardDeck(standardCards) {
    var back = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : React.createElement(DefaultBack, null);
    var frontStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var getCardKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultCardKey;

    var standardCard = function standardCard(props) {
        return React.createElement(Card, _extends({}, props, {
            front: getFront(standardCards, getCardKey(props.suit, props.rank, props.isJoker)),
            back: props.back || back,
            frontStyle: _extends({}, frontStyle, props.frontStyle)
        }));
    };

    standardCard.propTypes = {
        rank: rank.isRequired,
        suit: suit.isRequired,
        isJoker: propTypes.bool
    };

    standardCard.defaultProps = {
        rank: 1,
        suit: 'hearts',
        isJoker: false
    };

    return standardCard;
};

export { Chip, ChipStack, HexTile, SquareTile, Card, CardStack, getTransformForCardInCardStack, makeStandardDeck };
//# sourceMappingURL=react-board-game-components.esm.js.map
