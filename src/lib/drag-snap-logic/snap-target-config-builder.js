import {Criteria} from '../defaults/default-snap-criteria';
import {defaultSnapping} from '../defaults/default-snap-transformers';
import {extend} from '../utils/object-utils';

const defaultConfig = {
	snapCriteria: Criteria.isCenterWithinRadius('100%'),
	snapTransform: defaultSnapping //TODO: CONSIDER WHY NO ON A SnapTransformers object like for Criteria
};

const snapTargetConfigBuilder = (customConfig = {}) => {
	//TODO: USE INVARIANT HERE TO ENSURE THAT ALL DESCRIPTORS ARE EITHER FUNCTIONS OR MAYBE OBJECTS

	const config = extend(defaultConfig, customConfig);
	config.releaseSnapTransform = config.releaseSnapTransform || config.snapTransform;
	config.dragSnapTransform = config.dragSnapTransform || config.snapTransform;
	config.releaseSnapCriteria = config.releaseSnapCriteria || config.snapCriteria;
	config.dragSnapCriteria = config.dragSnapCriteria || config.snapCriteria;

	return config;
};

 export {snapTargetConfigBuilder};