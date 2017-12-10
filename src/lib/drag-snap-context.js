import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CustomPropTypes} from './prop-types/custom-prop-types';
import {inverse, transform} from 'transformation-matrix';
import {getTransformationMatrix} from './drag-snap-logic/matrix';
import {lowestPriority} from './defaults/default-snap-priority';
import {StyleInjector} from './helpers/style-injector';
import {WindowSizeMonitor} from './helpers/window-size-monitor';
import {dragModeStyles} from './drag-snap-logic/drag-modes';

class DragSnapContext extends Component {
    constructor(props) {
        super(props);

        this.snapTargets = [];
        this.numberBeingDragged = 0;
        this.numberNotAtRest = 0;
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
            getDefaultSpringConfig: this.getDefaultSpringConfig.bind(this),
            getDefaultStickyValue: this.getDefaultStickyValue.bind(this),
            getDragContainerDOMElement: this.getDragContainerDOMElement.bind(this),
            relayDraggableUpdateToTargets: this.relayDraggableUpdateToTargets.bind(this),
            relayDraggableRemovalToTargets: this.relayDraggableRemovalToTargets.bind(this)
        };
    }

    componentDidMount() {
        this.styleNode = this.styleInjector.inject(dragModeStyles);
        this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));

        this.resizeEndSubscription = this.windowSizeMonitor.subscribeToResizeEnd(() => {
            this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
            this.snapTargets.forEach((snapTarget) => snapTarget.update());
        });
    }

    componentWillUnmount() {
        this.styleInjector.remove(this.styleNode);
        this.windowSizeMonitor.unsubscribeToResizeEnd(this.resizeEndSubscription);
        this.snapTargets = [];
    }

    getDragContainerDOMElement() {
        return this.container;
    }

    getDefaultSpringConfig() {
        return this.props.springConfig;
    }

    getDefaultStickyValue() {
        return this.props.sticky;
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

    snap(hasEscaped, isReleased, draggableDescriptor) {
        let isInSnappingArea = false; //When true it doesn't necessarily mean it will snap (if target allows easyEscape)
        let snapping = null;
        let maxPriority = lowestPriority;

        this.snapTargets.forEach((target) => {
            target.continuousUpdateIfEnabled();

            if (target.isSnapCriteriaMet(isReleased, draggableDescriptor)) {
                isInSnappingArea = true;

                if (hasEscaped || !target.allowsEasyEscape(draggableDescriptor)) {
                    const priority = target.getSnapPriority(isReleased, draggableDescriptor);

                    if (priority <= maxPriority) {  //Smaller number means higher priority
                        maxPriority = priority;
                        snapping = target.getSnapping(isReleased, draggableDescriptor);
                    }
                }
            }
        });

        return {
            matrix: snapping ? snapping.matrix : draggableDescriptor.matrix,
            customSnapProps: snapping ? snapping.customSnapProps : {},
            isPositionSnapped: snapping ? snapping.isPositionSnapped : false,
            isSnapping: !!snapping,
            isInSnappingArea,
            snapTargetId: snapping ? snapping.snapTargetId : null,
        };
    }

    contextToWindow(matrix) {
        return transform(inverse(this.inverseContainerMatrix), matrix);
    }

    windowToContext(matrix) {
        return transform(this.inverseContainerMatrix, matrix);
    }

    onDragStateUpdate(update) {
        const {onDragStart, onDragEnding, onDragResume, onDragEnded} = this.props;

        switch (update) {
            case 'start':
                this.numberBeingDragged === 0 && onDragStart();
                this.numberBeingDragged++;
                this.numberNotAtRest++;
                break;
            case 'ending':
                this.numberBeingDragged === 1 && onDragEnding();
                this.numberBeingDragged--;
                break;
            case 'resume':
                this.numberBeingDragged === 0 && onDragResume();
                this.numberBeingDragged++;
                break;
            case 'ended':
                this.numberNotAtRest === 1 && onDragEnded();
                this.numberNotAtRest--;

                //Recalculate the position of context and snapTargets. TODO: CONSIDER IF THIS MAKES SENSE??
                this.inverseContainerMatrix = inverse(getTransformationMatrix(this.container));
                this.snapTargets.forEach((snapTarget) => snapTarget.update());
                break;
            default:
                break;
        }
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
    getDefaultSpringConfig: PropTypes.func,
    getDefaultStickyValue: PropTypes.func,
    relayDraggableUpdateToTargets: PropTypes.func,
    relayDraggableRemovalToTargets: PropTypes.func,
    getDragContainerDOMElement: PropTypes.func,
    registerAsSnapTarget: PropTypes.func,
    unregisterAsSnapTarget: PropTypes.func
};

DragSnapContext.propTypes = {
    onDragStart: PropTypes.func,
    onDragEnding: PropTypes.func,
    onDragEnded: PropTypes.func,
    onDragResume: PropTypes.func,
    springConfig: CustomPropTypes.springConfig,
    sticky: PropTypes.bool
};

DragSnapContext.defaultProps = {
    onDragStart: () => {},
    onDragEnding: () => {},
    onDragEnded: () => {},
    onDragResume: () => {},
    springConfig: {stiffness: 390, damping: 35},
    sticky: true
};

export default DragSnapContext;
