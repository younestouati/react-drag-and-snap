import React from 'react';
import ReactDOM from 'react-dom';

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



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
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

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
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

  return _extends$1.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var bugfixes = undefined;
var applyAnimatedValues = undefined;
var colorNames = [];
var requestFrame = function requestFrame(cb) {
  return global$1.requestAnimationFrame(cb);
};
var cancelFrame = function cancelFrame(cb) {
  return global$1.cancelAnimationFrame(cb);
};
var interpolation = undefined;
var now = function now() {
  return Date.now();
};
var injectApplyAnimatedValues = function injectApplyAnimatedValues(fn, transform) {
  return applyAnimatedValues = {
    fn: fn,
    transform: transform
  };
};
var injectColorNames = function injectColorNames(names) {
  return colorNames = names;
};
var injectBugfixes = function injectBugfixes(fn) {
  return bugfixes = fn;
};
var injectInterpolation = function injectInterpolation(cls) {
  return interpolation = cls;
};
var injectFrame = function injectFrame(raf, caf) {
  var _ref;

  return _ref = [raf, caf], requestFrame = _ref[0], cancelFrame = _ref[1], _ref;
};
var injectNow = function injectNow(nowFn) {
  return now = nowFn;
};

var Globals = /*#__PURE__*/Object.freeze({
  get bugfixes () { return bugfixes; },
  get applyAnimatedValues () { return applyAnimatedValues; },
  get colorNames () { return colorNames; },
  get requestFrame () { return requestFrame; },
  get cancelFrame () { return cancelFrame; },
  get interpolation () { return interpolation; },
  get now () { return now; },
  injectApplyAnimatedValues: injectApplyAnimatedValues,
  injectColorNames: injectColorNames,
  injectBugfixes: injectBugfixes,
  injectInterpolation: injectInterpolation,
  injectFrame: injectFrame,
  injectNow: injectNow
});

var colors = {
  transparent: 0x00000000,
  // http://www.w3.org/TR/css3-color/#svg-color
  aliceblue: 0xf0f8ffff,
  antiquewhite: 0xfaebd7ff,
  aqua: 0x00ffffff,
  aquamarine: 0x7fffd4ff,
  azure: 0xf0ffffff,
  beige: 0xf5f5dcff,
  bisque: 0xffe4c4ff,
  black: 0x000000ff,
  blanchedalmond: 0xffebcdff,
  blue: 0x0000ffff,
  blueviolet: 0x8a2be2ff,
  brown: 0xa52a2aff,
  burlywood: 0xdeb887ff,
  burntsienna: 0xea7e5dff,
  cadetblue: 0x5f9ea0ff,
  chartreuse: 0x7fff00ff,
  chocolate: 0xd2691eff,
  coral: 0xff7f50ff,
  cornflowerblue: 0x6495edff,
  cornsilk: 0xfff8dcff,
  crimson: 0xdc143cff,
  cyan: 0x00ffffff,
  darkblue: 0x00008bff,
  darkcyan: 0x008b8bff,
  darkgoldenrod: 0xb8860bff,
  darkgray: 0xa9a9a9ff,
  darkgreen: 0x006400ff,
  darkgrey: 0xa9a9a9ff,
  darkkhaki: 0xbdb76bff,
  darkmagenta: 0x8b008bff,
  darkolivegreen: 0x556b2fff,
  darkorange: 0xff8c00ff,
  darkorchid: 0x9932ccff,
  darkred: 0x8b0000ff,
  darksalmon: 0xe9967aff,
  darkseagreen: 0x8fbc8fff,
  darkslateblue: 0x483d8bff,
  darkslategray: 0x2f4f4fff,
  darkslategrey: 0x2f4f4fff,
  darkturquoise: 0x00ced1ff,
  darkviolet: 0x9400d3ff,
  deeppink: 0xff1493ff,
  deepskyblue: 0x00bfffff,
  dimgray: 0x696969ff,
  dimgrey: 0x696969ff,
  dodgerblue: 0x1e90ffff,
  firebrick: 0xb22222ff,
  floralwhite: 0xfffaf0ff,
  forestgreen: 0x228b22ff,
  fuchsia: 0xff00ffff,
  gainsboro: 0xdcdcdcff,
  ghostwhite: 0xf8f8ffff,
  gold: 0xffd700ff,
  goldenrod: 0xdaa520ff,
  gray: 0x808080ff,
  green: 0x008000ff,
  greenyellow: 0xadff2fff,
  grey: 0x808080ff,
  honeydew: 0xf0fff0ff,
  hotpink: 0xff69b4ff,
  indianred: 0xcd5c5cff,
  indigo: 0x4b0082ff,
  ivory: 0xfffff0ff,
  khaki: 0xf0e68cff,
  lavender: 0xe6e6faff,
  lavenderblush: 0xfff0f5ff,
  lawngreen: 0x7cfc00ff,
  lemonchiffon: 0xfffacdff,
  lightblue: 0xadd8e6ff,
  lightcoral: 0xf08080ff,
  lightcyan: 0xe0ffffff,
  lightgoldenrodyellow: 0xfafad2ff,
  lightgray: 0xd3d3d3ff,
  lightgreen: 0x90ee90ff,
  lightgrey: 0xd3d3d3ff,
  lightpink: 0xffb6c1ff,
  lightsalmon: 0xffa07aff,
  lightseagreen: 0x20b2aaff,
  lightskyblue: 0x87cefaff,
  lightslategray: 0x778899ff,
  lightslategrey: 0x778899ff,
  lightsteelblue: 0xb0c4deff,
  lightyellow: 0xffffe0ff,
  lime: 0x00ff00ff,
  limegreen: 0x32cd32ff,
  linen: 0xfaf0e6ff,
  magenta: 0xff00ffff,
  maroon: 0x800000ff,
  mediumaquamarine: 0x66cdaaff,
  mediumblue: 0x0000cdff,
  mediumorchid: 0xba55d3ff,
  mediumpurple: 0x9370dbff,
  mediumseagreen: 0x3cb371ff,
  mediumslateblue: 0x7b68eeff,
  mediumspringgreen: 0x00fa9aff,
  mediumturquoise: 0x48d1ccff,
  mediumvioletred: 0xc71585ff,
  midnightblue: 0x191970ff,
  mintcream: 0xf5fffaff,
  mistyrose: 0xffe4e1ff,
  moccasin: 0xffe4b5ff,
  navajowhite: 0xffdeadff,
  navy: 0x000080ff,
  oldlace: 0xfdf5e6ff,
  olive: 0x808000ff,
  olivedrab: 0x6b8e23ff,
  orange: 0xffa500ff,
  orangered: 0xff4500ff,
  orchid: 0xda70d6ff,
  palegoldenrod: 0xeee8aaff,
  palegreen: 0x98fb98ff,
  paleturquoise: 0xafeeeeff,
  palevioletred: 0xdb7093ff,
  papayawhip: 0xffefd5ff,
  peachpuff: 0xffdab9ff,
  peru: 0xcd853fff,
  pink: 0xffc0cbff,
  plum: 0xdda0ddff,
  powderblue: 0xb0e0e6ff,
  purple: 0x800080ff,
  rebeccapurple: 0x663399ff,
  red: 0xff0000ff,
  rosybrown: 0xbc8f8fff,
  royalblue: 0x4169e1ff,
  saddlebrown: 0x8b4513ff,
  salmon: 0xfa8072ff,
  sandybrown: 0xf4a460ff,
  seagreen: 0x2e8b57ff,
  seashell: 0xfff5eeff,
  sienna: 0xa0522dff,
  silver: 0xc0c0c0ff,
  skyblue: 0x87ceebff,
  slateblue: 0x6a5acdff,
  slategray: 0x708090ff,
  slategrey: 0x708090ff,
  snow: 0xfffafaff,
  springgreen: 0x00ff7fff,
  steelblue: 0x4682b4ff,
  tan: 0xd2b48cff,
  teal: 0x008080ff,
  thistle: 0xd8bfd8ff,
  tomato: 0xff6347ff,
  turquoise: 0x40e0d0ff,
  violet: 0xee82eeff,
  wheat: 0xf5deb3ff,
  white: 0xffffffff,
  whitesmoke: 0xf5f5f5ff,
  yellow: 0xffff00ff,
  yellowgreen: 0x9acd32ff
};

var linear = function linear(t) {
  return t;
};

var Interpolation =
/*#__PURE__*/
function () {
  function Interpolation() {}

  Interpolation.create = function create(config$$1) {
    if (typeof config$$1 === 'function') return config$$1;
    if (interpolation && config$$1.output && typeof config$$1.output[0] === 'string') return interpolation(config$$1);
    var outputRange = config$$1.output;
    var inputRange = config$$1.range;
    var easing = config$$1.easing || linear;
    var extrapolateLeft = 'extend';
    var map = config$$1.map;

    if (config$$1.extrapolateLeft !== undefined) {
      extrapolateLeft = config$$1.extrapolateLeft;
    } else if (config$$1.extrapolate !== undefined) {
      extrapolateLeft = config$$1.extrapolate;
    }

    var extrapolateRight = 'extend';

    if (config$$1.extrapolateRight !== undefined) {
      extrapolateRight = config$$1.extrapolateRight;
    } else if (config$$1.extrapolate !== undefined) {
      extrapolateRight = config$$1.extrapolate;
    }

    return function (input) {
      var range = findRange(input, inputRange);
      return interpolate(input, inputRange[range], inputRange[range + 1], outputRange[range], outputRange[range + 1], easing, extrapolateLeft, extrapolateRight, map);
    };
  };

  return Interpolation;
}();

function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
  var result = map ? map(input) : input; // Extrapolate

  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result;
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin;
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result;
    } else if (extrapolateRight === 'clamp') {
      result = inputMax;
    }
  }

  if (outputMin === outputMax) return outputMin;

  if (inputMin === inputMax) {
    if (input <= inputMin) return outputMin;
    return outputMax;
  } // Input Range


  if (inputMin === -Infinity) {
    result = -result;
  } else if (inputMax === Infinity) {
    result = result - inputMin;
  } else {
    result = (result - inputMin) / (inputMax - inputMin);
  } // Easing


  result = easing(result); // Output Range

  if (outputMin === -Infinity) {
    result = -result;
  } else if (outputMax === Infinity) {
    result = result + outputMin;
  } else {
    result = result * (outputMax - outputMin) + outputMin;
  }

  return result;
}

function findRange(input, inputRange) {
  for (var i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) break;
  }

  return i - 1;
}

// const INTEGER = '[-+]?\\d+';
var NUMBER = '[-+]?\\d*\\.?\\d+';
var PERCENTAGE = NUMBER + '%';

function call() {
  return '\\(\\s*(' + Array.prototype.slice.call(arguments).join(')\\s*,\\s*(') + ')\\s*\\)';
}

var rgb = new RegExp('rgb' + call(NUMBER, NUMBER, NUMBER));
var rgba = new RegExp('rgba' + call(NUMBER, NUMBER, NUMBER, NUMBER));
var hsl = new RegExp('hsl' + call(NUMBER, PERCENTAGE, PERCENTAGE));
var hsla = new RegExp('hsla' + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
var hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex6 = /^#([0-9a-fA-F]{6})$/;
var hex8 = /^#([0-9a-fA-F]{8})$/;

/*
https://github.com/react-community/normalize-css-color

BSD 3-Clause License

Copyright (c) 2016, React Community
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function normalizeColor(color) {
  var match;

  if (typeof color === 'number') {
    return color >>> 0 === color && color >= 0 && color <= 0xffffffff ? color : null;
  } // Ordered based on occurrences on Facebook codebase


  if (match = hex6.exec(color)) return parseInt(match[1] + 'ff', 16) >>> 0;
  if (colors.hasOwnProperty(color)) return colors[color];

  if (match = rgb.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    0x000000ff) >>> // a
    0;
  }

  if (match = rgba.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    parse1(match[4])) >>> // a
    0;
  }

  if (match = hex3.exec(color)) {
    return parseInt(match[1] + match[1] + // r
    match[2] + match[2] + // g
    match[3] + match[3] + // b
    'ff', // a
    16) >>> 0;
  } // https://drafts.csswg.org/css-color-4/#hex-notation


  if (match = hex8.exec(color)) return parseInt(match[1], 16) >>> 0;

  if (match = hex4.exec(color)) {
    return parseInt(match[1] + match[1] + // r
    match[2] + match[2] + // g
    match[3] + match[3] + // b
    match[4] + match[4], // a
    16) >>> 0;
  }

  if (match = hsl.exec(color)) {
    return (hslToRgb(parse360(match[1]), // h
    parsePercentage(match[2]), // s
    parsePercentage(match[3]) // l
    ) | 0x000000ff) >>> // a
    0;
  }

  if (match = hsla.exec(color)) {
    return (hslToRgb(parse360(match[1]), // h
    parsePercentage(match[2]), // s
    parsePercentage(match[3]) // l
    ) | parse1(match[4])) >>> // a
    0;
  }

  return null;
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  var r = hue2rgb(p, q, h + 1 / 3);
  var g = hue2rgb(p, q, h);
  var b = hue2rgb(p, q, h - 1 / 3);
  return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
}

function parse255(str) {
  var int = parseInt(str, 10);
  if (int < 0) return 0;
  if (int > 255) return 255;
  return int;
}

function parse360(str) {
  var int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}

function parse1(str) {
  var num = parseFloat(str);
  if (num < 0) return 0;
  if (num > 1) return 255;
  return Math.round(num * 255);
}

function parsePercentage(str) {
  // parseFloat conveniently ignores the final %
  var int = parseFloat(str);
  if (int < 0) return 0;
  if (int > 100) return 1;
  return int / 100;
}

function colorToRgba(input) {
  var int32Color = normalizeColor(input);
  if (int32Color === null) return input;
  int32Color = int32Color || 0;
  var r = (int32Color & 0xff000000) >>> 24;
  var g = (int32Color & 0x00ff0000) >>> 16;
  var b = (int32Color & 0x0000ff00) >>> 8;
  var a = (int32Color & 0x000000ff) / 255;
  return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
} // Problem: https://github.com/animatedjs/animated/pull/102
// Solution: https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly/658662


var stringShapeRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *   rgba(123, 42, 99, 0.36)           // colors
 *   -45deg                            // values with units
 */

function createInterpolation(config$$1) {
  var outputRange = config$$1.output.map(colorToRgba); // ->
  // [
  //   [0, 50],
  //   [100, 150],
  //   [200, 250],
  //   [0, 0.5],
  // ]

  var outputRanges = outputRange[0].match(stringShapeRegex).map(function () {
    return [];
  });
  outputRange.forEach(function (value) {
    value.match(stringShapeRegex).forEach(function (number, i) {
      return outputRanges[i].push(+number);
    });
  });
  var interpolations = outputRange[0].match(stringShapeRegex).map(function (value, i) {
    return Interpolation.create(_extends({}, config$$1, {
      output: outputRanges[i]
    }));
  });
  var shouldRound = /^rgb/.test(outputRange[0]);
  return function (input) {
    var i = 0;
    return outputRange[0].replace(stringShapeRegex, function () {
      var val = interpolations[i++](input);
      return String(shouldRound && i < 4 ? Math.round(val) : val);
    });
  };
}

var Animated =
/*#__PURE__*/
function () {
  function Animated() {}

  var _proto = Animated.prototype;

  _proto.__attach = function __attach() {};

  _proto.__detach = function __detach() {};

  _proto.__getValue = function __getValue() {};

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    return this.__getValue();
  };

  _proto.__addChild = function __addChild(child) {};

  _proto.__removeChild = function __removeChild(child) {};

  _proto.__getChildren = function __getChildren() {
    return [];
  };

  return Animated;
}();

