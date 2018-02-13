import {extend} from '../utils/object-utils';
const noProps = () => {};

const extractStaticProps = (draggableDescriptor) => ({
    id: draggableDescriptor.id,
    dragData: draggableDescriptor.dragData
});

const extractLowFrequencyProps = (draggableDescriptor) => ({
    dragState: draggableDescriptor.dragState,
    isSnappingToThisTarget: draggableDescriptor.isSnappingToThisTarget,
    isSnappingToOtherTarget: draggableDescriptor.isSnappingToOtherTarget   
});

const staticProps = (draggableDescriptors) => draggableDescriptors.map(extractStaticProps);

const staticAndLowFrequencyProps = (draggableDescriptors) => draggableDescriptors.map((draggableDescriptor) => extend(
    extractStaticProps(draggableDescriptor),
    extractLowFrequencyProps(draggableDescriptor)
));

const allProps = (draggableDescriptors) => draggableDescriptors;

const snapTargetCollectors = {
    noProps,
    staticProps,
    staticAndLowFrequencyProps,
    allProps
};

export {snapTargetCollectors};