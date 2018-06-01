const noProps = () => {};

const staticAndLowFrequencyProps = draggable => ({
    dragState: draggable.dragState,
});

const allProps = draggable => draggable;

const draggableCollectors = {
    noProps,
    staticAndLowFrequencyProps,
    allProps,
};

export default draggableCollectors;
