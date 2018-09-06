import arrayUtils from '../utils/array-utils';

const isPercentageString = value => typeof value === 'string' && value.slice(-1) === '%';

const parsePercentageString = (value) => {
    const percentage = parseFloat(value);

    if (Number.isNaN(percentage)) {
        throw new Error('invalid-percentage');
    }

    return percentage;
};

const always = () => true;
const never = () => false;

const isCenterOverTarget = ({ transform }, { width, height }) => {
    const { x, y } = transform;
    return x > -width / 2 && x < width / 2 && y > -height / 2 && y < height / 2;
};

const isCenterWithinRadius = (radius, hysteresisRadius) => (
    { distance, isSnappingToThisTarget },
    { width, height }
) => {
    let radiusToApply = (isSnappingToThisTarget && hysteresisRadius) ? hysteresisRadius : radius;

    if (isPercentageString(radiusToApply)) {
        const diagonal = Math.sqrt((width ** 2) + (height ** 2));
        const percentage = parsePercentageString(radiusToApply);

        radiusToApply = ((diagonal / 2) / 100) * percentage;
    }

    return distance < radiusToApply;
};

const isNoOtherDraggableSnapping = ({ id }, _, { draggedItems }) => !draggedItems
    .filter(d => d.id !== id)
    .some(d => d.isSnappingToThisTarget);

/*
 * Usually a target doesn't need to worry about whether or not the draggable is snapping to another target.
 * It is only possible to for draggables to snap to one target at a time, and if multiple targets want the same
 * draggable to snap simultaneously, the conflict is resolved based on the targets' snap priorities. The following snap
 * criteria function allows a target to be 'polite', so that it doesn't take over a draggable that is already
 * (was in previous 'frame') snapping to another target with a lower snap priority.
 */
const draggableIsNotSnappingToOtherTarget = ({ isSnappingToOtherTarget }) => !isSnappingToOtherTarget;

const isDragDataProp = (prop, value) => ({ dragData }) => arrayUtils.toArray(value).indexOf(dragData[prop]) > -1;

const SnapCriteria = {
    always,
    never,
    isCenterOverTarget,
    isCenterWithinRadius,
    isDragDataProp,
    isNoOtherDraggableSnapping,
    draggableIsNotSnappingToOtherTarget,
};

export default SnapCriteria;
