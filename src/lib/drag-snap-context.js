import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inverse, transform} from 'transformation-matrix';
import {getTransformationMatrix} from './utils/matrix-utils';
import {lowestPriority} from './defaults/default-snap-priority';
import {StyleInjector} from './helpers/misc/style-injector';
import {WindowSizeMonitor} from './helpers/misc/window-size-monitor';
import {dragModeStyles} from './drag-snap-logic/drag-modes';

class DragSnapContext extends Component {
    constructor(props) {
        super(props);

        this.snapTargets = [];
        this.grabbedCount = 0;
        this.draggedCount = 0;
        this.releasedCount = 0;
        this.styleInjector = new StyleInjector();
        this.windowSizeMonitor = new WindowSizeMonitor();
    }

    getChildContext() {
        return {
            snap: this.snap.bind(this),
            windowToContext: this.windowToContext.bind(this),
            contextToWindow: this.contextToWindow.bind(this),
            onDragStateUpdate: this.onDragStateUpdate.bind(this),
            relayDropEvent: this.relayDropEvent.bind(this),
            registerAsSnapTarget: this.registerAsSnapTarget.bind(this),
            unregisterAsSnapTarget: this.unregisterAsSnapTarget.bind(this),
            getDragContainerDOMElement: this.getDragContainerDOMElement.bind(this),
            getSize: this.getSize.bind(this),
            relayDraggableUpdateToTargets: this.relayDraggableUpdateToTargets.bind(this),
            relayDraggableRemovalToTargets: this.relayDraggableRemovalToTargets.bind(this)
        };
    }

    componentDidMount() {
        this.styleNode = this.styleInjector.inject(dragModeStyles);
        this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
        this.updateSizeMeasurement();

        this.resizeEndSubscription = this.windowSizeMonitor.subscribeToResizeEnd(() => {
            this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
            this.snapTargets.forEach((snapTarget) => snapTarget.update());
            this.updateSizeMeasurement();
        });
    }

    updateSizeMeasurement() {
        this.size = {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        };
    }

    componentWillUnmount() {
        this.styleInjector.remove(this.styleNode);
        this.windowSizeMonitor.unsubscribeToResizeEnd(this.resizeEndSubscription);
        this.snapTargets = [];
    }

    getDragContainerDOMElement() {
        return this.container;
    }

    getSize() {
        return this.size;
    }

    registerAsSnapTarget(id, snapTargetComponent) {
        this.snapTargets.push(snapTargetComponent);
    }

    unregisterAsSnapTarget(id) {
        this.snapTargets = this.snapTargets.filter(target => target.getId() !== id);
    }

    relayDropEvent(snapTargetId, ...args) {
        const snapTarget = this.snapTargets.find((target) => target.getId() === snapTargetId);
        if (snapTarget) {
            snapTarget.onDropEvent(...args);
        }
    }

    relayDraggableUpdateToTargets(...args) {
        this.snapTargets.forEach((target) => target.updateItem(...args));
    }

    relayDraggableRemovalToTargets(id) {
        this.snapTargets.forEach((target) => target.removeItem(id));
    }

    snap(firstSnapTargetId, hasEscaped, dragState, draggableDescriptor) {
        let isInSnappingArea = false; //When true it doesn't necessarily mean it will snap (if target allows easyEscape)
        let snapping = null;
        let allowsEasyEscape = false;
        let hasEscapedNow;
        let maxPriority = lowestPriority;
        let _firstSnapTargetId = firstSnapTargetId;

        this.snapTargets.forEach((target) => {
            target.continuousUpdateIfEnabled();

            if (target.isSnapCriteriaMet(dragState, draggableDescriptor)) {
                isInSnappingArea = true;
                const priority = target.getSnapPriority(dragState, draggableDescriptor);

                if (priority <= maxPriority) {  //Smaller number means higher priority
                    maxPriority = priority;
                    snapping = target.getSnapping(dragState, draggableDescriptor);
                    allowsEasyEscape = target.allowsEasyEscape(draggableDescriptor);
                }
            }
        });

        hasEscapedNow = hasEscaped || !isInSnappingArea;

        if (snapping) {
            const isStillFirstSnapTarget = (!firstSnapTargetId || firstSnapTargetId === snapping.snapTargetId);
            _firstSnapTargetId = _firstSnapTargetId || (snapping ? snapping.snapTargetId : null)
            
            //If easyEscape is enabled for the snapTarget, and it is still in its realm, disable the snapping
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
            firstSnapTargetId: _firstSnapTargetId
        };
    }

    contextToWindow(matrix) {
        return transform(inverse(this.inverseContainerMatrix), matrix);
    }

    windowToContext(matrix) {
        return transform(this.inverseContainerMatrix, matrix);
    }

    onDragStateUpdate(update) {
        switch (update) {
            case 'grab':
                this.grabbedCount++;
                break;
            case 'start':
                this.grabbedCount--;
                this.draggedCount++;
                break;
            case 'cancel':
                this.grabbedCount--;
                break;
            case 'ending':
                this.draggedCount--;
                this.releasedCount++
                break;
            case 'resume':
                this.draggedCount++;
                this.releasedCount--;
                break;
            case 'ended':
                this.releasedCount--;
                break;
            default:
                break;
        }

        this.props.onChange({
            grabbedCount: this.grabbedCount,
            draggedCount: this.draggedCount,
            releasedCount: this.releasedCount,
            totalCount: this.grabbedCount + this.draggedCount + this.releasedCount
        });
    }

    render() {
        return (
            <div
                style={{position: 'relative', width: '100%', height: '100%'}}
                ref={container => (this.container = container)}
            >
                {this.props.children}
            </div>
        );
    }
}

DragSnapContext.childContextTypes = {
    snap: PropTypes.func,
    windowToContext: PropTypes.func,
    contextToWindow: PropTypes.func,
    onDragStateUpdate: PropTypes.func,
    relayDropEvent: PropTypes.func,
    relayDraggableUpdateToTargets: PropTypes.func,
    relayDraggableRemovalToTargets: PropTypes.func,
    getDragContainerDOMElement: PropTypes.func,
    getSize: PropTypes.func,
    registerAsSnapTarget: PropTypes.func,
    unregisterAsSnapTarget: PropTypes.func
};

DragSnapContext.propTypes = {
    onChange: PropTypes.func
};

DragSnapContext.defaultProps = {
    onChange: () => {}
};

export default DragSnapContext;