var AnimatedTracking =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedTracking, _Animated);

  function AnimatedTracking(value, parent, animationClass, animationConfig, callback) {
    var _this;

    _this = _Animated.call(this) || this;
    _this.update = throttle(function () {
      _this._value.animate(new _this._animationClass(_extends({}, _this._animationConfig, {
        to: _this._animationConfig.to.__getValue()
      })), _this._callback);
    }, 1000 / 30);
    _this._value = value;
    _this._parent = parent;
    _this._animationClass = animationClass;
    _this._animationConfig = animationConfig;
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedTracking.prototype;

  _proto.__getValue = function __getValue() {
    return this._parent.__getValue();
  };

  _proto.__attach = function __attach() {
    this._parent.__addChild(this);
  };

  _proto.__detach = function __detach() {
    this._parent.__removeChild(this);
  };

  return AnimatedTracking;
}(Animated);

function throttle(func, wait) {
  var timeout = null;
  var previous = 0;

  var later = function later() {
    return func(previous = Date.now(), timeout = null);
  };

  return function () {
    var now = Date.now();
    var remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) void (clearTimeout(timeout), timeout = null);
      func(previous = now);
    } else if (!timeout) timeout = setTimeout(later, remaining);
  };
}

var AnimatedWithChildren =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedWithChildren, _Animated);

  function AnimatedWithChildren() {
    var _this;

    _this = _Animated.call(this) || this;
    _this._children = [];
    return _this;
  }

  var _proto = AnimatedWithChildren.prototype;

  _proto.__addChild = function __addChild(child) {
    if (this._children.length === 0) this.__attach();

    this._children.push(child);
  };

  _proto.__removeChild = function __removeChild(child) {
    var index = this._children.indexOf(child);

    if (index === -1) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Trying to remove a child that doesn't exist");
      }

      return;
    }

    this._children.splice(index, 1);

    if (this._children.length === 0) this.__detach();
  };

  _proto.__getChildren = function __getChildren() {
    return this._children;
  };

  return AnimatedWithChildren;
}(Animated);

var AnimatedInterpolation =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedInterpolation, _AnimatedWithChildren);

  function AnimatedInterpolation(parents, config$$1) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    _this._parents = Array.isArray(parents) ? parents : [parents];
    _this._interpolation = Interpolation.create(config$$1);
    return _this;
  }

  var _proto = AnimatedInterpolation.prototype;

  _proto.__getValue = function __getValue() {
    return this._interpolation.apply(this, this._parents.map(function (value) {
      return value.__getValue();
    }));
  };

  _proto.__attach = function __attach() {
    for (var i = 0; i < this._parents.length; ++i) {
      if (this._parents[i] instanceof Animated) this._parents[i].__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var i = 0; i < this._parents.length; ++i) {
      if (this._parents[i] instanceof Animated) this._parents[i].__removeChild(this);
    }
  };

  _proto.__update = function __update(config$$1) {
    this._interpolation = Interpolation.create(config$$1);
    return this;
  };

  _proto.interpolate = function interpolate(config$$1) {
    return new AnimatedInterpolation(this, config$$1);
  };

  return AnimatedInterpolation;
}(AnimatedWithChildren);
var _uniqueId = 0;
/**
 * Animated works by building a directed acyclic graph of dependencies
 * transparently when you render your Animated components.
 *
 *               new Animated.Value(0)
 *     .interpolate()        .interpolate()    new Animated.Value(1)
 *         opacity               translateY      scale
 *          style                         transform
 *         View#234                         style
 *                                         View#123
 *
 * A) Top Down phase
 * When an Animated.Value is updated, we recursively go down through this
 * graph in order to find leaf nodes: the views that we flag as needing
 * an update.
 *
 * B) Bottom Up phase
 * When a view is flagged as needing an update, we recursively go back up
 * in order to build the new value that it needs. The reason why we need
 * this two-phases process is to deal with composite props such as
 * transform which can receive values from multiple parents.
 */

function findAnimatedStyles(node, styles) {
  if (typeof node.update === 'function') styles.add(node);else node.__getChildren().forEach(function (child) {
    return findAnimatedStyles(child, styles);
  });
}
/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 */


var AnimatedValue =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedValue, _AnimatedWithChildren);

  function AnimatedValue(_value) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;

    _this._updateValue = function (value) {
      _this._value = value;

      _this._flush();

      for (var key in _this._listeners) {
        _this._listeners[key]({
          value: value
        });
      }
    };

    _this._value = _value;
    _this._animation = null;
    _this._animatedStyles = new Set();
    _this._listeners = {};
    return _this;
  }

  var _proto = AnimatedValue.prototype;

  _proto.__detach = function __detach() {
    this.stopAnimation();
  };

  _proto.__getValue = function __getValue() {
    return this._value;
  };

  _proto._update = function _update() {
    findAnimatedStyles(this, this._animatedStyles);
  };

  _proto._flush = function _flush() {
    if (this._animatedStyles.size === 0) this._update();

    this._animatedStyles.forEach(function (animatedStyle) {
      return animatedStyle.update();
    });
  };

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   */
  _proto.setValue = function setValue(value) {
    if (this._animation) {
      this._animation.stop();

      this._animation = null;
    }

    this._animatedStyles.clear();

    this._updateValue(value);
  };
  /**
   * Stops any running animation or tracking.  `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   */


  _proto.stopAnimation = function stopAnimation(callback) {
    this.stopTracking();
    this._animation && this._animation.stop();
    this._animation = null;
    callback && callback(this.__getValue());
  };
  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */


  _proto.interpolate = function interpolate(config$$1) {
    return new AnimatedInterpolation(this, config$$1);
  };
  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   */


  _proto.animate = function animate(animation, callback) {
    var _this2 = this;

    var previousAnimation = this._animation;
    this._animation && this._animation.stop();
    this._animation = animation;

    this._animatedStyles.clear();

    animation.start(this._value, this._updateValue, function (result) {
      _this2._animation = null;
      callback && callback(result);
    }, previousAnimation);
  };
  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to
   * synchronously read the value because it might be driven natively.
   */


  _proto.addListener = function addListener$$1(callback) {
    var id = String(_uniqueId++);
    this._listeners[id] = callback;
    return id;
  };

  _proto.removeListener = function removeListener$$1(id) {
    delete this._listeners[id];
  };

  _proto.removeAllListeners = function removeAllListeners$$1() {
    this._listeners = {};
  };
  /**
   * Typically only used internally.
   */


  _proto.stopTracking = function stopTracking() {
    this._tracking && this._tracking.__detach();
    this._tracking = null;
  };
  /**
   * Typically only used internally.
   */


  _proto.track = function track(tracking) {
    this.stopTracking();
    this._tracking = tracking;
  };

  return AnimatedValue;
}(AnimatedWithChildren);

function shallowEqual(a, b) {
  for (var i in a) {
    if (!(i in b)) return false;
  }

  for (var _i in b) {
    if (a[_i] !== b[_i]) return false;
  }

  return true;
}
function callProp(arg, state) {
  return typeof arg === 'function' ? arg(state) : arg;
}
function getValues(object) {
  return Object.keys(object).map(function (k) {
    return object[k];
  });
}
function getForwardProps(props) {
  var to = props.to,
      from = props.from,
      config$$1 = props.config,
      native = props.native,
      onRest = props.onRest,
      onFrame = props.onFrame,
      children = props.children,
      render = props.render,
      reset = props.reset,
      force = props.force,
      immediate = props.immediate,
      impl = props.impl,
      inject = props.inject,
      delay = props.delay,
      attach = props.attach,
      destroyed = props.destroyed,
      forward = _objectWithoutPropertiesLoose(props, ["to", "from", "config", "native", "onRest", "onFrame", "children", "render", "reset", "force", "immediate", "impl", "inject", "delay", "attach", "destroyed"]);

  return forward;
}
function renderChildren(props, componentProps) {
  var forward = _extends({}, componentProps, getForwardProps(props));

  return props.render ? props.render(_extends({}, forward, {
    children: props.children
  })) : props.children(forward);
}
function convertToAnimatedValue(acc, _ref) {
  var _extends2;

  var name = _ref[0],
      value = _ref[1];
  return _extends({}, acc, (_extends2 = {}, _extends2[name] = new AnimatedValue(value), _extends2));
}
function convertValues(props) {
  var from = props.from,
      to = props.to,
      native = props.native;
  var allProps = Object.entries(_extends({}, from, to));
  return native ? allProps.reduce(convertToAnimatedValue, {}) : _extends({}, from, to);
}

var check = function check(value) {
  return value === 'auto';
};

var overwrite = function overwrite(width, height) {
  return function (acc, _ref) {
    var _extends2;

    var name = _ref[0],
        value = _ref[1];
    return _extends({}, acc, (_extends2 = {}, _extends2[name] = value === 'auto' ? ~name.indexOf('height') ? height : width : value, _extends2));
  };
};

function fixAuto(props, callback) {
  var from = props.from,
      to = props.to; // Dry-route props back if nothing's using 'auto' in there

  if (!(getValues(to).some(check) || getValues(from).some(check))) return; // Fetch render v-dom

  var element = renderChildren(props, convertValues(props)); // A spring can return undefined/null, check against that (#153)

  if (!element) return;
  var elementStyles = element.props.style; // Return v.dom with injected ref

  return React.createElement(element.type, _extends({}, element.props, {
    style: _extends({}, elementStyles, {
      position: 'absolute',
      visibility: 'hidden'
    }),
    ref: function ref(_ref2) {
      if (_ref2) {
        // Once it's rendered out, fetch bounds (minus padding/margin/borders)
        var node = ReactDOM.findDOMNode(_ref2);
        var width, height;
        var cs = getComputedStyle(node);

        if (cs.boxSizing === 'border-box') {
          width = node.offsetWidth;
          height = node.offsetHeight;
        } else {
          var paddingX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
          var paddingY = parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);
          var borderX = parseFloat(cs.borderLeftWidth || 0) + parseFloat(cs.borderRightWidth || 0);
          var borderY = parseFloat(cs.borderTopWidth || 0) + parseFloat(cs.borderBottomWidth || 0);
          width = node.offsetWidth - paddingX - borderX;
          height = node.offsetHeight - paddingY - borderY;
        }

        var convert = overwrite(width, height);
        callback(_extends({}, props, {
          from: Object.entries(from).reduce(convert, from),
          to: Object.entries(to).reduce(convert, to)
        }));
      }
    }
  }));
}

var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

var prefixKey = function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
};

var prefixes = ['Webkit', 'Ms', 'Moz', 'O'];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce(function (acc, prop) {
  prefixes.forEach(function (prefix) {
    return acc[prefixKey(prefix, prop)] = acc[prop];
  });
  return acc;
}, isUnitlessNumber);

function dangerousStyleValue(name, value, isCustomProperty) {
  if (value == null || typeof value === 'boolean' || value === '') return '';
  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers

  return ('' + value).trim();
}

injectInterpolation(createInterpolation);
injectColorNames(colors);
injectBugfixes(fixAuto);
injectApplyAnimatedValues(function (instance, props) {
  if (instance.nodeType && instance.setAttribute !== undefined) {
    var style = props.style,
        children = props.children,
        attributes = _objectWithoutPropertiesLoose(props, ["style", "children"]); // Set textContent, if children is an animatable value


    if (children) instance.textContent = children; // Set styles ...

    for (var styleName in style) {
      if (!style.hasOwnProperty(styleName)) continue;
      var isCustomProperty = styleName.indexOf('--') === 0;
      var styleValue = dangerousStyleValue(styleName, style[styleName], isCustomProperty);
      if (styleName === 'float') styleName = 'cssFloat';
      if (isCustomProperty) instance.style.setProperty(styleName, styleValue);else instance.style[styleName] = styleValue;
    } // Set attributes ...


    for (var name in attributes) {
      if (instance.getAttribute(name)) instance.setAttribute(name, attributes[name]);
    }
  } else return false;
}, function (style) {
  return style;
});

