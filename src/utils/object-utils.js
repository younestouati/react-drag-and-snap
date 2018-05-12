const shallowClone = (obj) => Object.assign({}, obj);
const extend = (...objects) => Object.assign({}, ...objects);
const iterate = (obj, callback) => Object.keys(obj).forEach((key) => callback(obj[key], key));

const shallowCloneExcluding = (obj, excludeKeys) => {
	const returnObject = {};
	iterate(obj, (val, key) => {
		if (excludeKeys.indexOf(key) === -1) {
			returnObject[key] = val;
		}
	});

	return returnObject;
};

const shallowEqual = (obj1, obj2) => {
	if (obj1 === obj2) {
		return true;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	return keys1.every(k => obj2.hasOwnProperty(k) && obj1[k] === obj2[k]);
}

export {extend, iterate, shallowClone, shallowCloneExcluding, shallowEqual};