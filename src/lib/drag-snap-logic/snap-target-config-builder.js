import {Criteria} from '../defaults/default-snap-criteria';
import {defaultSnapping} from '../defaults/default-snap-descriptors';
import {extend} from '../utils/object-utils';

const defaultConfig = {
	snapCriteria: Criteria.isCenterWithinRadius('100%'),
	snapDescriptor: defaultSnapping //TODO: CONSIDER WHY NO ON A SnapDescriptor object like for Criteria
};

const snapTargetConfigBuilder = (customConfig = {}) => {
	//TODO: USE INVARIANT HERE TO ENSURE THAT ALL DESCRIPTORS ARE EITHER FUNCTIONS OR MAYBE OBJECTS

	const config = extend(defaultConfig, customConfig);
	config.releaseSnapDescriptor = config.releaseSnapDescriptor || config.snapDescriptor;
	config.dragSnapDescriptor = config.dragSnapDescriptor || config.snapDescriptor;
	config.releaseSnapCriteria = config.releaseSnapCriteria || config.snapCriteria;
	config.dragSnapCriteria = config.dragSnapCriteria || config.snapCriteria;

	return config;
};

 export {snapTargetConfigBuilder};