// Important note: start() and stop() will only be called at most once.
// Once an animation has been stopped or finished its course, it will
// not be reused.
var Animation =
/*#__PURE__*/
function () {
  function Animation() {}

  var _proto = Animation.prototype;

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation) {};

  _proto.stop = function stop() {}; // Helper function for subclasses to make sure onEnd is only called once.


  _proto.__debouncedOnEnd = function __debouncedOnEnd(result) {
    var onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  };

  return Animation;
}();

var withDefault = function withDefault(value, defaultValue) {
  return value === undefined || value === null ? defaultValue : value;
};

var tensionFromOrigamiValue = function tensionFromOrigamiValue(oValue) {
  return (oValue - 30) * 3.62 + 194;
};

var frictionFromOrigamiValue = function frictionFromOrigamiValue(oValue) {
  return (oValue - 8) * 3 + 25;
};

var fromOrigamiTensionAndFriction = function fromOrigamiTensionAndFriction(tension, friction) {
  return {
    tension: tensionFromOrigamiValue(tension),
    friction: frictionFromOrigamiValue(friction)
  };
};

var SpringAnimation =
/*#__PURE__*/
function (_Animation) {
  _inheritsLoose(SpringAnimation, _Animation);

  function SpringAnimation(config$$1) {
    var _this;

    _this = _Animation.call(this) || this;

    _this.onUpdate = function () {
      var position = _this._lastPosition;
      var velocity = _this._lastVelocity;
      var tempPosition = _this._lastPosition;
      var tempVelocity = _this._lastVelocity; // If for some reason we lost a lot of frames (e.g. process large payload or
      // stopped in the debugger), we only advance by 4 frames worth of
      // computation and will continue on the next frame. It's better to have it
      // running at faster speed than jumping to the end.

      var MAX_STEPS = 64;
      var now$$1 = now();
      if (now$$1 > _this._lastTime + MAX_STEPS) now$$1 = _this._lastTime + MAX_STEPS; // We are using a fixed time step and a maximum number of iterations.
      // The following post provides a lot of thoughts into how to build this
      // loop: http://gafferongames.com/game-physics/fix-your-timestep/

      var TIMESTEP_MSEC = 1;
      var numSteps = Math.floor((now$$1 - _this._lastTime) / TIMESTEP_MSEC);

      for (var i = 0; i < numSteps; ++i) {
        // Velocity is based on seconds instead of milliseconds
        var step = TIMESTEP_MSEC / 1000; // This is using RK4. A good blog post to understand how it works:
        // http://gafferongames.com/game-physics/integration-basics/

        var aVelocity = velocity;
        var aAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        var tempPosition = position + aVelocity * step / 2;
        var tempVelocity = velocity + aAcceleration * step / 2;
        var bVelocity = tempVelocity;
        var bAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + bVelocity * step / 2;
        tempVelocity = velocity + bAcceleration * step / 2;
        var cVelocity = tempVelocity;
        var cAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;
        var dVelocity = tempVelocity;
        var dAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;
        var dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
        var dvdt = (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) / 6;
        position += dxdt * step;
        velocity += dvdt * step;
      }

      _this._lastTime = now$$1;
      _this._lastPosition = position;
      _this._lastVelocity = velocity;

      _this._onUpdate(position); // a listener might have stopped us in _onUpdate


      if (!_this.__active) return; // Conditions for stopping the spring animation

      var isOvershooting = false;

      if (_this._overshootClamping && _this._tension !== 0) {
        if (_this._startPosition < _this._to) {
          isOvershooting = position > _this._to;
        } else {
          isOvershooting = position < _this._to;
        }
      }

      var isVelocity = Math.abs(velocity) <= _this._restSpeedThreshold;

      var isDisplacement = true;
      if (_this._tension !== 0) isDisplacement = Math.abs(_this._to - position) <= _this._restDisplacementThreshold;

      if (isOvershooting || isVelocity && isDisplacement) {
        // Ensure that we end up with a round value
        if (_this._tension !== 0) _this._onUpdate(_this._to);
        return _this.__debouncedOnEnd({
          finished: true
        });
      }

      _this._animationFrame = requestFrame(_this.onUpdate);
    };

    _this._overshootClamping = withDefault(config$$1.overshootClamping, false);
    _this._restDisplacementThreshold = withDefault(config$$1.restDisplacementThreshold, 0.0001);
    _this._restSpeedThreshold = withDefault(config$$1.restSpeedThreshold, 0.0001);
    _this._initialVelocity = config$$1.velocity;
    _this._lastVelocity = withDefault(config$$1.velocity, 0);
    _this._to = config$$1.to;
    var springConfig = fromOrigamiTensionAndFriction(withDefault(config$$1.tension, 40), withDefault(config$$1.friction, 7));
    _this._tension = springConfig.tension;
    _this._friction = springConfig.friction;
    return _this;
  }

  var _proto = SpringAnimation.prototype;

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation) {
    this.__active = true;
    this._startPosition = fromValue;
    this._lastPosition = this._startPosition;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._lastTime = now();

    if (typeof fromValue === 'string' || typeof this._to === 'string') {
      this._onUpdate(this._to);

      return this.__debouncedOnEnd({
        finished: true
      });
    }

    if (previousAnimation instanceof SpringAnimation) {
      var internalState = previousAnimation.getInternalState();
      this._lastPosition = internalState.lastPosition;
      this._lastVelocity = internalState.lastVelocity;
      this._lastTime = internalState.lastTime;
    }

    if (this._initialVelocity !== undefined && this._initialVelocity !== null) this._lastVelocity = this._initialVelocity;
    this.onUpdate();
  };

  _proto.getInternalState = function getInternalState() {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime
    };
  };

  _proto.stop = function stop() {
    this.__active = false;
    clearTimeout(this._timeout);
    cancelFrame(this._animationFrame);

    this.__debouncedOnEnd({
      finished: false
    });
  };

  return SpringAnimation;
}(Animation);

var AnimatedArray =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedArray, _AnimatedWithChildren);

  function AnimatedArray(array) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    _this._values = array.map(function (n) {
      return new AnimatedValue(n);
    });
    return _this;
  }

  var _proto = AnimatedArray.prototype;

  _proto.setValue = function setValue(values) {
    var _this2 = this;

    values.forEach(function (n, i) {
      return _this2._values[i].setValue(n);
    });
  };

  _proto.__getValue = function __getValue() {
    return this._values.map(function (v) {
      return v.__getValue();
    });
  };

  _proto.stopAnimation = function stopAnimation(callback) {
    this._values.forEach(function (v) {
      return v.stopAnimation();
    });

    callback && callback(this.__getValue());
  };

  _proto.__attach = function __attach() {
    for (var i = 0; i < this._values.length; ++i) {
      if (this._values[i] instanceof Animated) this._values[i].__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var i = 0; i < this._values.length; ++i) {
      if (this._values[i] instanceof Animated) this._values[i].__removeChild(this);
    }
  };

  return AnimatedArray;
}(AnimatedWithChildren);

function maybeVectorAnim(array, _ref, anim, impl) {
  var tension = _ref.tension,
      friction = _ref.friction,
      to = _ref.to;
  // { tension, friction, to: [...]}
  if (array instanceof AnimatedArray) return parallel(array._values.map(function (v, i) {
    return anim(v, {
      tension: tension,
      friction: friction,
      to: to[i]
    }, impl);
  }), {
    stopTogether: false
  });
  return null;
}

function parallel(animations, config$$1) {
  var doneCount = 0;
  var hasEnded = {};
  var stopTogether = !(config$$1 && config$$1.stopTogether === false);
  var result = {
    start: function start(callback) {
      if (doneCount === animations.length) return callback && callback({
        finished: true
      });
      animations.forEach(function (animation, idx) {
        var cb = function cb(endResult) {
          hasEnded[idx] = true;
          doneCount++;

          if (doneCount === animations.length) {
            doneCount = 0;
            return callback && callback(endResult);
          }

          if (!endResult.finished && stopTogether) result.stop();
        };

        if (!animation) cb({
          finished: true
        });else animation.start(cb);
      });
    },
    stop: function stop() {
      animations.forEach(function (animation, idx) {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    }
  };
  return result;
}

function controller(value, config$$1, impl) {
  if (impl === void 0) {
    impl = SpringAnimation;
  }

  return maybeVectorAnim(value, config$$1, controller, impl) || {
    start: function start(callback) {
      var singleValue = value;
      var singleConfig = config$$1;
      singleValue.stopTracking();
      if (config$$1.to instanceof Animated) singleValue.track(new AnimatedTracking(singleValue, config$$1.to, impl, singleConfig, callback));else singleValue.animate(new impl(singleConfig), callback);
    },
    stop: function stop() {
      value.stopAnimation();
    }
  };
}

var AnimatedStyle =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedStyle, _AnimatedWithChildren);

  function AnimatedStyle(style) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    style = style || {};
    if (style.transform && !(style.transform instanceof Animated)) style = applyAnimatedValues.transform(style);
    _this._style = style;
    return _this;
  }

  var _proto = AnimatedStyle.prototype;

  _proto.__getValue = function __getValue() {
    var style = {};

    for (var key in this._style) {
      var value = this._style[key];
      style[key] = value instanceof Animated ? value.__getValue() : value;
    }

    return style;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    var style = {};

    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) style[key] = value.__getAnimatedValue();
    }

    return style;
  };

  _proto.__attach = function __attach() {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) value.__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) value.__removeChild(this);
    }
  };

  return AnimatedStyle;
}(AnimatedWithChildren);

var AnimatedProps =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedProps, _Animated);

  function AnimatedProps(props, callback) {
    var _this;

    _this = _Animated.call(this) || this;

    if (props.style) {
      props = _extends({}, props, {
        style: new AnimatedStyle(props.style)
      });
    }

    _this._props = props;
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedProps.prototype;

  _proto.__getValue = function __getValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) props[key] = value.__getValue();else props[key] = value;
    }

    return props;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) props[key] = value.__getAnimatedValue();
    }

    return props;
  };

  _proto.__attach = function __attach() {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) value.__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) value.__removeChild(this);
    }
  };

  _proto.update = function update() {
    this._callback();
  };

  return AnimatedProps;
}(Animated);

function createAnimatedComponent(Component) {
  var AnimatedComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(AnimatedComponent, _React$Component);

    function AnimatedComponent() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = AnimatedComponent.prototype;

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._propsAnimated && this._propsAnimated.__detach();
    };

    _proto.setNativeProps = function setNativeProps(props) {
      var didUpdate = applyAnimatedValues.fn(this.node, props, this);
      if (didUpdate === false) this.forceUpdate();
    };

    _proto.componentWillMount = function componentWillMount() {
      this.attachProps(this.props);
    };

    _proto.attachProps = function attachProps(_ref) {
      var _this = this;

      var forwardRef = _ref.forwardRef,
          nextProps = _objectWithoutPropertiesLoose(_ref, ["forwardRef"]);

      var oldPropsAnimated = this._propsAnimated; // The system is best designed when setNativeProps is implemented. It is
      // able to avoid re-rendering and directly set the attributes that
      // changed. However, setNativeProps can only be implemented on leaf
      // native components. If you want to animate a composite component, you
      // need to re-render it. In this case, we have a fallback that uses
      // forceUpdate.

      var callback = function callback() {
        if (_this.node) {
          var didUpdate = applyAnimatedValues.fn(_this.node, _this._propsAnimated.__getAnimatedValue(), _this);
          if (didUpdate === false) _this.forceUpdate();
        }
      };

      this._propsAnimated = new AnimatedProps(nextProps, callback); // When you call detach, it removes the element from the parent list
      // of children. If it goes to 0, then the parent also detaches itself
      // and so on.
      // An optimization is to attach the new elements and THEN detach the old
      // ones instead of detaching and THEN attaching.
      // This way the intermediate state isn't to go to 0 and trigger
      // this expensive recursive detaching to then re-attach everything on
      // the very next operation.

      oldPropsAnimated && oldPropsAnimated.__detach();
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      this.attachProps(nextProps);
    };

    _proto.render = function render() {
      var _this2 = this;

      var forwardRef = this.props.forwardRef;

      var animatedProps = this._propsAnimated.__getValue();

      return React.createElement(Component, _extends({}, animatedProps, {
        ref: function ref(node) {
          _this2.node = node;
          if (forwardRef) forwardRef(node);
        }
      }));
    };

    return AnimatedComponent;
  }(React.Component);

  return React.forwardRef(function (props, ref) {
    return React.createElement(AnimatedComponent, _extends({}, props, {
      forwardRef: ref
    }));
  });
}

var config$1 = {
  default: {
    tension: 170,
    friction: 26
  },
  gentle: {
    tension: 120,
    friction: 14
  },
  wobbly: {
    tension: 180,
    friction: 12
  },
  stiff: {
    tension: 210,
    friction: 20
  },
  slow: {
    tension: 280,
    friction: 60
  },
  molasses: {
    tension: 280,
    friction: 120
  }
};

var v = React.version.split('.');

if (process.env.NODE_ENV !== 'production' && (v[0] < 16 || v[1] < 4)) {
  console.warn('Please consider upgrading to react/react-dom 16.4.x or higher! Older React versions break getDerivedStateFromProps, see https://github.com/facebook/react/issues/12898');
}

