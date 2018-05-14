const lowestPriority = Number.MAX_VALUE;
const highestPriority = 1;
const defaultPriority = 10;
const distanceBased = ({distance}) => Math.max(1, distance);
const distanceBasedWithOffset = (offset) => (...args) => offset + distanceBased(...args);

const SnapPriorities = {
    lowestPriority,
    highestPriority,
    defaultPriority,
    distanceBased,
    distanceBasedWithOffset
};

export default SnapPriorities;
