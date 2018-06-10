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
        this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
        this.updateSizeMeasurement();

        this.resizeEndSubscription = this.windowSizeMonitor.subscribeToResizeEnd(() => {
            this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
            this.snapTargets.forEach(snapTarget => snapTarget.update());
            this.updateSizeMeasurement();
        });
    }

    componentWillUnmount() {
        StyleInjector.remove(this.styleNode);
        this.windowSizeMonitor.unsubscribeToResizeEnd(this.resizeEndSubscription);
        this.snapTargets = [];
    }

    onDragStateUpdate(update) {
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
            totalCount: this.grabbedCount + this.draggedCount + this.releasedCount,
        });
    }

    getDragContainerDOMElement() {
        return this.container;
    }

    getSize() {
        return this.size;
    }

    updateSizeMeasurement() {
        this.size = {
            width: this.container.clientWidth,
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

    snap(firstSnapTargetId, hasEscaped, dragState, draggableDescriptor) {
        // When true it doesn't necessarily mean it will snap (if target allows easyEscape)
        let isInSnappingArea = false;
        let snapping = null;
        let allowsEasyEscape = false;
        let hasEscapedNow;
        let maxPriority = SnapPriorities.lowestPriority;
        let newFirstSnapTargetId = firstSnapTargetId;

        this.snapTargets.forEach((target) => {
            target.continuousUpdateIfEnabled();

            if (target.isSnapCriteriaMet(dragState, draggableDescriptor)) {
                isInSnappingArea = true;
                const priority = target.getSnapPriority(dragState, draggableDescriptor);

                if (priority <= maxPriority) { // Smaller number means higher priority
                    maxPriority = priority;
                    snapping = target.getSnapping(dragState, draggableDescriptor);
                    allowsEasyEscape = target.allowsEasyEscape(draggableDescriptor);
                }
            }
        });

        hasEscapedNow = hasEscaped || !isInSnappingArea;

        if (snapping) {
            const isStillFirstSnapTarget = (
                !firstSnapTargetId || firstSnapTargetId === snapping.snapTargetId
            );
            newFirstSnapTargetId = newFirstSnapTargetId || (snapping ? snapping.snapTargetId : null);

            // If easyEscape is enabled for the snapTarget, and it is still in its realm,
            // disable the snapping
            if (snapping && !hasEscapedNow && allowsEasyEscape && isStillFirstSnapTarget) {
                snapping = null;
            } else {
                hasEscapedNow = true;
            }
        }

        return {
            matrix: snapping ? snapping.matrix : draggableDescriptor.matrix,
            customSnapProps: snapping ? snapping.customSnapProps : {},
            isPositionSnapped: snapping ? snapping.isPositionSnapped : false,
            isSnapping: !!snapping,
            hasEscaped: hasEscapedNow,
            snapTargetId: snapping ? snapping.snapTargetId : null,
            firstSnapTargetId: newFirstSnapTargetId,
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