var Spring =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Spring, _React$Component);

  function Spring() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      lastProps: {
        from: {},
        to: {}
      },
      propsChanged: false,
      internal: false
    };
    _this.didUpdate = false;
    _this.didInject = false;
    _this.updating = false;
    _this.animations = {};
    _this.interpolators = {};

    _this.start = function () {
      var _this$props = _this.props,
          config$$1 = _this$props.config,
          impl = _this$props.impl;
      if (_this.props.onStart) _this.props.onStart();
      Object.keys(_this.animations).forEach(function (name) {
        var _this$animations$name = _this.animations[name],
            animation = _this$animations$name.animation,
            to = _this$animations$name.toValue; // TODO: figure out why this is needed ...

        if (!to.__getValue && animation.__getValue() === to) return _this.finishAnimation(name);
        controller(animation, _extends({
          to: to
        }, callProp(config$$1, name)), impl).start(!to.__getValue && function (props) {
          return props.finished && _this.finishAnimation(name);
        });
      });
    };

    _this.stop = function () {
      return getValues(_this.animations).forEach(function (_ref) {
        var animation = _ref.animation;
        return animation.stopAnimation();
      });
    };

    _this.finishAnimation = function (name) {
      _this.animations[name].stopped = true;
      if (!_this.mounted) return;

      if (getValues(_this.animations).every(function (a) {
        return a.stopped;
      })) {
        var current = _extends({}, _this.props.from, _this.props.to);

        if (_this.props.onRest) _this.props.onRest(current); // Restore end-state

        if (_this.didInject) {
          _this.afterInject = convertValues(_this.props);
          _this.didInject = false;

          _this.setState({
            internal: true
          });
        }
      }
    };

    return _this;
  }

  var _proto = Spring.prototype;

  _proto.componentDidMount = function componentDidMount() {
    // componentDidUpdate isn't called on mount, we call it here to start animating
    this.componentDidUpdate();
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // Stop all ongoing animtions
    this.mounted = false;
    this.stop();
  };

  Spring.getDerivedStateFromProps = function getDerivedStateFromProps(props, _ref2) {
    var internal = _ref2.internal,
        lastProps = _ref2.lastProps;
    // The following is a test against props that could alter the animation
    var from = props.from,
        to = props.to,
        reset = props.reset,
        force = props.force;
    var propsChanged = !shallowEqual(to, lastProps.to) || !shallowEqual(from, lastProps.from) || reset && !internal || force && !internal;
    return {
      propsChanged: propsChanged,
      lastProps: props,
      internal: false
    };
  };

  _proto.render = function render() {
    var _this2 = this;

    var propsChanged = this.state.propsChanged; // Handle injected frames, for instance targets/web/fix-auto
    // An inject will return an intermediary React node which measures itself out
    // .. and returns a callback when the values sought after are ready, usually "auto".

    if (this.props.inject && propsChanged && !this.injectProps) {
      var frame = this.props.inject(this.props, function (injectProps) {
        // The inject frame has rendered, now let's update animations...
        _this2.injectProps = injectProps;

        _this2.setState({
          internal: true
        });
      }); // Render out injected frame

      if (frame) return frame;
    } // Update animations, this turns from/to props into AnimatedValues
    // An update can occur on injected props, or when own-props have changed.


    if (this.injectProps) {
      this.updateAnimations(this.injectProps);
      this.injectProps = undefined; // didInject is needed, because there will be a 3rd stage, where the original values
      // .. will be restored after the animation is finished. When someone animates towards
      // .. "auto", the end-result should be "auto", not "1999px", which would block nested
      // .. height/width changes.

      this.didInject = true;
    } else if (propsChanged) this.updateAnimations(this.props); // Render out raw values or AnimatedValues depending on "native"


    var values = this.getAnimatedValues();
    return values && Object.keys(values).length ? renderChildren(this.props, _extends({}, values, this.afterInject)) : null;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    // The animation has to start *after* render, since at that point the scene
    // .. graph should be established, so we do it here. Unfortunatelly, non-native
    // .. animations as well as "auto"-injects call forceUpdate, so it's causing a loop.
    // .. didUpdate prevents that as it gets set only on prop changes.
    if (this.didUpdate) {
      if (this.props.delay) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.start, this.props.delay);
      } else this.start();
    }

    this.didUpdate = false;
  };

  _proto.updateAnimations = function updateAnimations(_ref3) {
    var _this3 = this;

    var from = _ref3.from,
        to = _ref3.to,
        attach = _ref3.attach,
        reset = _ref3.reset,
        immediate = _ref3.immediate,
        onFrame = _ref3.onFrame,
        native = _ref3.native;
    // This function will turn own-props into AnimatedValues, it tries to re-use
    // .. exsting animations as best as it can by detecting the changes made
    // We can potentially cause setState, but we're inside render, the flag prevents that
    this.updating = true; // Attachment handling, trailed springs can "attach" themselves to a previous spring

    var target = attach && attach(this);
    var animationsChanged = false;
    var allProps = Object.entries(_extends({}, from, to));
    this.animations = allProps.reduce(function (acc, _ref4, i) {
      var _extends2, _extends3;

      var name = _ref4[0],
          value = _ref4[1];
      var entry = reset === false && acc[name] || {
        stopped: true
      };
      var isNumber = typeof value === 'number';
      var isString = typeof value === 'string' && !value.startsWith('#') && !/\d/.test(value) && !colorNames[value];
      var isArray = !isNumber && !isString && Array.isArray(value);
      var fromValue = from[name] !== undefined ? from[name] : value;
      var fromAnimated = fromValue instanceof AnimatedValue;
      var toValue = isNumber || isArray ? value : isString ? value : 1;

      if (target) {
        // Attach value to target animation
        var attachedAnimation = target.animations[name];
        if (attachedAnimation) toValue = attachedAnimation.animation;
      }

      var old = entry.animation;
      var animation, interpolation$$1;

      if (fromAnimated) {
        // Use provided animated value
        animation = interpolation$$1 = fromValue;
      } else if (isNumber || isString) {
        // Create animated value
        animation = interpolation$$1 = entry.animation || new AnimatedValue(fromValue);
      } else if (isArray) {
        // Create animated array
        animation = interpolation$$1 = entry.animation || new AnimatedArray(fromValue);
      } else {
        // Deal with interpolations
        var previous = entry.interpolation && entry.interpolation._interpolation(entry.animation._value);

        if (entry.animation) {
          animation = entry.animation;
          animation.setValue(0);
        } else animation = new AnimatedValue(0);

        var _config = {
          range: [0, 1],
          output: [previous !== undefined ? previous : fromValue, value]
        };
        if (entry.interpolation) interpolation$$1 = entry.interpolation.__update(_config);else interpolation$$1 = animation.interpolate(_config);
      }

      if (old !== animation) animationsChanged = true; // Set immediate values

      if (callProp(immediate, name)) animation.setValue(toValue); // Save interpolators

      _this3.interpolators = _extends({}, _this3.interpolators, (_extends2 = {}, _extends2[name] = interpolation$$1, _extends2));
      return _extends({}, acc, (_extends3 = {}, _extends3[name] = _extends({}, entry, {
        name: name,
        animation: animation,
        interpolation: interpolation$$1,
        toValue: toValue,
        stopped: false
      }), _extends3));
    }, this.animations); // Update animated props (which from now on will take care of the animation)

    if (animationsChanged) {
      var oldAnimatedProps = this.animatedProps;
      this.animatedProps = new AnimatedProps(this.interpolators, function () {
        // This gets called on every animation frame ...
        if (onFrame) onFrame(_this3.animatedProps.__getValue());
        if (!native && !_this3.updating) _this3.setState({
          internal: true
        });
      });
      oldAnimatedProps && oldAnimatedProps.__detach();
    } // Flag an update that occured, componentDidUpdate will start the animation later on


    this.didUpdate = true;
    this.afterInject = undefined;
    this.didInject = false;
    this.updating = false;
  };

  _proto.flush = function flush() {
    getValues(this.animations).forEach(function (_ref5) {
      var animation = _ref5.animation;
      return animation._update && animation._update();
    });
  };

  _proto.getValues = function getValues$$1() {
    return this.animatedProps ? this.animatedProps.__getValue() : {};
  };

  _proto.getAnimatedValues = function getAnimatedValues() {
    return this.props.native ? this.interpolators : this.getValues();
  };

  return Spring;
}(React.Component);

Spring.defaultProps = {
  from: {},
  to: {},
  config: config$1.default,
  native: false,
  immediate: false,
  reset: false,
  force: false,
  impl: SpringAnimation,
  inject: bugfixes
};

var empty = function empty() {
  return null;
};

var ref = function ref(object, key, defaultValue) {
  return typeof object === 'function' ? object(key) : object || defaultValue;
};

var get$1 = function get(props) {
  var keys = props.keys,
      children = props.children,
      render = props.render,
      items = props.items,
      rest = _objectWithoutPropertiesLoose(props, ["keys", "children", "render", "items"]);

  children = render || children || empty;
  keys = typeof keys === 'function' ? items.map(keys) : keys;

  if (!Array.isArray(children)) {
    children = [children];
    keys = keys !== void 0 ? [keys] : children.map(function (c) {
      return c.toString();
    });
  } // Make sure numeric keys are interpreted as Strings (5 !== "5")


  keys = keys.map(function (k) {
    return String(k);
  });
  return _extends({
    keys: keys,
    children: children,
    items: items
  }, rest);
};

var guid = 0;

var Transition =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Transition, _React$PureComponent);

  var _proto = Transition.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  function Transition(prevProps) {
    var _this;

    _this = _React$PureComponent.call(this, prevProps) || this; // TODO: make springs a set

    _this.springs = {};
    _this.state = {
      transitions: [],
      current: {},
      deleted: [],
      prevProps: prevProps
    };
    return _this;
  }

  Transition.getDerivedStateFromProps = function getDerivedStateFromProps(props, _ref) {
    var prevProps = _ref.prevProps,
        state = _objectWithoutPropertiesLoose(_ref, ["prevProps"]);

    var _get = get$1(props),
        keys = _get.keys,
        children = _get.children,
        items = _get.items,
        from = _get.from,
        enter = _get.enter,
        leave = _get.leave,
        update = _get.update;

    var _get2 = get$1(prevProps),
        _keys = _get2.keys,
        _items = _get2.items;

    var current = _extends({}, state.current);

    var deleted = state.deleted.concat(); // Compare next keys with current keys

    var currentKeys = Object.keys(current);
    var currentSet = new Set(currentKeys);
    var nextSet = new Set(keys);
    var added = keys.filter(function (item) {
      return !currentSet.has(item);
    });
    var removed = currentKeys.filter(function (item) {
      return !nextSet.has(item);
    });
    var updated = keys.filter(function (item) {
      return currentSet.has(item);
    });
    added.forEach(function (key) {
      var keyIndex = keys.indexOf(key);
      var item = items ? items[keyIndex] : key;
      current[key] = {
        originalKey: key,
        children: children[keyIndex],
        key: guid++,
        item: item,
        to: ref(enter, item),
        from: ref(from, item)
      };
    });
    removed.forEach(function (key) {
      var keyIndex = _keys.indexOf(key);

      deleted.push(_extends({
        destroyed: true,
        lastSibling: _keys[Math.max(0, keyIndex - 1)]
      }, current[key], {
        to: ref(leave, _items ? _items[keyIndex] : key)
      }));
      delete current[key];
    });
    updated.forEach(function (key) {
      var keyIndex = keys.indexOf(key);
      var item = items ? items[keyIndex] : key;
      current[key] = _extends({}, current[key], {
        children: children[keyIndex],
        to: ref(update, item, current[key].to)
      });
    });
    var transitions = keys.map(function (key) {
      return current[key];
    });
    deleted.forEach(function (_ref2) {
      var s = _ref2.lastSibling,
          t = _objectWithoutPropertiesLoose(_ref2, ["lastSibling"]);

      // Find last known sibling, left aligned
      var i = Math.max(0, transitions.findIndex(function (t) {
        return t.originalKey === s;
      }) + 1);
      transitions = transitions.slice(0, i).concat([t], transitions.slice(i));
    });
    return {
      transitions: transitions,
      current: current,
      deleted: deleted,
      prevProps: props
    };
  };

  _proto.getValues = function getValues() {
    return undefined;
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props = this.props,
        render = _this$props.render,
        _this$props$from = _this$props.from,
        _this$props$enter = _this$props.enter,
        _this$props$leave = _this$props.leave,
        _this$props$native = _this$props.native,
        native = _this$props$native === void 0 ? false : _this$props$native,
        keys = _this$props.keys,
        items = _this$props.items,
        onFrame = _this$props.onFrame,
        onRest = _this$props.onRest,
        extra = _objectWithoutPropertiesLoose(_this$props, ["render", "from", "enter", "leave", "native", "keys", "items", "onFrame", "onRest"]);

    var props = _extends({
      native: native
    }, extra);

    return this.state.transitions.map(function (transition, i) {
      var key = transition.key,
          item = transition.item,
          children = transition.children,
          from = transition.from,
          rest = _objectWithoutPropertiesLoose(transition, ["key", "item", "children", "from"]);

      return React.createElement(Spring, _extends({
        ref: function ref(r) {
          return r && (_this2.springs[key] = r.getValues());
        },
        key: key,
        onRest: rest.destroyed ? function () {
          return _this2.mounted && _this2.setState(function (_ref3) {
            var deleted = _ref3.deleted;
            return {
              deleted: deleted.filter(function (t) {
                return t.key !== key;
              })
            };
          }, function () {
            return delete _this2.springs[key];
          });
        } : onRest && function (values) {
          return onRest(item, values);
        },
        onFrame: onFrame && function (values) {
          return onFrame(item, values);
        }
      }, rest, props, {
        from: rest.destroyed ? _this2.springs[key] || from : from,
        render: render && children,
        children: render ? _this2.props.children : children
      }));
    });
  };

  return Transition;
}(React.PureComponent);

