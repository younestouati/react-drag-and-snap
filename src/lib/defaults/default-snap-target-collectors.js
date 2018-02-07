import {extend} from '../utils/object-utils';
const noProps = () => {};

const extractStaticProps = (dragStateDescriptor) => ({
    id: dragStateDescriptor.id,
    dragData: dragStateDescriptor.dragData
});

const extractLowFrequencyProps = (dragStateDescriptor) => ({
    dragState: dragStateDescriptor.dragState,
    isSnappingToThisTarget: dragStateDescriptor.isSnappingToThisTarget,
    isSnappingToOtherTarget: dragStateDescriptor.isSnappingToOtherTarget   
});

const staticProps = (dragStateDescriptors) => dragStateDescriptors.map(extractStaticProps);

const staticAndLowFrequencyProps = (dragStateDescriptors) => dragStateDescriptors.map((dragStateDescriptor) => extend(
    extractStaticProps(dragStateDescriptor),
    extractLowFrequencyProps(dragStateDescriptor)
));

const allProps = (dragStateDescriptors) => dragStateDescriptors;

const snapTargetCollectors = {
    noProps,
    staticProps,
    staticAndLowFrequencyProps,
    allProps
};

export {snapTargetCollectors};