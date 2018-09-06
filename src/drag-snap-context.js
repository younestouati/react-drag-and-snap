import React from 'react';
import PropTypes from 'prop-types';
import { inverse, transform } from 'transformation-matrix';
import { getTransformationMatrix } from './utils/matrix-utils';
import SnapPriorities from './defaults/default-snap-priorities';
import StyleInjector from './helpers/misc/style-injector';
import WindowSizeMonitor from './helpers/misc/window-size-monitor';
import { dragModeStyles } from './drag-snap-logic/drag-modes';
import CustomPropTypes from './prop-types/custom-prop-types';

const MainContext = React.createContext();

class DragSnapContext extends React.Component {
    constructor(props) {
        super(props);

        this.snapTargets = [];
        this.grabbedCount = 0;
        this.draggedCount = 0;
        this.releasedCount = 0;
        this.styleInjector = new StyleInjector();
        this.windowSizeMonitor = new WindowSizeMonitor();

        this.boundSnap = this.snap.bind(this);
        this.boundWindowToContext = this.windowToContext.bind(this);
        this.boundContextToWindow = this.contextToWindow.bind(this);
        this.boundOnDragStateUpdate = this.onDragStateUpdate.bind(this);
        this.boundRelayDropEvent = this.relayDropEvent.bind(this);
        this.boundRegisterAsSnapTarget = this.registerAsSnapTarget.bind(this);
        this.boundUnregisterAsSnapTarget = this.unregisterAsSnapTarget.bind(this);
        this.boundGetDragContainerDOMElement = this.getDragContainerDOMElement.bind(this);
        this.boundGetSize = this.getSize.bind(this);
        this.boundRelayDraggableUpdateToTargets = this.relayDraggableUpdateToTargets.bind(this);
        this.boundRelayDraggableRemovalToTargets = this.relayDraggableRemovalToTargets.bind(this);
    }

    componentDidMount() {
        this.styleNode = this.styleInjector.inject(dragModeStyles);
        this.updateSizeMeasurement();

        this.resizeEndSubscription = this.windowSizeMonitor.subscribeToResizeEnd(() => {
            this.measurePositions();
            this.updateSizeMeasurement();
        });
    }

    componentWillUnmount() {
        StyleInjector.remove(this.styleNode);
        this.windowSizeMonitor.unsubscribeToResizeEnd(this.resizeEndSubscription);
        this.snapTargets = [];
    }

    onDragStateUpdate(update) {
        if (this.getTotalCount() === 0) { // This signifies the start of a new drag session
            // Remeasure positions of snap targets and of the context it self when a new
            // drag session starts. This is a potential performance issue, but needed
            // to account for changed scroll positions etc. since last drag gesture
            this.measurePositions();
        }

        switch (update) {
        case 'grab':
            this.grabbedCount += 1;
            break;
        case 'start':
            this.grabbedCount -= 1;
            this.draggedCount += 1;
            break;
        case 'cancel':
            this.grabbedCount -= 1;
            break;
        case 'ending':
            this.draggedCount -= 1;
            this.releasedCount += 1;
            break;
        case 'resume':
            this.draggedCount += 1;
            this.releasedCount -= 1;
            break;
        case 'ended':
            this.releasedCount -= 1;
            break;
        default:
            break;
        }

        this.props.onChange({
            grabbedCount: this.grabbedCount,
            draggedCount: this.draggedCount,
            releasedCount: this.releasedCount,
            totalCount: this.getTotalCount(),
        });
    }

    getTotalCount() {
        return this.grabbedCount + this.draggedCount + this.releasedCount;
    }

    getDragContainerDOMElement() {
        return this.container;
    }

    getSize() {
        return this.size;
    }

    measurePositions() {
        this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
        this.snapTargets.forEach(snapTarget => snapTarget.update());
    }

    updateSizeMeasurement() {
        this.size = {
            width: this.container.clientWidth, // TODO: COMPUTE HERE (FOR SUBPIXEL PRECISION)??
            height: this.container.clientHeight,
        };
    }

    registerAsSnapTarget(id, snapTargetComponent) {
        this.snapTargets.push(snapTargetComponent);
    }

    unregisterAsSnapTarget(id) {
        this.snapTargets = this.snapTargets.filter(target => target.getId() !== id);
    }

    relayDropEvent(snapTargetId, ...args) {
        const snapTarget = this.snapTargets.find(target => target.getId() === snapTargetId);
        if (snapTarget) {
            snapTarget.onDropEvent(...args);
        }
    }

    relayDraggableUpdateToTargets(...args) {
        this.snapTargets.forEach(target => target.updateItem(...args));
    }

    relayDraggableRemovalToTargets(id) {
        this.snapTargets.forEach(target => target.removeItem(id));
    }

    snap(dragState, draggableDescriptor) {
        let snapping = null;
        let maxPriority = SnapPriorities.lowestPriority;

        this.snapTargets.forEach((target) => {
            target.continuousUpdateIfEnabled();

            if (target.isSnapCriteriaMet(dragState, draggableDescriptor)) {
                const priority = target.getSnapPriority(dragState, draggableDescriptor);

                if (priority <= maxPriority) { // Smaller number means higher priority
                    maxPriority = priority;
                    snapping = target.getSnapping(dragState, draggableDescriptor);
                }
            }
        });

        return {
            matrix: snapping ? snapping.matrix : draggableDescriptor.matrix,
            customSnapProps: snapping ? snapping.customSnapProps : {},
            isPositionSnapped: snapping ? snapping.isPositionSnapped : false,
            isSnapping: !!snapping,
            snapTargetId: snapping ? snapping.snapTargetId : null,
        };
    }

    contextToWindow(matrix) {
        return transform(inverse(this.inverseContainerMatrix), matrix);
    }

    windowToContext(matrix) {
        return transform(this.inverseContainerMatrix, matrix);
    }

    render() {
        return (
            <MainContext.Provider
                value={{
                    snap: this.boundSnap,
                    windowToContext: this.boundWindowToContext,
                    contextToWindow: this.boundContextToWindow,
                    onDragStateUpdate: this.boundOnDragStateUpdate,
                    relayDropEvent: this.boundRelayDropEvent,
                    registerAsSnapTarget: this.boundRegisterAsSnapTarget,
                    unregisterAsSnapTarget: this.boundUnregisterAsSnapTarget,
                    getDragContainerDOMElement: this.boundGetDragContainerDOMElement,
                    getSize: this.boundGetSize,
                    relayDraggableUpdateToTargets: this.boundRelayDraggableUpdateToTargets,
                    relayDraggableRemovalToTargets: this.boundRelayDraggableRemovalToTargets,
                }}
            >
                <div
                    style={{
                        position: 'relative', width: '100%', height: '100%', display: 'inline-block',
                    }}
                    ref={container => (this.container = container)}
                >
                    {this.props.children}
                </div>
            </MainContext.Provider>
        );
    }
}

DragSnapContext.propTypes = {
    onChange: PropTypes.func,
    /* eslint-disable react/require-default-props */
    children: CustomPropTypes.children,
    /* eslint-enable react/require-default-props */
};

DragSnapContext.defaultProps = {
    onChange: () => {},
};

export { MainContext };
export default DragSnapContext;