var Trail =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Trail, _React$PureComponent);

  function Trail() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Trail.prototype;

  _proto.getValues = function getValues() {
    return this.instance && this.instance.getValues();
  };

  _proto.componentDidMount = function componentDidMount() {
    this.instance && this.instance.flush();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.instance && this.instance.flush();
  };

  _proto.render = function render() {
    var _this = this;

    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render,
        _this$props$from = _this$props.from,
        from = _this$props$from === void 0 ? {} : _this$props$from,
        _this$props$to = _this$props.to,
        to = _this$props$to === void 0 ? {} : _this$props$to,
        _this$props$native = _this$props.native,
        native = _this$props$native === void 0 ? false : _this$props$native,
        keys = _this$props.keys,
        delay = _this$props.delay,
        onRest = _this$props.onRest,
        extra = _objectWithoutPropertiesLoose(_this$props, ["children", "render", "from", "to", "native", "keys", "delay", "onRest"]);

    var animations = new Set();

    var hook = function hook(index, animation) {
      animations.add(animation);
      if (index === 0) return undefined;else return Array.from(animations)[index - 1];
    };

    var props = _extends({}, extra, {
      native: native,
      from: from,
      to: to
    });

    var target = render || children;
    return target.map(function (child, i) {
      var attachedHook = function attachedHook(animation) {
        return hook(i, animation);
      };

      var firstDelay = i === 0 && delay;
      return React.createElement(Spring, _extends({
        ref: function ref(_ref) {
          return i === 0 && (_this.instance = _ref);
        },
        onRest: i === 0 ? onRest : null,
        key: keys[i]
      }, props, {
        delay: firstDelay || undefined,
        attach: attachedHook,
        render: render && child,
        children: render ? children : child
      }));
    });
  };

  return Trail;
}(React.PureComponent);

var DEFAULT = '__default';

var Keyframes =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Keyframes, _React$PureComponent);

  function Keyframes() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
    _this.guid = 0;
    _this.state = {
      props: {},
      oldProps: {},
      resolve: function resolve() {
        return null;
      }
    };

    _this.next = function (props) {
      _this.running = true;
      return new Promise(function (resolve) {
        _this.mounted && _this.setState(function (state) {
          return {
            props: props,
            oldProps: _extends({}, _this.state.props),
            resolve: resolve
          };
        }, function () {
          return _this.running = false;
        });
      });
    };

    return _this;
  }

  var _proto = Keyframes.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.componentDidUpdate({});
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    if (prevProps.state !== this.props.state || this.props.reset && !this.running) {
      (function () {
        var _this2$props = _this2.props,
            states = _this2$props.states,
            f = _this2$props.filter,
            state = _this2$props.state;

        if (states && state) {
          (function () {
            var localId = ++_this2.guid;
            var slots = states[state];

            if (slots) {
              if (Array.isArray(slots)) {
                var q = Promise.resolve();

                var _loop = function _loop() {
                  if (_isArray) {
                    if (_i >= _iterator.length) return "break";
                    _ref = _iterator[_i++];
                  } else {
                    _i = _iterator.next();
                    if (_i.done) return "break";
                    _ref = _i.value;
                  }

                  var s = _ref;
                  q = q.then(function () {
                    return localId === _this2.guid && _this2.next(f(s));
                  });
                };

                for (var _iterator = slots, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                  var _ref;

                  var _ret = _loop();

                  if (_ret === "break") break;
                }
              } else if (typeof slots === 'function') {
                slots(function (props) {
                  return localId === _this2.guid && _this2.next(f(props));
                }, _this2.props);
              } else {
                _this2.next(f(states[state]));
              }
            }
          })();
        }
      })();
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$state = this.state,
        props = _this$state.props,
        oldProps = _this$state.oldProps,
        resolve = _this$state.resolve;

    var _this$props = this.props,
        Component = _this$props.primitive,
        ownFrom = _this$props.from,
        _onRest = _this$props.onRest,
        rest = _objectWithoutPropertiesLoose(_this$props, ["primitive", "from", "onRest"]);

    var current = this.instance && this.instance.getValues();
    var from = typeof props.from === 'function' ? props.from : _extends({}, oldProps.from, current, props.from);
    return props ? React.createElement(Component, _extends({
      ref: function ref(_ref2) {
        return _this3.instance = _ref2;
      }
    }, rest, props, {
      from: _extends({}, from, ownFrom),
      onRest: function onRest(args) {
        resolve(args);
        if (_onRest) _onRest(args);
      }
    })) : null;
  };

  return Keyframes;
}(React.PureComponent);

Keyframes.defaultProps = {
  state: DEFAULT
};

Keyframes.create = function (primitive) {
  return function (states, filter) {
    var _states;

    if (filter === void 0) {
      filter = function filter(states) {
        return states;
      };
    }

    if (typeof states === 'function' || Array.isArray(states)) states = (_states = {}, _states[DEFAULT] = states, _states);
    return function (props) {
      return React.createElement(Keyframes, _extends({
        primitive: primitive,
        states: states,
        filter: filter
      }, props));
    };
  };
};

var interpolateTo = function interpolateTo(props) {
  var forward = getForwardProps(props);
  var rest = Object.keys(props).reduce(function (acc, key) {
    var _extends2;

    return forward[key] ? acc : _extends({}, acc, (_extends2 = {}, _extends2[key] = props[key], _extends2));
  }, {});
  return _extends({
    to: forward
  }, rest);
};

Keyframes.Spring = Keyframes.create(Spring);

Keyframes.Spring.to = function (states) {
  return Keyframes.Spring(states, interpolateTo);
};

Keyframes.Trail = Keyframes.create(Trail);

Keyframes.Trail.to = function (states) {
  return Keyframes.Trail(states, interpolateTo);
};

Keyframes.Transition = Keyframes.create(Transition);

var AnimatedDiv = createAnimatedComponent('div');

var _React$createContext = React.createContext(null);
var Provider = _React$createContext.Provider;
var Consumer = _React$createContext.Consumer;

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop';
}

var START_TRANSLATE_3D = 'translate3d(0px,0px,0px)';
var START_TRANSLATE = 'translate(0px,0px)';
var ParallaxLayer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(ParallaxLayer, _React$PureComponent);

  function ParallaxLayer() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = ParallaxLayer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var parent = this.parent;

    if (parent) {
      parent.layers = parent.layers.concat(this);
      parent.update();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this = this;

    var parent = this.parent;

    if (parent) {
      parent.layers = parent.layers.filter(function (layer) {
        return layer !== _this;
      });
      parent.update();
    }
  };

  _proto.setPosition = function setPosition(height, scrollTop, immediate) {
    if (immediate === void 0) {
      immediate = false;
    }

    var _this$parent$props = this.parent.props,
        config$$1 = _this$parent$props.config,
        impl = _this$parent$props.impl;
    var targetScroll = Math.floor(this.props.offset) * height;
    var offset = height * this.props.offset + targetScroll * this.props.speed;
    var to = parseFloat(-(scrollTop * this.props.speed) + offset);
    if (!immediate) controller(this.animatedTranslate, _extends({
      to: to
    }, config$$1), impl).start();else this.animatedTranslate.setValue(to);
  };

  _proto.setHeight = function setHeight(height, immediate) {
    if (immediate === void 0) {
      immediate = false;
    }

    var _this$parent$props2 = this.parent.props,
        config$$1 = _this$parent$props2.config,
        impl = _this$parent$props2.impl;
    var to = parseFloat(height * this.props.factor);
    if (!immediate) controller(this.animatedSpace, _extends({
      to: to
    }, config$$1), impl).start();else this.animatedSpace.setValue(to);
  };

  _proto.initialize = function initialize() {
    var props = this.props;
    var parent = this.parent;
    var targetScroll = Math.floor(props.offset) * parent.space;
    var offset = parent.space * props.offset + targetScroll * props.speed;
    var to = parseFloat(-(parent.current * props.speed) + offset);
    this.animatedTranslate = new AnimatedValue(to);
    this.animatedSpace = new AnimatedValue(parent.space * props.factor);
  };

  _proto.renderLayer = function renderLayer() {
    var _extends2;

    var _this$props = this.props,
        style = _this$props.style,
        children = _this$props.children,
        offset = _this$props.offset,
        speed = _this$props.speed,
        factor = _this$props.factor,
        className = _this$props.className,
        props = _objectWithoutPropertiesLoose(_this$props, ["style", "children", "offset", "speed", "factor", "className"]);

    var horizontal = this.parent.props.horizontal;
    var translate3d = this.animatedTranslate.interpolate({
      range: [0, 1],
      output: horizontal ? [START_TRANSLATE_3D, 'translate3d(1px,0,0)'] : [START_TRANSLATE_3D, 'translate3d(0,1px,0)']
    });
    return React.createElement(AnimatedDiv, _extends({}, props, {
      className: className,
      style: _extends((_extends2 = {
        position: 'absolute',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform'
      }, _extends2[horizontal ? 'height' : 'width'] = '100%', _extends2[horizontal ? 'width' : 'height'] = this.animatedSpace, _extends2.WebkitTransform = translate3d, _extends2.MsTransform = translate3d, _extends2.transform = translate3d, _extends2), style)
    }), children);
  };

  _proto.render = function render() {
    var _this2 = this;

    return React.createElement(Consumer, null, function (parent) {
      if (parent && !_this2.parent) {
        _this2.parent = parent;

        _this2.initialize();
      }

      return _this2.renderLayer();
    });
  };

  return ParallaxLayer;
}(React.PureComponent);
ParallaxLayer.defaultProps = {
  factor: 1,
  offset: 0,
  speed: 0
};

var Parallax =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inheritsLoose(Parallax, _React$PureComponent2);

  function Parallax() {
    var _this3;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _React$PureComponent2.call.apply(_React$PureComponent2, [this].concat(args)) || this;
    _this3.state = {
      ready: false
    };
    _this3.layers = [];
    _this3.space = 0;
    _this3.current = 0;
    _this3.offset = 0;
    _this3.busy = false;

    _this3.moveItems = function () {
      _this3.layers.forEach(function (layer) {
        return layer.setPosition(_this3.space, _this3.current);
      });

      _this3.busy = false;
    };

    _this3.scrollerRaf = function () {
      return requestAnimationFrame(_this3.moveItems);
    };

    _this3.onScroll = function (event) {
      var horizontal = _this3.props.horizontal;

      if (!_this3.busy) {
        _this3.busy = true;

        _this3.scrollerRaf();

        _this3.current = event.target[getScrollType(horizontal)];
      }
    };

    _this3.update = function () {
      var _this3$props = _this3.props,
          scrolling = _this3$props.scrolling,
          horizontal = _this3$props.horizontal;
      var scrollType = getScrollType(horizontal);
      if (!_this3.container) return;
      _this3.space = _this3.container[horizontal ? 'clientWidth' : 'clientHeight'];
      if (scrolling) _this3.current = _this3.container[scrollType];else _this3.container[scrollType] = _this3.current = _this3.offset * _this3.space;
      if (_this3.content) _this3.content.style[horizontal ? 'width' : 'height'] = _this3.space * _this3.props.pages + "px";

      _this3.layers.forEach(function (layer) {
        layer.setHeight(_this3.space, true);
        layer.setPosition(_this3.space, _this3.current, true);
      });
    };

    _this3.updateRaf = function () {
      requestAnimationFrame(_this3.update); // Some browsers don't fire on maximize

      setTimeout(_this3.update, 150);
    };

    _this3.scrollStop = function (event) {
      return _this3.animatedScroll && _this3.animatedScroll.stopAnimation();
    };

    return _this3;
  }

  var _proto2 = Parallax.prototype;

  _proto2.scrollTo = function scrollTo(offset) {
    var _this$props2 = this.props,
        horizontal = _this$props2.horizontal,
        config$$1 = _this$props2.config,
        impl = _this$props2.impl;
    var scrollType = getScrollType(horizontal);
    this.scrollStop();
    this.offset = offset;
    var target = this.container;
    this.animatedScroll = new AnimatedValue(target[scrollType]);
    this.animatedScroll.addListener(function (_ref) {
      var value = _ref.value;
      return target[scrollType] = value;
    });
    controller(this.animatedScroll, _extends({
      to: offset * this.space
    }, config$$1), impl).start();
  };

  _proto2.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.updateRaf, false);
    this.update();
    this.setState({
      ready: true
    });
  };

  _proto2.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.updateRaf, false);
  };

  _proto2.componentDidUpdate = function componentDidUpdate() {
    this.update();
  };

  _proto2.render = function render() {
    var _this4 = this,
        _extends3;

    var _this$props3 = this.props,
        style = _this$props3.style,
        innerStyle = _this$props3.innerStyle,
        pages = _this$props3.pages,
        className = _this$props3.className,
        scrolling = _this$props3.scrolling,
        children = _this$props3.children,
        horizontal = _this$props3.horizontal;
    var overflow = scrolling ? 'scroll' : 'hidden';
    return React.createElement("div", {
      ref: function ref(node) {
        return _this4.container = node;
      },
      onScroll: this.onScroll,
      onWheel: scrolling ? this.scrollStop : null,
      onTouchStart: scrolling ? this.scrollStop : null,
      style: _extends({
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: overflow,
        overflowY: horizontal ? 'hidden' : overflow,
        overflowX: horizontal ? overflow : 'hidden',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: START_TRANSLATE,
        MsTransform: START_TRANSLATE,
        transform: START_TRANSLATE_3D
      }, style),
      className: className
    }, this.state.ready && React.createElement("div", {
      ref: function ref(node) {
        return _this4.content = node;
      },
      style: _extends((_extends3 = {
        position: 'absolute'
      }, _extends3[horizontal ? 'height' : 'width'] = '100%', _extends3.WebkitTransform = START_TRANSLATE, _extends3.MsTransform = START_TRANSLATE, _extends3.transform = START_TRANSLATE_3D, _extends3.overflow = 'hidden', _extends3[horizontal ? 'width' : 'height'] = this.space * pages, _extends3), innerStyle)
    }, React.createElement(Provider, {
      value: this
    }, children)));
  };

  return Parallax;
}(React.PureComponent);

