import {extend} from '../utils/object-utils';
const noProps = () => {};

const extractStaticProps = (draggable) => ({
    id: draggable.id,
    dragData: draggable.dragData,
    targetWidth: draggable.targetWidth,
    targetHeight: draggable.targetHeight 
});

const extractLowFrequencyProps = (draggable) => ({
    dragState: draggable.dragState,
    isSnappingToThisTarget: draggable.isSnappingToThisTarget,
    isSnappingToOtherTarget: draggable.isSnappingToOtherTarget   
});

const staticProps = (draggables) => draggables.map(extractStaticProps);

const staticAndLowFrequencyProps = (draggables) => draggables.map((draggable) => extend(
    extractStaticProps(draggable),
    extractLowFrequencyProps(draggable)
));

const allProps = (draggables) => draggables;

const snapTargetCollectors = {
    noProps,
    staticProps,
    staticAndLowFrequencyProps,
    allProps
};

export {snapTargetCollectors};