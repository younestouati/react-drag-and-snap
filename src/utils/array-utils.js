import { isArray } from './type-utils';

const arrayUtils = {
    toArray: val => (isArray(val) ? val : [val]),
};


export default arrayUtils;
