import { distance } from '../utils/point-utils';
import { isFunction } from '../utils/type-utils';

const noSnapping = ({ transform }) => transform;

const snapAllButScale = ({ transform }) => (
    {
        x: 0,
        y: 0,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
        skewX: 0,
        skewY: 0,
        rotate: 0,
    }
);

const snapAll = () => ({ scale: 1 });
const snapPosition = ({ transform }) => ({ ...transform, x: 0, y: 0 });
const snapRotation = ({ transform }) => ({ ...transform, rotate: 0 });
const snapScale = ({ transform }) => ({ ...transform, scale: 1 });
const snapPositionAndRotation = ({ transform }) => ({
    ...transform, x: 0, y: 0, rotate: 0,
});
const snapPositionAndScale = ({ transform }) => ({
    ...transform, x: 0, y: 0, scale: 1,
});
const snapScaleAndRotation = ({ transform }) => ({ ...transform, scale: 1, rotate: 0 });

const snapProportionally = (denominator, innerRadius = 0) => (draggable) => {
    const { transform } = draggable;
    const {
        x, y, scaleX, scaleY, skewX, skewY, rotate,
    } = transform;
    const dist = distance({ x, y });

    if (dist < innerRadius) {
        return snapAll(draggable);
    }
    return {
        x: (x * dist) / denominator,
        y: (y * dist) / denominator,
        scaleX: scaleX + ((1 - scaleX) * (1 - (dist / denominator))),
        scaleY: scaleY + ((1 - scaleY) * (1 - (dist / denominator))),
        skewX: (skewX * dist) / denominator,
        skewY: (skewY * dist) / denominator,
        rotate: (rotate * dist) / denominator,
    };
};

const snapRotationProportionally = (denominator, innerRadius = 0) => (draggable) => {
    const { transform } = draggable;
    const dist = distance(transform);

    return dist < innerRadius
        ? snapAllButScale(draggable)
        : { ...transform, rotate: (transform.rotate * dist) / denominator };
};

const snapScaleProportionally = (denominator, innerRadius = 0) => (draggable) => {
    const { transform } = draggable;
    const {
        x, y, scaleX, scaleY,
    } = transform;
    const dist = distance({ x, y });

    return dist < innerRadius
        ? snapAll(draggable)
        : {
            ...draggable.transform,
            scaleX: scaleX + ((1 - scaleX) * (1 - (dist / denominator))),
            scaleY: scaleY + ((1 - scaleY) * (1 - (dist / denominator))),
        };
};

const snapScaleAndRotationProportionally = (denominator, innerRadius = 0) => (draggable) => {
    const { transform } = draggable;
    const {
        x, y, scaleX, scaleY, rotate,
    } = transform;
    const dist = distance({ x, y });

    return dist < innerRadius
        ? snapAll(draggable)
        : {
            ...draggable.transform,
            scaleX: scaleX + ((1 - scaleX) * (1 - (dist / denominator))),
            scaleY: scaleY + ((1 - scaleY) * (1 - (dist / denominator))),
            rotate: (rotate * dist) / denominator,
        };
};


const withCustomSnapProps = (_snapTransform, _customSnapProps) => (...args) => {
    const snapTransform = isFunction(_snapTransform) ? _snapTransform(...args) : _snapTransform;
    const customSnapProps = isFunction(_customSnapProps) ? _customSnapProps(...args) : _customSnapProps;
    return { ...snapTransform, customSnapProps };
};

const SnapTransformers = {
    snapAllButScale,
    snapAll,
    noSnapping,
    snapPosition,
    snapRotation,
    snapScale,
    snapPositionAndRotation,
    snapPositionAndScale,
    snapScaleAndRotation,
    snapProportionally,
    snapRotationProportionally,
    snapScaleProportionally,
    snapScaleAndRotationProportionally,
    withCustomSnapProps,
};

export default SnapTransformers;
