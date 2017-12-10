import React, {Component} from 'react';
import {createPortal, findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import {inverse, applyToPoint} from 'transformation-matrix';
import {CustomPropTypes} from './prop-types/custom-prop-types';
import {createGuid} from './utils/guid-utils';
import {getTransformationMatrix, qrDecompose, overrideTranslation} from './drag-snap-logic/matrix';
import {extend} from './utils/object-utils';
import {isBoolean} from './utils/type-utils';
import {getDisplayName} from './utils/react-utils';
import {subtractPoints, getOrigo} from './utils/point-utils';
import {PointerTracker} from './helpers/pointer-tracker';
import {DOMElementHelper} from './helpers/dom-element-helper';
import {SpringRenderer} from './renderers/spring-renderer';
import {StyleEnforcer} from './helper-components/style-enforcer';
import {makeClassBasedComponent} from './helper-hocs/make-class-based-component';
import {asStatePublisher, asStateSubscriber} from './helper-hocs/state-sharing';
import {DRAG_MODES, getDragModeAttribute} from './drag-snap-logic/drag-modes';

function makeDraggable(WrappedComponent, helpers = {DOMElementHelper, PointerTracker}) {
    class Draggable extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isBeingDragged: false,
                isSnapping: false,
                customSnapProps: {}
            };

            this.helpers = helpers;
            this.id = createGuid();
            this.DOMElementHelper = new helpers.DOMElementHelper();
            this.pointerTracker = new helpers.PointerTracker(
                this.dragStartHandler.bind(this),
                this.dragMoveHandler.bind(this),
                this.dragEndHandler.bind(this)
            );

            //Convert to class based component, if functional. Functional components can't have refs since. We need refs
            const ClassBasedWrappedComponent = makeClassBasedComponent(WrappedComponent);
            this.statePublishingWrappedComponent = asStatePublisher(ClassBasedWrappedComponent);
            this.stateSubscribingWrappedComponent = asStateSubscriber(ClassBasedWrappedComponent);
            this.stateChangeHandler = () => {};
            this.boundStartPointerTracker = this.startTracker.bind(this);
        }

        getChildContext() {
            return {
                publishState: state => this.stateChangeHandler(state),
                subscribeToState: handler => (this.stateChangeHandler = handler),
                unsubscribeToState: () => (this.stateChangeHandler = () => {})
            };
        }

        componentDidMount() {
            this.DOMElement = findDOMNode(this.el);
            this.DOMElement.addEventListener('mousedown', this.boundStartPointerTracker, {passive: true});
            this.DOMElement.addEventListener('touchstart', this.boundStartPointerTracker, {passive: true});
        }

        componentWillUnmount() {
            this.DOMElement.removeEventListener('mousedown', this.boundStartPointerTracker);
            this.DOMElement.removeEventListener('touchstart', this.boundStartPointerTracker);

            if (this.state.isBeingDragged) {
                if (!this.state.isReleased) { //TODO: SURE THAT THIS IS UPDATED AT THIS POINT?
                    this.context.onDragStateUpdate('ending');
                }

                this.context.relayDraggableRemovalToTargets(this.id);
                this.context.onDragStateUpdate('ended');
            }
        }

        componentWillUpdate(nextProps, {isBeingDragged: willBeDragged}) {
            if (!this.state.isBeingDragged && willBeDragged) {
                this.DOMElement.setAttribute(getDragModeAttribute(this.props.dragMode), true);
            }

            if (this.state.isBeingDragged && !willBeDragged) {
                DRAG_MODES.forEach(dragMode => this.DOMElement.removeAttribute(getDragModeAttribute(dragMode)));
            }
        }

        componentDidUpdate() {
            if (this.state.flipDraggedFlag) {
                requestAnimationFrame(() => this.setState({flipDraggedFlag: false})); //Postpone till after next DOM update //TODO: TRY TO CALL IMMIDIATELY (NOT IN A REQUESTANIMATIONFRAME!!!
            }
        }

        startTracker(e) {
            if (!this.state.isGrabbed) {
                this.pointerTracker.track(e);
            }
        }

        getSnapping(isReleased, cursorPosition, velocity, state = this.state) {
            const elementCenter = subtractPoints(cursorPosition, state.touchOffset);
            const draggedMatrix = overrideTranslation(state.baseMatrix, elementCenter);

            return this.context.snap(
                state.hasEscaped,
                isReleased,
                this.getDraggableDescriptor(draggedMatrix, cursorPosition, velocity)
            );
        }

        restAfterReleaseHandler() {
            const {snapTargetId, matrix} = this.state;
            this.setState({isBeingDragged: false, isReleased: false, isSnappingBack: false, customSnapProps: {}});

            if (snapTargetId) {
                this.context.relayDropEvent(snapTargetId, 'complete', this.getDraggableDescriptor(matrix));
            }

            this.context.relayDraggableRemovalToTargets(this.id);
            this.context.onDragStateUpdate('ended');
        }

        dragEndHandler({position, velocity}) {
            const {baseMatrix, matrix: priorMatrix} = this.state;
            const {snapTargetId, matrix: snapMatrix, customSnapProps, isPositionSnapped, isSnapping}
                = this.getSnapping(true, position, velocity);
            let matrix = snapMatrix;
            let isSnappingBack = false;

            if (isSnapping) {
                const {relayDropEvent} = this.context;
                relayDropEvent(snapTargetId, 'start', this.getDraggableDescriptor(priorMatrix, position, velocity), snapMatrix);
            } else if (this.props.snapBack) {
                matrix = baseMatrix;
                isSnappingBack = true;
            }

            this.setState({isSnapping, isPositionSnapped, snapTargetId, customSnapProps, isReleased: true, matrix, isSnappingBack, isGrabbed: false});
            this.context.onDragStateUpdate('ending');
        }

        dragMoveHandler({position, velocity}) {
            const {
                isInSnappingArea,
                matrix,
                customSnapProps,
                isPositionSnapped,
                isSnapping,
                snapTargetId
            } = this.getSnapping(false, position, velocity);
            const hasEscaped = this.state.hasEscaped || !isInSnappingArea;

            this.setState({hasEscaped, isSnapping, matrix, customSnapProps, isPositionSnapped, isBeingDragged: true});
            this.context.relayDraggableUpdateToTargets(snapTargetId, this.getDraggableDescriptor(matrix, position, velocity));
        }

        getInitialDragState(globalTouchOffset) {
            const baseMatrix = getTransformationMatrix(this.DOMElement);
            const touchOffset = subtractPoints(globalTouchOffset, applyToPoint(baseMatrix, getOrigo()));

            return {
                baseMatrix,
                touchOffset,
                isReleased: false,
                hasEscaped: false,
                flipDraggedFlag: true,
                isGrabbed: true,
                isBeingDragged: false,
                isSnappingBack: false
            };
        }
        //TODO: RENAME THIS!!
        getDraggableDescriptor(matrix, cursorPosition, velocity) {
            return {
                id: this.id,
                dragData: this.props.dragData,
                dimensions: this.DOMElementHelper.getDimensions(),
                velocity,
                cursorPosition,
                matrix
            };
        }

        dragStartHandler({position, velocity}) {
            if (this.props.draggingDisabled) {
                return;
            }

            if (this.state.isBeingDragged) {
                const {snapTargetId, matrix} = this.state;
                this.setState({
                    isReleased: false,
                    isSnappingBack: false,
                    touchOffset: applyToPoint(inverse(matrix), position) //TODO: FIX THIS ONE AS WELL! FIGURE OUT IF this.cloneEL is needed?
                });
                this.context.onDragStateUpdate('resume');

                if (snapTargetId) {
                    this.context.relayDropEvent(snapTargetId, 'cancel', this.getDraggableDescriptor(matrix));
                }
            } else {
                this.context.onDragStateUpdate('start');
                this.DOMElementHelper.updateElement(this.DOMElement);
                const initialState = this.getInitialDragState(position);

                const {matrix, isSnapping, customSnapProps, isPositionSnapped, isInSnappingArea}
                    = this.getSnapping(false, position, velocity, initialState);
                
                this.setState(
                    extend(initialState, {
                        matrix,
                        isSnapping,
                        customSnapProps,
                        isPositionSnapped,
                        hasEscaped: !isInSnappingArea
                    })
                );

                this.context.relayDraggableUpdateToTargets(null, this.getDraggableDescriptor(matrix, position, velocity));
            }
        }

        render() {
            const {springConfig, sticky} = this.props;
            const {
                isBeingDragged,
                isSnapping,
                isPositionSnapped,
                isSnappingBack,
                isReleased,
                customSnapProps,
                flipDraggedFlag,
                matrix
            } = this.state;
            const snapProps = {isReleased, isBeingDragged, isSnapping, isSnappingBack, customSnapProps};
            const isDragged = isBeingDragged && !flipDraggedFlag;

            return [
                <this.statePublishingWrappedComponent
                    ref={el => (this.el = el)}
                    {...this.props}
                    {...snapProps}
                    isDragged={isDragged}
                    isDragClone={false}
                    key="static-version"
                />,
                isBeingDragged ? createPortal(
                    <SpringRenderer
                        {...qrDecompose(this.context.windowToContext(matrix))}   //Matrix is in window coordinates, but draggables will be rendered in the context, so must be transformed
                        sticky={isBoolean(sticky) ? sticky : this.context.getDefaultStickyValue()}
                        ignoreSticky={isPositionSnapped || isSnappingBack}
                        onRestAfterRelease={this.restAfterReleaseHandler.bind(this)}
                        isReleased={isReleased}
                        onRegrab={e => this.pointerTracker.track(e)}
                        springConfig={springConfig || this.context.getDefaultSpringConfig()}
                        key="dragged-version"
                    >
                        <StyleEnforcer DOMElementHelper={this.DOMElementHelper}>
                            <this.stateSubscribingWrappedComponent
                                ref={el => (this.cloneEl = el)} //MAY NOT BE NEEDED!!!
                                {...this.props}
                                {...snapProps}
                                isDragClone={true}
                                isDragged={isDragged}
                            />
                        </StyleEnforcer>
                    </SpringRenderer>,
                    this.context.getDragContainerDOMElement()
                ) : null
            ];
        }
    }

    Draggable.displayName = `makeDraggable(${getDisplayName(WrappedComponent)})`;

    Draggable.propTypes = {
        draggingDisabled: PropTypes.bool,
        dragData: PropTypes.any,
        snapBack: PropTypes.bool,
        dragMode: CustomPropTypes.dragMode,
        sticky: PropTypes.bool,
        springConfig: CustomPropTypes.springConfig
    };

    Draggable.defaultProps = {
        draggingDisabled: false,
        snapBack: true,
        dragMode: 'default'
    };

    Draggable.childContextTypes = {
        publishState: PropTypes.func,
        subscribeToState: PropTypes.func,
        unsubscribeToState: PropTypes.func
    };

    Draggable.contextTypes = {
        snap: PropTypes.func.isRequired,
        windowToContext: PropTypes.func.isRequired,
        contextToWindow: PropTypes.func.isRequired,
        onDragStateUpdate: PropTypes.func.isRequired,
        getDefaultSpringConfig: PropTypes.func.isRequired,
        getDefaultStickyValue: PropTypes.func.isRequired,
        getDragContainerDOMElement: PropTypes.func.isRequired,
        relayDropEvent: PropTypes.func.isRequired,
        relayDraggableUpdateToTargets: PropTypes.func.isRequired,
        relayDraggableRemovalToTargets: PropTypes.func.isRequired
    };

    return Draggable;
}

export default makeDraggable;