Parallax.Layer = ParallaxLayer;
Parallax.defaultProps = {
  config: config$1.slow,
  scrolling: true,
  horizontal: false,
  impl: SpringAnimation
};

var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];
var extendedAnimated = domElements.reduce(function (acc, element) {
  acc[element] = createAnimatedComponent(element);
  return acc;
}, createAnimatedComponent);

var isBoolean = function isBoolean(val) {
  return typeof val === 'boolean';
};

var containerStyles = {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    perspective: '1000px'
};

var flipperStyles = {
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '100%',
    height: '100%'
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
        rotation = _ref.rotation,
        children = _ref.children;
    return React.createElement(
        'div',
        { style: _extends({}, containerStyles) },
        React.createElement(
            'div',
            {
                style: _extends({
                    transition: animateRotation ? isBoolean(animateRotation) ? '0.4s' : animateRotation + 's' : 'none',
                    transform: 'rotateY(' + rotation + 'deg'
                }, flipperStyles)
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
    rotation: propTypes.number,
    animateRotation: propTypes.oneOfType([propTypes.bool, propTypes.number]),
    children: propTypes.node.isRequired
};

Flipper.defaultProps = {
    rotation: 0,
    animateRotation: true
};

var defaultContext = {
    isInCardContainer: false,
    aspectRatio: undefined,
    getCardTransform: undefined,
    setIsDisplayNone: undefined,
    registerUnmount: undefined,
    containerSize: undefined,
    containerType: undefined,
    indexToKeyMap: undefined,
    cardCount: undefined,
    faceUp: undefined
};

var CardContainerContext = React.createContext(defaultContext);

var isObject = function isObject(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
};

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var DEFAULT_CARD_WIDTH = '210px';
var DEFAULT_CARD_HEIGHT = '300px';

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

var getStyle = function getStyle(props) {
	var cardContainerContext = props.cardContainerContext;


	var shadow = getFirstDefinedValue(props.shadow, cardContainerContext.shadow, true); // TODO: MAYBE REMOVE THIS?? AT LEAST THE INHERITANCE FROM CONTAINER
	var animateShadow = getFirstDefinedValue(props.animateShadow, cardContainerContext.animateShadow, true);
	var border = getFirstDefinedValue(props.border, cardContainerContext.border, true);
	var borderRadius = getFirstDefinedValue(props.borderRadius, cardContainerContext.borderRadius, true);

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
		borderRadiusStyle = borderRadius ? { borderRadius: '2%' } : {};
	} else if (isNumeric(borderRadius)) {
		borderRadiusStyle = { borderRadius: borderRadius + 'px' };
	}

	return _extends({}, shadowStyle, borderStyle, borderRadiusStyle, baseStyles);
};

var InnerCard = function (_React$Component) {
	inherits(InnerCard, _React$Component);

	function InnerCard(props) {
		classCallCheck(this, InnerCard);

		var _this = possibleConstructorReturn(this, (InnerCard.__proto__ || Object.getPrototypeOf(InnerCard)).call(this, props));

		_this.state = {
			hasMounted: false
		};
		return _this;
	}

	createClass(InnerCard, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			var cardContainerContext = this.props.cardContainerContext;


			if (cardContainerContext.isInCardContainer && this.wrapper) {
				// Sanity check. wrapper should always be there when in card container
				this.setIsDisplayNone();
				this.observer = new MutationObserver(function () {
					_this2.setIsDisplayNone();
				});
				this.observer.observe(this.wrapper, { attributes: true });
			}

			requestAnimationFrame(function () {
				return _this2.setState({ hasMounted: true });
			});
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.observer) {
				this.observer.disconnect();
				this.observer = undefined;
				this.props.cardContainerContext.registerUnmount(this.getIndexInContainer(), this.getKeyInContainer());
			}
		}
	}, {
		key: 'setIsDisplayNone',
		value: function setIsDisplayNone() {
			var isDisplayNone = getComputedStyle(this.wrapper).display === 'none';
			if (this.isDisplayNone !== isDisplayNone) {
				this.props.cardContainerContext.setIsDisplayNone(this.getIndexInContainer(), isDisplayNone);
			}
			this.isDisplayNone = isDisplayNone;
		}
	}, {
		key: 'getIndexInContainer',
		value: function getIndexInContainer() {
			var _props = this.props,
			    cardIndex = _props.cardIndex,
			    __cardIndexInContainer = _props.__cardIndexInContainer,
			    cardContainerContext = _props.cardContainerContext;
			var containerType = cardContainerContext.containerType,
			    cardCount = cardContainerContext.cardCount;


			var index = __cardIndexInContainer;

			if (!Number.isInteger(index)) {
				// If __cardIndexInContainer isn't an integer, it indicates that the card container isn't the immediate parent of the
				// card (otherwise the container would have set this prop). So we require cardCount to be set on the container
				if (!Number.isInteger(cardCount)) {
					throw new Error('cardCount prop on ' + containerType + ' must be set when cards arent its immediate children');
				}

				if (!Number.isInteger(cardIndex)) {
					throw new Error('cardIndex prop on cards in a ' + containerType + ' must be set, when the card isnt an immediate child of the ' + containerType);
				}

				index = cardIndex;
			}

			return index;
		}
	}, {
		key: 'getKeyInContainer',
		value: function getKeyInContainer() {
			return this.props.cardContainerContext.indexToKeyMap[this.getIndexInContainer()];
		}
	}, {
		key: 'getDimensionsInContainer',
		value: function getDimensionsInContainer() {
			var _props$cardContainerC = this.props.cardContainerContext,
			    getCardTransform = _props$cardContainerC.getCardTransform,
			    containerSize = _props$cardContainerC.containerSize;

			var positionInContainer = getCardTransform(this.getIndexInContainer());
			positionInContainer.width = positionInContainer.scaleX * containerSize.width;
			positionInContainer.height = positionInContainer.scaleY * containerSize.height;
			positionInContainer.x += containerSize.width / 2 - positionInContainer.width / 2;
			positionInContainer.y += containerSize.height / 2 - positionInContainer.height / 2;

			return positionInContainer;
		}
	}, {
		key: 'renderInContainer',
		value: function renderInContainer(card) {
			var _this3 = this;

			var _getDimensionsInConta = this.getDimensionsInContainer(),
			    x = _getDimensionsInConta.x,
			    y = _getDimensionsInConta.y,
			    width = _getDimensionsInConta.width,
			    height = _getDimensionsInConta.height,
			    _getDimensionsInConta2 = _getDimensionsInConta.rotate,
			    rotate = _getDimensionsInConta2 === undefined ? 0 : _getDimensionsInConta2,
			    _getDimensionsInConta3 = _getDimensionsInConta.originX,
			    originX = _getDimensionsInConta3 === undefined ? 50 : _getDimensionsInConta3,
			    _getDimensionsInConta4 = _getDimensionsInConta.originY,
			    originY = _getDimensionsInConta4 === undefined ? 50 : _getDimensionsInConta4;

			return React.createElement(
				Spring,
				{ to: { x: x, y: y, width: width, height: height, originX: originX, originY: originY, rotate: rotate }, immediate: !this.state.hasMounted || this.isDisplayNone },
				function (_ref) {
					var x = _ref.x,
					    y = _ref.y,
					    width = _ref.width,
					    height = _ref.height,
					    originX = _ref.originX,
					    originY = _ref.originY,
					    rotate = _ref.rotate;

					return React.createElement(
						'div',
						{
							style: {
								boxSizing: 'border-box',
								display: 'inline-block',
								position: 'absolute',
								top: 0,
								left: 0,
								transform: 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotate + 'deg)',
								transformOrigin: originX + '% ' + originY + '%',
								width: width + 'px',
								height: height + 'px'
							},
							ref: function ref(el) {
								return _this3.wrapper = el;
							}
						},
						card
					);
				}
			);
		}
	}, {
		key: 'renderCard',
		value: function renderCard(_ref2, paddingTop) {
			var width = _ref2.width,
			    height = _ref2.height;
			var _props2 = this.props,
			    animateRotation = _props2.animateRotation,
			    backStyle = _props2.backStyle,
			    cardContainerContext = _props2.cardContainerContext,
			    frontStyle = _props2.frontStyle,
			    front = _props2.front,
			    back = _props2.back;


			var styles = getStyle(this.props);

			var faceUp = getFirstDefinedValue(this.props.faceUp, cardContainerContext.faceUp, false);
			var rotation = isBoolean(faceUp) ? faceUp ? 180 : 0 : faceUp; // in this case faceUp is a number (degrees rotation around Y axis)

			return React.createElement(
				'div',
				{
					style: {
						width: width,
						height: height,
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
							rotation: rotation,
							animateRotation: animateRotation
						},
						renderSide(back, _extends({}, styles, backStyle)),
						renderSide(front, _extends({}, styles, frontStyle))
					)
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props,
			    cardContainerContext = _props3.cardContainerContext,
			    aspectRatio = _props3.aspectRatio,
			    _width = _props3.width,
			    _height = _props3.height;


			var defaultCardDimensions = void 0;

			if (cardContainerContext.isInCardContainer) {
				try {
					defaultCardDimensions = {
						x: 0,
						y: 0,
						width: '100%',
						height: '100%'
					};
				} catch (e) {
					console.error(e.message);
					return;
				}
			} else {
				defaultCardDimensions = {
					x: 0,
					y: 0,
					width: DEFAULT_CARD_WIDTH,
					height: DEFAULT_CARD_HEIGHT
				};
			}

			var isWidthSet = !isNullOrUndefined(_width);
			var isHeightSet = !isNullOrUndefined(_height); // && props.height !== 0;
			var isAspectRatioSet = !isNullOrUndefined(aspectRatio);

			var width = isWidthSet ? _width : defaultCardDimensions.width;
			var height = void 0,
			    paddingTop = 0;

			if (isHeightSet || isWidthSet && isAspectRatioSet) {
				if (isHeightSet) {
					height = _height;
				} else {
					paddingTop = 100 / aspectRatio + '%';
				}
			} else {
				height = defaultCardDimensions.height;
			}

			var cardDimensions = _extends({}, defaultCardDimensions, {
				width: width,
				height: height
			});

			var card = this.renderCard(cardDimensions, paddingTop);

			return cardContainerContext.isInCardContainer ? this.renderInContainer(card) : card;
		}
	}]);
	return InnerCard;
}(React.Component);

// Injecting context as a prop so it can be accessed outside the render function in the card


var Card = function Card(props) {
	return React.createElement(
		CardContainerContext.Consumer,
		null,
		function (context) {
			return React.createElement(InnerCard, _extends({ cardContainerContext: context }, props));
		}
	);
};

Card.propTypes = {
	front: propTypes.oneOfType([propTypes.string, propTypes.node]),
	back: propTypes.oneOfType([propTypes.string, propTypes.node]),
	faceUp: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	shadow: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	border: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	borderRadius: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	animateRotation: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	animateShadow: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	aspectRatio: propTypes.number,
	frontStyle: propTypes.object,
	backStyle: propTypes.object
};

Card.defaultProps = {
	frontStyle: {},
	backStyle: {},
	animateRotation: true
};

// TODO: FIX THAT WIDTH AND HEIGHT IS STILL USING IN RENDER. USE STYLE/CLASSNAME INSTEAD????

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }

    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;

        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;

                return true;
            }

            return false;
        });

        return result;
    }

    return (function () {
        function anonymous() {
            this.__entries__ = [];
        }

        var prototypeAccessors = { size: { configurable: true } };

        /**
         * @returns {boolean}
         */
        prototypeAccessors.size.get = function () {
            return this.__entries__.length;
        };

        /**
         * @param {*} key
         * @returns {*}
         */
        anonymous.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];

            return entry && entry[1];
        };

        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        anonymous.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };

        /**
         * @returns {void}
         */
        anonymous.prototype.clear = function () {
            this.__entries__.splice(0);
        };

        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        anonymous.prototype.forEach = function (callback, ctx) {
            var this$1 = this;
            if ( ctx === void 0 ) ctx = null;

            for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                var entry = list[i];

                callback.call(ctx, entry[1], entry[0]);
            }
        };

        Object.defineProperties( anonymous.prototype, prototypeAccessors );

        return anonymous;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1$1 = (function () {
    if (typeof global$1 !== 'undefined' && global$1.Math === Math) {
        return global$1;
    }

    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }

    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }

    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1$1);
    }

    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;

/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
var throttle$1 = function (callback, delay) {
    var leadingCall = false,
        trailingCall = false,
        lastCallTime = 0;

    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;

            callback();
        }

        if (trailingCall) {
            proxy();
        }
    }

    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }

    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();

        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }

            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        } else {
            leadingCall = true;
            trailingCall = false;

            setTimeout(timeoutCallback, delay);
        }

        lastCallTime = timeStamp;
    }

    return proxy;
};

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;

// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];

// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';

/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = function() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];

    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY);
};

/**
 * Adds observer to observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be added.
 * @returns {void}
 */


/**
 * Holds reference to the controller's instance.
 *
 * @private {ResizeObserverController}
 */


/**
 * Keeps reference to the instance of MutationObserver.
 *
 * @private {MutationObserver}
 */

/**
 * Indicates whether DOM listeners have been added.
 *
 * @private {boolean}
 */
ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
        this.observers_.push(observer);
    }

    // Add listeners if they haven't been added yet.
    if (!this.connected_) {
        this.connect_();
    }
};

