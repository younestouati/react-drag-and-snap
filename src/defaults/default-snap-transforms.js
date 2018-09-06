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

const withCustomSnapProps = (_snapTransform, _customSnapProps) => (...args) => {
    const snapTransform = isFunction(_snapTransform) ? _snapTransform(...args) : _snapTransform;
    const customSnapProps = isFunction(_customSnapProps) ? _customSnapProps(...args) : _customSnapProps;
    return { ...snapTransform, customSnapProps };
};

const SnapTransforms = {
    snapAllButScale,
    snapAll,
    noSnapping,
    snapPosition,
    snapRotation,
    snapScale,
    snapPositionAndRotation,
    snapPositionAndScale,
    snapScaleAndRotation,
    withCustomSnapProps,
};

export default SnapTransforms;
