const noProps = () => {};

const extractStaticProps = draggableDescriptor => ({
    id: draggableDescriptor.id,
    dragData: draggableDescriptor.dragData,
});

const extractLowFrequencyProps = draggableDescriptor => ({
    dragState: draggableDescriptor.dragState,
    isSnappingToThisTarget: draggableDescriptor.isSnappingToThisTarget,
    isSnappingToOtherTarget: draggableDescriptor.isSnappingToOtherTarget,
});

const staticProps = draggableDescriptors => draggableDescriptors.map(extractStaticProps);

const staticAndLowFrequencyProps = draggableDescriptors => draggableDescriptors.map(draggableDescriptor => ({
    ...extractStaticProps(draggableDescriptor),
    ...extractLowFrequencyProps(draggableDescriptor),
}));

const allProps = draggableDescriptors => draggableDescriptors;

const SnapTargetCollectors = {
    noProps,
    staticProps,
    staticAndLowFrequencyProps,
    allProps,
};

export default SnapTargetCollectors;
