import {isArray} from './type-utils';

const toArray = (val) => isArray(val) ? val : [val];

export {toArray};