/**
 * Removes observer from observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be removed.
 * @returns {void}
 */
ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer);

    // Remove observer if it's present in registry.
    if (~index) {
        observers.splice(index, 1);
    }

    // Remove listeners if controller has no connected observers.
    if (!observers.length && this.connected_) {
        this.disconnect_();
    }
};

/**
 * Invokes the update of observers. It will continue running updates insofar
 * it detects changes.
 *
 * @returns {void}
 */
ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_();

    // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.
    if (changesDetected) {
        this.refresh();
    }
};

/**
 * Updates every observer from observers list and notifies them of queued
 * entries.
 *
 * @private
 * @returns {boolean} Returns "true" if any observer has detected changes in
 *  dimensions of it's elements.
 */
ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
    });

    // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.
    activeObservers.forEach(function (observer) { return observer.broadcastActive(); });

    return activeObservers.length > 0;
};

/**
 * Initializes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser || this.connected_) {
        return;
    }

    // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.
    document.addEventListener('transitionend', this.onTransitionEnd_);

    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);

        this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMSubtreeModified', this.refresh);

        this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
};

/**
 * Removes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser || !this.connected_) {
        return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
        this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
        document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
};

/**
 * "Transitionend" event handler.
 *
 * @private
 * @param {TransitionEvent} event
 * @returns {void}
 */
ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
        var propertyName = ref.propertyName; if ( propertyName === void 0 ) propertyName = '';

    // Detect whether transition may affect dimensions of an element.
    var isReflowProperty = transitionKeys.some(function (key) {
        return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
        this.refresh();
    }
};

/**
 * Returns instance of the ResizeObserverController.
 *
 * @returns {ResizeObserverController}
 */
ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
        this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
};

ResizeObserverController.instance_ = null;

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
        var key = list[i];

        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }

    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;

    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);

/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}

/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [], len = arguments.length - 1;
    while ( len-- > 0 ) positions[ len ] = arguments[ len + 1 ];

    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];

        return size + toFloat(value);
    }, 0);
}

/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};

    for (var i = 0, list = positions; i < list.length; i += 1) {
        var position = list[i];

        var value = styles['padding-' + position];

        paddings[position] = toFloat(value);
    }

    return paddings;
}

/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();

    return createRectInit(0, 0, bbox.width, bbox.height);
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth;
    var clientHeight = target.clientHeight;

    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }

    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;

    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width),
        height = toFloat(styles.height);

    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }

        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }

    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;

        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }

        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }

    return createRectInit(paddings.left, paddings.top, width, height);
}

/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }

    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function'; };
})();

/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}

/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }

    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }

    return getHTMLElementContentRect(target);
}

/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(ref) {
    var x = ref.x;
    var y = ref.y;
    var width = ref.width;
    var height = ref.height;

    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);

    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });

    return rect;
}

/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = function(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);

    this.target = target;
};

/**
 * Updates content rectangle and tells whether it's width or height properties
 * have changed since the last broadcast.
 *
 * @returns {boolean}
 */


/**
 * Reference to the last observed content rectangle.
 *
 * @private {DOMRectInit}
 */


/**
 * Broadcasted width of content rectangle.
 *
 * @type {number}
 */
ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);

    this.contentRect_ = rect;

    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
};

/**
 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
 * from the corresponding properties of the last observed content rectangle.
 *
 * @returns {DOMRectInit} Last observed content rectangle.
 */
ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;

    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;

    return rect;
};

var ResizeObserverEntry = function(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);

    // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.
    defineConfigurable(this, { target: target, contentRect: contentRect });
};

var ResizeObserverSPI = function(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();

    if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
};

/**
 * Starts observing provided element.
 *
 * @param {Element} target - Element to be observed.
 * @returns {void}
 */


/**
 * Registry of the ResizeObservation instances.
 *
 * @private {Map<Element, ResizeObservation>}
 */


/**
 * Public ResizeObserver instance which will be passed to the callback
 * function and used as a value of it's "this" binding.
 *
 * @private {ResizeObserver}
 */

/**
 * Collection of resize observations that have detected changes in dimensions
 * of elements.
 *
 * @private {Array<ResizeObservation>}
 */
ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is already being observed.
    if (observations.has(target)) {
        return;
    }

    observations.set(target, new ResizeObservation(target));

    this.controller_.addObserver(this);

    // Force the update of observations.
    this.controller_.refresh();
};

/**
 * Stops observing provided element.
 *
 * @param {Element} target - Element to stop observing.
 * @returns {void}
 */
ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is not being observed.
    if (!observations.has(target)) {
        return;
    }

    observations.delete(target);

    if (!observations.size) {
        this.controller_.removeObserver(this);
    }
};

/**
 * Stops observing all elements.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
};

/**
 * Collects observation instances the associated element of which has changed
 * it's content rectangle.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.gatherActive = function () {
        var this$1 = this;

    this.clearActive();

    this.observations_.forEach(function (observation) {
        if (observation.isActive()) {
            this$1.activeObservations_.push(observation);
        }
    });
};

/**
 * Invokes initial callback function with a list of ResizeObserverEntry
 * instances collected from active resize observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
        return;
    }

    var ctx = this.callbackCtx_;

    // Create ResizeObserverEntry instance for every active observation.
    var entries = this.activeObservations_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });

    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
};

/**
 * Clears the collection of active observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
};

/**
 * Tells whether observer has active observations.
 *
 * @returns {boolean}
 */
ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
};

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = function(callback) {
    if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function.');
    }
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);

    observers.set(this, observer);
};

// Expose public methods of ResizeObserver.
['observe', 'unobserve', 'disconnect'].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        return (ref = observers.get(this))[method].apply(ref, arguments);
        var ref;
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1$1.ResizeObserver !== 'undefined') {
        return global$1$1.ResizeObserver;
    }

    return ResizeObserver;
})();

var asArray = function asArray(value) {
    if (isNullOrUndefined(value)) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

var getMeasuredSize = function getMeasuredSize(element, componentName, suppressZeroSizeWarning) {
    var aspectRatio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var computedStyles = getComputedStyle(element);
    var width = parseFloat(computedStyles.width);
    var height = parseFloat(computedStyles.height);

    height = height || (aspectRatio > 0 ? width / aspectRatio : 0);

    if (width === 0 && !suppressZeroSizeWarning) {
        console.warn(componentName + " had a width of 0. You will probably want to set a width through CSS using either the 'style' or 'className' attribute");
    }

    if (height === 0 && !suppressZeroSizeWarning) {
        console.warn(componentName + " had a height of 0. You will probably want to set a height through CSS using either the 'style' or 'className' attribute\n            Alternatively you can set a CSS width and use the aspectRatio attribute to have the height adapt automatically");
    }

    return { width: width, height: height };
};

function removeDisplayNoneIndices(children, displayNoneCards, unmountedDisplayNoneCards) {
    // TODO: ADD COMMENT HERE. ALSO, IMPLEMENT THIS KIND OF STUFF FOR ALL CONTAINERS - E.G EXTRACT IT?
    if (unmountedDisplayNoneCards.length === 0) {
        return {};
    }

    children = asArray(children);
    var newState = {
        displayNoneCards: [].concat(toConsumableArray(displayNoneCards)),
        unmountedDisplayNoneCards: [].concat(toConsumableArray(unmountedDisplayNoneCards))
    };

    var removeIndex = function removeIndex(index) {
        newState.displayNoneCards = newState.displayNoneCards.filter(function (i) {
            return i !== index;
        });
        newState.unmountedDisplayNoneCards = newState.unmountedDisplayNoneCards.filter(function (u) {
            return u.index !== index;
        });
    };

    unmountedDisplayNoneCards.forEach(function (_ref) {
        var index = _ref.index,
            key = _ref.key,
            childCount = _ref.childCount;

        if (!isNullOrUndefined(key)) {
            // TODO: ALSO CHECK IF IT IS AT A NEW INDEX!!!!!!!!

            if (!children.some(function (child, i) {
                return child.key === key && i === index;
            })) {
                removeIndex(index);
            }
        } else if (childCount !== children.length) {
            removeIndex(index);
        }
    });

    return newState;
}

var defaultBorderElementStyles = {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: '100%',
	height: '100%'
};

var defaultRandomNumbers = [0, -5, 5, 0, -2, -4, -1, 5, 1, 3, 8];
var defaultMessy = false;
var defaultStackLayerOffset = 1;
var defaultStackLayerMaxOffset = 10;

var CardStack = function (_React$Component) {
	inherits(CardStack, _React$Component);

	function CardStack(props) {
		classCallCheck(this, CardStack);

		var _this = possibleConstructorReturn(this, (CardStack.__proto__ || Object.getPrototypeOf(CardStack)).call(this, props));

		_this.state = {
			width: 0,
			height: 0
		};
		return _this;
	}

	createClass(CardStack, [{
		key: 'updateMeasuredSize',
		value: function updateMeasuredSize() {
			var _props = this.props,
			    suppressZeroSizeWarning = _props.suppressZeroSizeWarning,
			    aspectRatio = _props.aspectRatio;

			this.setState(_extends({}, getMeasuredSize(this.el, 'Card stack', suppressZeroSizeWarning, aspectRatio)));
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.updateMeasuredSize();
			this.resizeObserver = new index(function () {
				return _this2.updateMeasuredSize();
			});
			this.resizeObserver.observe(this.el);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.resizeObserver) {
				this.resizeObserver.disconnect();
			}
		}
	}, {
		key: 'getDisplayedCardCount',
		value: function getDisplayedCardCount() {
			// TODO: ADD displayNoneCards here?? May be important if top card is being dragged and
			// while another one is snapping to it!!
			return this.props.cardCount || this.props.children.length; // - this.state.displayNoneCards.length;
		}
	}, {
		key: 'getCardTransformInternal',
		value: function getCardTransformInternal(cardIndex) {
			var _props2 = this.props,
			    _props2$messy = _props2.messy,
			    messy = _props2$messy === undefined ? defaultMessy : _props2$messy,
			    _props2$stackLayerOff = _props2.stackLayerOffset,
			    stackLayerOffset = _props2$stackLayerOff === undefined ? defaultStackLayerOffset : _props2$stackLayerOff,
			    _props2$stackLayerMax = _props2.stackLayerMaxOffset,
			    stackLayerMaxOffset = _props2$stackLayerMax === undefined ? defaultStackLayerMaxOffset : _props2$stackLayerMax;


			var randomNumbers = Array.isArray(messy) ? messy : defaultRandomNumbers;

			return messy ? {
				x: 0,
				y: 0,
				scaleX: 1,
				scaleY: 1,
				rotate: randomNumbers[cardIndex % randomNumbers.length]
			} : {
				x: Math.min(cardIndex * stackLayerOffset, stackLayerMaxOffset),
				y: Math.min(cardIndex * stackLayerOffset, stackLayerMaxOffset),
				scaleX: 1,
				scaleY: 1,
				rotate: 0
			};
		}
	}, {
		key: 'predictCardTransform',
		value: function predictCardTransform(cardIndex) {
			return this.getCardTransformInternal(cardIndex);
		}
	}, {
		key: 'getCardIndexClosestToPoint',
		value: function getCardIndexClosestToPoint() {
			var additionalCardCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			return this.getDisplayedCardCount() - 1 + additionalCardCount;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props3 = this.props,
			    children = _props3.children,
			    style = _props3.style,
			    className = _props3.className,
			    faceUp = _props3.faceUp,
			    borderRadius = _props3.borderRadius,
			    insetBorder = _props3.insetBorder,
			    cardCount = _props3.cardCount,
			    aspectRatio = _props3.aspectRatio;
			var _state = this.state,
			    height = _state.height,
			    width = _state.width;


			var insetBorderStyles = { border: insetBorder };
			if (isBoolean(insetBorder)) {
				insetBorderStyles = insetBorder ? { border: '2px dashed lightgray' } : '';
			} else if (isNumeric(insetBorder)) {
				insetBorderStyles = { border: insetBorder + 'px dashed lightgray' };
			}

			var borderRadiusStyles = { borderRadius: borderRadius };
			if (isBoolean(borderRadius)) {
				borderRadiusStyles = borderRadius ? { borderRadius: '2%' } : {};
			} else if (isNumeric(borderRadius)) {
				borderRadiusStyles = { borderRadius: borderRadius + 'px' };
			}

			return React.createElement(
				CardContainerContext.Provider,
				{
					value: {
						isInCardContainer: true,
						faceUp: faceUp,
						borderRadius: borderRadius,
						getCardTransform: function getCardTransform(index$$1) {
							return _this3.getCardTransformInternal(index$$1);
						},
						setIsDisplayNone: function setIsDisplayNone() {},
						registerUnmount: function registerUnmount() {},
						containerType: 'Card Stack',
						containerSize: { width: width, height: height },
						indexToKeyMap: [],
						cardCount: cardCount
					}
				},
				React.createElement(
					'div',
					{
						style: _extends({
							position: 'relative',
							display: 'inline-block'
						}, style),
						className: className,
						ref: function ref(el) {
							return _this3.el = el;
						}
					},
					React.createElement('div', {
						style: {
							width: '100%',
							paddingTop: (aspectRatio > 0 ? 100 / aspectRatio : 0) + '%'
						}
					}),
					React.createElement('div', {
						style: _extends({}, defaultBorderElementStyles, insetBorderStyles, borderRadiusStyles, {
							boxSizing: 'border-box'
						})
					}),
					asArray(children).map(function (child, i) {
						return React.cloneElement(child, { __cardIndexInContainer: i, key: i });
					})
				)
			);
		}
	}]);
	return CardStack;
}(React.Component);

