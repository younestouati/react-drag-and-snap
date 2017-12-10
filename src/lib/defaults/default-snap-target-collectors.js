import {extend} from '../utils/object-utils';
const noProps = () => {};

const extractStaticProps = (draggable) => ({
    id: draggable.id,
    dragData: draggable.dragData,
    targetWidth: draggable.targetWidth,
    targetHeight: draggable.targetHeight 
});

const extractBooleanProps = (draggable) => ({
    isSnappingToThisTarget: draggable.isSnappingToThisTarget,
    isSnappingToOtherTarget: draggable.isSnappingToOtherTarget   
});

const staticProps = (draggables) => draggables.map(extractStaticProps);

const staticAndBooleanProps = (draggables) => draggables.map((draggable) => extend(
    extractStaticProps(draggable),
    extractBooleanProps(draggable)
));

const allProps = (draggables) => draggables;

const snapTargetCollectors = {
    noProps,
    staticProps,
    staticAndBooleanProps,
    allProps
};

export {snapTargetCollectors};