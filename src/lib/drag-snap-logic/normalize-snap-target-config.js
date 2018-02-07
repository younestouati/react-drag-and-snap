import invariant from 'invariant';
import Criteria from '../defaults/default-snap-criteria';
import SnapTransformers from '../defaults/default-snap-transformers';
import {extend} from '../utils/object-utils';
import {isFunction, isObject, isArray} from '../utils/type-utils';

const defaultConfig = {
	snapCriteria: Criteria.isCenterWithinRadius('100%'),
	snapTransform: SnapTransformers.snapAllButScale
};

const normalizeSnapTargetConfig = (customConfig = {}) => {
	const config = extend(defaultConfig, customConfig);
	config.dragSnapCriteria = config.dragSnapCriteria || config.snapCriteria;
	config.releaseSnapCriteria = config.releaseSnapCriteria || config.snapCriteria;
	config.dragSnapTransform = config.dragSnapTransform || config.snapTransform;
	config.releaseSnapTransform = config.releaseSnapTransform || config.snapTransform;

	invariant(isFunction(config.dragSnapCriteria) || (isArray(config.dragSnapCriteria) && config.dragSnapCriteria.every(isFunction)), 
		`Invalid property 'dragSnapCriteria' in snapTarget config. Must be a function or an array of functions. Was: ${config.dragSnapCriteria}`
	);
	invariant(isFunction(config.releaseSnapCriteria) || (isArray(config.releaseSnapCriteria) && config.releaseSnapCriteria.every(isFunction)),
		`Invalid property 'releaseSnapCriteria' in snapTarget config. Must be a function or an array of functions. Was: ${config.releaseSnapCriteria}`
	);
  
	invariant(isFunction(config.dragSnapTransform) || isObject(config.dragSnapTransform), 
		`Invalid property 'dragSnapTransform' in snapTarget config. Must be a function or an object. Was: ${config.dragSnapTransform}`
	);

	invariant(isFunction(config.releaseSnapTransform) || isObject(config.releaseSnapTransform), 
		`Invalid property 'releaseSnapTransform' in snapTarget config. Must be a function or an object. Was: ${config.releaseSnapTransform}`
	);

	return config;
};

 export {normalizeSnapTargetConfig};