CardStack.propTypes = {
	children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
	style: propTypes.object,
	className: propTypes.string,
	messy: propTypes.oneOfType([propTypes.bool, propTypes.arrayOf(propTypes.number)]),
	stackLayerOffset: propTypes.number,
	stackLayerMaxOffset: propTypes.number,
	aspectRatio: propTypes.number,
	faceUp: propTypes.oneOfType([propTypes.bool, propTypes.number]),
	borderRadius: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	insetBorder: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.number]),
	uppressZeroSizeWarning: propTypes.bool
};

CardStack.defaultProps = {
	style: {},
	className: '',
	messy: defaultMessy,
	stackLayerOffset: defaultStackLayerOffset,
	stackLayerMaxOffset: defaultStackLayerMaxOffset,
	aspectRatio: 0.7,
	insetBorder: true,
	borderRadius: '2%',
	uppressZeroSizeWarning: false
};

/**
 * TODO:
 * - In card stack
 *  - Maybe introduce resizeObserver - only for warning if size is zero!
 *  - Drop width and height for stack! (but still support aspectRatio!)
 * 
 * - In card row
 * 	- No 'entry' animation
 * 
 * - In card
 *  - Fix background sizing (switch card in storybook)!
 */

var distance = function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

var getIndexOfClosestPoint = function getIndexOfClosestPoint(points, target) {
    var smallest = Number.MAX_VALUE;
    var closestIndex = 0;

    for (var i = 0; i < points.length; i++) {
        var dist = distance(points[i], target);

        if (dist < smallest) {
            smallest = dist;
            closestIndex = i;
        }
    }

    return closestIndex;
};

var createArrayUpTo = function createArrayUpTo(n) {
  return [].concat(toConsumableArray(Array(n).keys()));
};

var DEFAULT_EMPTY_INDICES = [];
var DEFAULT_DIRECTION = 'horizontal';
var DEFAULT_ALIGN = 'center';
var DEFAULT_VERTICAL_ALIGN = 'middle';
var DEFAULT_PREFERRED_GAP = 0.1;
var DEFAULT_CARD_ASPECT_RATIO = 0.7;

var Row = function (_React$Component) {
    inherits(Row, _React$Component);

    function Row(props) {
        classCallCheck(this, Row);

        var _this = possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).call(this, props));

        _this.state = {
            width: 0,
            height: 0,
            displayNoneCards: [],
            unmountedDisplayNoneCards: []
        };
        return _this;
    }

    createClass(Row, [{
        key: 'updateMeasuredSize',
        value: function updateMeasuredSize() {
            var _props = this.props,
                suppressZeroSizeWarning = _props.suppressZeroSizeWarning,
                aspectRatio = _props.aspectRatio;

            this.setState(_extends({}, getMeasuredSize(this.el, 'Card row', suppressZeroSizeWarning, aspectRatio)));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.updateMeasuredSize();
            this.resizeObserver = new index(function () {
                return _this2.updateMeasuredSize();
            });
            this.resizeObserver.observe(this.el);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        }
    }, {
        key: 'getDisplayedCardCount',
        value: function getDisplayedCardCount() {
            return (this.props.cardCount || this.props.children.length) - this.state.displayNoneCards.length;
        }
    }, {
        key: 'getCardTransformInternal',
        value: function getCardTransformInternal(cardIndex) {
            var _props2 = props,
                _props2$emptyIndices = _props2.emptyIndices,
                emptyIndices = _props2$emptyIndices === undefined ? DEFAULT_EMPTY_INDICES : _props2$emptyIndices;

            var displayNoneCardsBefore = this.state.displayNoneCards.filter(function (index$$1) {
                return index$$1 < cardIndex;
            }).length;
            var cardIndexToApply = cardIndex - displayNoneCardsBefore;

            return Row.predictCardTransform(this.props, this.state, this.getDisplayedCardCount() + emptyIndices.length, cardIndexToApply);
        }
    }, {
        key: 'setIsDisplayNone',
        value: function setIsDisplayNone(cardIndex, isDisplayNone) {
            var displayNoneCards = this.state.displayNoneCards;


            this.setState({
                displayNoneCards: isDisplayNone ? [].concat(toConsumableArray(displayNoneCards), [cardIndex]) : displayNoneCards.filter(function (index$$1) {
                    return index$$1 !== cardIndex;
                })
            });
        }
    }, {
        key: 'registerUnmount',
        value: function registerUnmount(index$$1, key) {
            // Schedule displayNoneCards for removal from array. But don't do it here. Must be done
            // at the same time as this component's children prop is updated. Is handled in getDerivedStateFromProps

            this.setState({
                unmountedDisplayNoneCards: [].concat(toConsumableArray(this.state.unmountedDisplayNoneCards), [{ index: index$$1, key: key, childCount: this.props.children.length }])
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props3 = this.props,
                children = _props3.children,
                cardAspectRatio = _props3.cardAspectRatio,
                aspectRatio = _props3.aspectRatio,
                style = _props3.style,
                className = _props3.className,
                cardCount = _props3.cardCount,
                faceUp = _props3.faceUp;
            var _state = this.state,
                height = _state.height,
                width = _state.width;


            var indexToKeyMap = asArray(children).map(function (child, i) {
                return child.key;
            });

            return React.createElement(
                CardContainerContext.Provider,
                {
                    value: {
                        isInCardContainer: true,
                        aspectRatio: cardAspectRatio,
                        getCardTransform: function getCardTransform(index$$1) {
                            return _this3.getCardTransformInternal(index$$1);
                        },
                        setIsDisplayNone: function setIsDisplayNone() {
                            return _this3.setIsDisplayNone.apply(_this3, arguments);
                        },
                        registerUnmount: function registerUnmount() {
                            return _this3.registerUnmount.apply(_this3, arguments);
                        },
                        containerSize: { width: width, height: height },
                        containerType: 'Card Row',
                        indexToKeyMap: indexToKeyMap,
                        cardCount: cardCount,
                        faceUp: faceUp
                    }
                },
                React.createElement(
                    'div',
                    {
                        style: _extends({
                            border: '1px dashed gray',
                            position: 'relative'
                        }, style),
                        className: className,
                        ref: function ref(el) {
                            return _this3.el = el;
                        }
                    },
                    React.createElement('div', {
                        style: {
                            width: '100%',
                            paddingTop: (aspectRatio > 0 ? 100 / aspectRatio : 0) + '%'
                        }
                    }),
                    asArray(children).map(function (child, i) {
                        return React.cloneElement(child, {
                            __cardIndexInContainer: i, key: child.key || i
                        });
                    })
                )
            );
        }
    }], [{
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(props, state) {
            // TODO: ADD COMMENT HERE. ALSO, IMPLEMENT THIS KIND OF STUFF FOR ALL CONTAINERS - E.G EXTRACT IT?
            return removeDisplayNoneIndices(props.children, state.displayNoneCards, state.unmountedDisplayNoneCards);
        }
    }, {
        key: 'getDimensions',
        value: function getDimensions(props, containerSize, cardCount) {
            var _props$preferredGap = props.preferredGap,
                preferredGap = _props$preferredGap === undefined ? DEFAULT_PREFERRED_GAP : _props$preferredGap,
                _props$align = props.align,
                align = _props$align === undefined ? DEFAULT_ALIGN : _props$align,
                _props$verticalAlign = props.verticalAlign,
                verticalAlign = _props$verticalAlign === undefined ? DEFAULT_VERTICAL_ALIGN : _props$verticalAlign,
                _props$cardAspectRati = props.cardAspectRatio,
                cardAspectRatio = _props$cardAspectRati === undefined ? DEFAULT_CARD_ASPECT_RATIO : _props$cardAspectRati,
                _props$direction = props.direction,
                direction = _props$direction === undefined ? DEFAULT_DIRECTION : _props$direction;
            var width = containerSize.width,
                height = containerSize.height;

            var isVertical = direction === 'vertical';
            var cardWidth = isVertical ? width : height * cardAspectRatio;
            var cardHeight = isVertical ? width / cardAspectRatio : height;
            var primaryCardDimension = isVertical ? cardHeight : cardWidth;
            var primaryContainerDimension = isVertical ? height : width;
            var alignment = isVertical ? verticalAlign : align;

            var preferredGapInPixels = preferredGap * primaryCardDimension;

            // Determine the full width/height of the card row - depending on direction, provided we use the preferred gap between the cards
            var preferredSize = cardCount * primaryCardDimension + (cardCount - 1) * preferredGapInPixels;

            // If necessecary shrink the gap (can even go negative) to ensure the total card rowwidth/rowheight is no
            // wider than the row container width/height
            var actualGap = preferredSize <= primaryContainerDimension ? preferredGapInPixels : (primaryContainerDimension - cardCount * primaryCardDimension) / (cardCount - 1);

            // Determine the actual, applied width/height of the card row
            var totalSize = cardCount * primaryCardDimension + (cardCount - 1) * actualGap;

            var alignmentOffset = 0;
            alignmentOffset += ['center', 'middle'].includes(alignment) ? (primaryContainerDimension - totalSize) / 2 : 0;
            alignmentOffset += ['right', 'bottom'].includes(alignment) ? primaryContainerDimension - totalSize : 0;

            return {
                alignmentOffset: alignmentOffset,
                primaryCardDimension: primaryCardDimension,
                actualGap: actualGap,
                cardWidth: cardWidth,
                cardHeight: cardHeight,
                containerWidth: containerSize.width,
                containerHeight: containerSize.height
            };
        }

        // Convert from coordinate system with origo in uppper left corner, to one with origo at the center of the
        // the element (consistent with react-drag-and-snap convention)

    }, {
        key: 'fromLeftToCenterBasedXCoordinate',
        value: function fromLeftToCenterBasedXCoordinate(x, dimensions) {
            return x - dimensions.containerWidth / 2 + dimensions.cardWidth / 2;
        }
    }, {
        key: 'fromTopToCenterBasedYCoordinate',
        value: function fromTopToCenterBasedYCoordinate(y, dimensions) {
            return y - dimensions.containerHeight / 2 + dimensions.cardHeight / 2;
        }
    }, {
        key: 'predictCardTransform',
        value: function predictCardTransform(props, containerSize, cardCount, cardIndex) {
            var dimensions = Row.getDimensions(props, containerSize, cardCount);
            var alignmentOffset = dimensions.alignmentOffset,
                primaryCardDimension = dimensions.primaryCardDimension,
                actualGap = dimensions.actualGap;
            var _props$direction2 = props.direction,
                direction = _props$direction2 === undefined ? DEFAULT_DIRECTION : _props$direction2,
                _props$emptyIndices = props.emptyIndices,
                emptyIndices = _props$emptyIndices === undefined ? DEFAULT_EMPTY_INDICES : _props$emptyIndices;


            var emptySlotsBefore = emptyIndices.filter(function (index$$1) {
                return index$$1 <= cardIndex;
            }).length;
            var offset = alignmentOffset + (cardIndex + emptySlotsBefore) * (primaryCardDimension + actualGap);

            return {
                x: direction !== 'vertical' ? Row.fromLeftToCenterBasedXCoordinate(offset, dimensions) : 0,
                y: direction === 'vertical' ? Row.fromTopToCenterBasedYCoordinate(offset, dimensions) : 0,
                scaleX: containerSize.width > 0 ? dimensions.cardWidth / containerSize.width : 0,
                scaleY: containerSize.height > 0 ? dimensions.cardHeight / containerSize.height : 0
            };
        }
    }, {
        key: 'getCardIndexClosestToPoint',
        value: function getCardIndexClosestToPoint(props, containerSize, cardCount, point) {
            var dimensions = Row.getDimensions(props, containerSize, cardCount);

            var centerPoints = createArrayUpTo(cardCount).map(function (i) {
                return Row.predictCardTransform(props, containerSize, cardCount, i);
            }).map(function (_ref) {
                var x = _ref.x,
                    y = _ref.y;
                return {
                    x: x - dimensions.cardWidth / 2,
                    y: y - dimensions.cardHeight / 2
                };
            });

            return getIndexOfClosestPoint(centerPoints, point);
        }
    }]);
    return Row;
}(React.Component);

Row.propTypes = {
    emptyIndices: propTypes.arrayOf(propTypes.number),
    direction: propTypes.oneOf(['vertical', 'horisontal', 'horizontal']),
    align: propTypes.oneOf(['left', 'center', 'right']),
    verticalAlign: propTypes.oneOf(['top', 'middle', 'bottom']),
    preferredGap: propTypes.number, // Unit is "card widths"
    aspectRatio: propTypes.number, // Used if height/width is 0 and other is defined
    cardAspectRatio: propTypes.number,
    cardCount: propTypes.number,
    faceUp: propTypes.oneOfType([propTypes.bool, propTypes.number]),
    style: propTypes.object,
    className: propTypes.string,
    suppressZeroSizeWarning: propTypes.bool
};

Row.defaultProps = {
    emptyIndices: DEFAULT_EMPTY_INDICES,
    direction: DEFAULT_DIRECTION,
    align: DEFAULT_ALIGN,
    verticalAlign: DEFAULT_VERTICAL_ALIGN,
    preferredGap: DEFAULT_PREFERRED_GAP, //Unit is "card widths" or "card heights" depending on whether direction is vertical or horizontal
    cardAspectRatio: DEFAULT_CARD_ASPECT_RATIO,
    style: {},
    className: '',
    suppressZeroSizeWarning: false
};

/**
 * Externalize react-spring!!! Maybe other things as well??
 * 
 * Best approach right now is to use key when available
 * If there is no key, look at the child count
 * 
 * 
 * 
 */

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

export { Chip, ChipStack, HexTile, SquareTile, Card, CardStack, Row as CardRow, makeStandardDeck };
//# sourceMappingURL=react-board-game-components.esm.js.map
