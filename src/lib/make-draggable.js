import React, {Component} from 'react';
import {createPortal, findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import {applyToPoint} from 'transformation-matrix';
import {createGuid} from './utils/guid-utils';
import {getTransformationMatrix, qrDecompose, overrideTranslation} from './drag-snap-logic/matrix';
import {extend} from './utils/object-utils';
import {getDisplayName} from './utils/react-utils';
import {subtractPoints, getOrigo} from './utils/point-utils';
import {PointerTracker} from './helpers/pointer-tracker';
import {DOMElementHelper} from './helpers/dom-element-helper';
import {SpringRenderer, SpringRendererApplier} from './renderer/spring-renderer';
import {StyleEnforcer} from './helper-components/style-enforcer';
import {makeClassBasedComponent} from './helper-hocs/make-class-based-component';
import {asStatePublisher, asStateSubscriber} from './helper-hocs/state-sharing';
import {DRAG_MODES, getDragModeAttribute} from './drag-snap-logic/drag-modes';
import {DRAG_STATES} from './drag-snap-logic/drag-states';
import {draggableCollectors} from './defaults/default-draggable-collectors';

const defaultDraggableConfig = {
    stiffness: 390,
    damping: 35,
    sticky: true,
    mode: 'default'
};

function setConfig(customConfig = {}, collect = draggableCollectors.allProps) {
    const config = extend(defaultDraggableConfig, customConfig);

    return function makeDraggable(WrappedComponent, helpers = {DOMElementHelper, PointerTracker}) {
        class Draggable extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    dragState: DRAG_STATES.INACTIVE,
                    isSnapping: false,
                    isPositionSnapped: false,
                    isSnappingBack: false,
                    snapTargetId: null,
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
                this.pointerTracker.destroy();

                if (this.state.dragState !== DRAG_STATES.INACTIVE) {
                    if (this.state.dragState !== DRAG_STATES.RELEASED) {
                        this.context.onDragStateUpdate('ending');
                    }

                    this.context.relayDraggableRemovalToTargets(this.id);
                    this.context.onDragStateUpdate('ended');
                }
            }

            componentWillUpdate(nextProps, {dragState: nextDragState}) {
                if (this.state.dragState !== DRAG_STATES.DRAGGED && nextDragState === DRAG_STATES.DRAGGED) {
                    this.DOMElement.setAttribute(getDragModeAttribute(config.mode), true);
                }

                if (this.state.dragState !== DRAG_STATES.INACTIVE && nextDragState === DRAG_STATES.INACTIVE) {
                    DRAG_MODES.forEach(dragMode => this.DOMElement.removeAttribute(getDragModeAttribute(dragMode)));
                }
            }

            componentDidUpdate() {
                if (this.state.flipGrabbedFlag) {
                    //Postpone till after next DOM update after clone is mounted (to support css transition triggered by change of the grabbed property)
                    requestAnimationFrame(() => this.setState({flipGrabbedFlag: false}));
                }
            }

            startTracker(e) {
                if (this.state.dragState === DRAG_STATES.INACTIVE) {
                    this.pointerTracker.track(e);
                }
            }

            getSnapping(dragState, cursorPosition, velocity, state = this.state) {
                const elementCenter = subtractPoints(cursorPosition, state.touchOffset);
                const draggedMatrix = overrideTranslation(state.baseMatrix, elementCenter);

                return this.context.snap(
                    state.hasEscaped,
                    dragState,
                    this.getDragStateDescriptor(dragState, draggedMatrix, cursorPosition, velocity)
                );
            }

            setInactive() {
                this.setState({dragState: DRAG_STATES.INACTIVE, isSnappingBack: false, customSnapProps: {}, velocity: getOrigo()});    
            }

            restAfterReleaseHandler() {
                this.setInactive();
                const {snapTargetId, matrix} = this.state;

                if (snapTargetId) {
                    this.context.relayDropEvent(snapTargetId, 'complete', this.getDragStateDescriptor(DRAG_STATES.INACTIVE, matrix));
                }

                this.context.relayDraggableRemovalToTargets(this.id);
                this.context.onDragStateUpdate('ended');
            }

            dragEndHandler({position, velocity}) {
                if (this.state.dragState === DRAG_STATES.GRABBED) {
                    this.setInactive();
                    this.context.onDragStateUpdate('cancel');  
                    return;
                }

                const dragState = DRAG_STATES.RELEASED;
                const {baseMatrix, matrix: priorMatrix} = this.state;
                const {snapTargetId, matrix: snapMatrix, customSnapProps, isPositionSnapped, isSnapping}
                    = this.getSnapping(dragState, position, velocity);
                let matrix = snapMatrix;
                let isSnappingBack = false;

                if (isSnapping) {
                    const {relayDropEvent} = this.context;
                    relayDropEvent(
                        snapTargetId,
                        'start',
                        this.getDragStateDescriptor(
                            dragState,
                            priorMatrix,
                            position,
                            velocity
                        ), 
                        snapMatrix
                    );
                } else if (this.props.snapBack) {
                    matrix = baseMatrix;
                    isSnappingBack = true;
                }

                this.setState({
                    dragState,
                    matrix,
                    isSnapping,
                    velocity,
                    isPositionSnapped,
                    isSnappingBack,
                    snapTargetId,
                    customSnapProps,
                });

                this.context.relayDraggableUpdateToTargets(
                    snapTargetId, 
                    this.getDragStateDescriptor(
                        dragState,
                        matrix,
                        position,
                        velocity
                    )
                );

                this.context.onDragStateUpdate('ending');
            }

            dragMoveHandler({position, velocity}) {
                const dragState = DRAG_STATES.DRAGGED;
                const {
                    isInSnappingArea,
                    matrix,
                    customSnapProps,
                    isPositionSnapped,
                    isSnapping,
                    snapTargetId
                } = this.getSnapping(dragState, position, velocity);

                const hasEscaped = this.state.hasEscaped || !isInSnappingArea;

                if (this.state.dragState === DRAG_STATES.GRABBED) {
                    this.context.onDragStateUpdate('start');
                }

                this.setState({
                    dragState,
                    matrix,
                    velocity,
                    hasEscaped,
                    isSnapping,
                    snapTargetId,
                    isPositionSnapped,
                    customSnapProps,
                });

                this.context.relayDraggableUpdateToTargets(
                    snapTargetId,
                    this.getDragStateDescriptor(
                        dragState,
                        matrix,
                        position,
                        velocity
                    )
                );
            }

            getInitialDragState(globalTouchOffset) {
                const dragState = DRAG_STATES.GRABBED;
                const baseMatrix = getTransformationMatrix(this.DOMElement);
                const touchOffset = subtractPoints(globalTouchOffset, applyToPoint(baseMatrix, getOrigo()));

                return {
                    dragState,
                    baseMatrix,
                    touchOffset,
                    hasEscaped: false,
                    flipGrabbedFlag: true,
                    isSnappingBack: false
                };
            }

            getDragStateDescriptor(dragState, matrix, cursorPosition, velocity) {
                return {
                    id: this.id,
                    dragData: this.props.dragData,
                    size: this.DOMElementHelper.getSize(),
                    dragState,
                    velocity,
                    cursorPosition,
                    matrix
                };
            }

            startDrag(position, velocity) {
                this.context.onDragStateUpdate('grab');
                this.DOMElementHelper.updateElement(this.DOMElement);
                const initialState = this.getInitialDragState(position);

                const {matrix, isSnapping, customSnapProps, isPositionSnapped, isInSnappingArea}
                    = this.getSnapping(initialState.dragState, position, velocity, initialState);
                
                this.setState(
                    extend(initialState, {
                        matrix,
                        isSnapping,
                        isPositionSnapped,
                        hasEscaped: !isInSnappingArea,
                        customSnapProps,
                        velocity
                    })
                );

                this.context.relayDraggableUpdateToTargets(
                    null,
                    this.getDragStateDescriptor(
                        initialState.dragState,
                        matrix,
                        position,
                        velocity
                    )
                );
            }

            resumeDrag(position, velocity) {
                const dragState = DRAG_STATES.DRAGGED;
                const {snapTargetId, matrix: priorMatrix} = this.state;

                const newState = extend(this.state, {
                    dragState,
                    isSnappingBack: false,
                    touchOffset: subtractPoints(position, applyToPoint(priorMatrix, getOrigo()))
                });

                const {matrix, isSnapping, customSnapProps, isPositionSnapped, isInSnappingArea}
                    = this.getSnapping(dragState, position, velocity, newState);

                this.setState(
                    extend(newState, {
                        matrix,
                        isSnapping,
                        isPositionSnapped,
                        hasEscaped: !isInSnappingArea,
                        customSnapProps,
                        velocity
                    })
                );
                
                this.context.onDragStateUpdate('resume');
                this.context.relayDraggableUpdateToTargets(
                    snapTargetId, 
                    this.getDragStateDescriptor(
                        dragState, 
                        matrix, 
                        position,
                        velocity
                    )
                );

                if (snapTargetId) {
                    this.context.relayDropEvent(snapTargetId, 'cancel', this.getDragStateDescriptor(dragState, matrix));
                }   
            }

            dragStartHandler({position, velocity}) {
                if (this.props.draggingDisabled) {
                    return;
                }

                if (this.state.dragState !== DRAG_STATES.INACTIVE) {
                    this.resumeDrag(position, velocity);
                } else {
                    this.startDrag(position, velocity);
                }
            }

            render() {
                const {
                    dragState,
                    velocity,
                    isSnapping,
                    snapTargetId,
                    isPositionSnapped,
                    isSnappingBack,
                    customSnapProps,
                    flipGrabbedFlag,
                    matrix
                } = this.state;
                const snapProps = {isSnapping, isSnappingBack, customSnapProps};
                const applyState = (dragState === DRAG_STATES.GRABBED && flipGrabbedFlag) ? DRAG_STATES.INACTIVE : dragState;

                //Matrix is in window coordinates, but draggables will be rendered in the context, so must be transformed
                const contextTransform = matrix ? qrDecompose(this.context.windowToContext(matrix)) : undefined;

                return (
                    <SpringRenderer
                        transform={contextTransform}
                        snapTargetId={snapTargetId}
                        isPositionSnapped={isPositionSnapped}
                        isSnappingBack={isSnappingBack}
                        onRestAfterRelease={this.restAfterReleaseHandler.bind(this)}
                        isActive={dragState !== DRAG_STATES.INACTIVE}
                        isReleased={dragState === DRAG_STATES.RELEASED}
                        springConfig={{
                            stiffness: config.stiffness,
                            damping: config.damping
                        }}
                        sticky={config.sticky}
                    >
                        {(transform, dragDisplacement) => {
                            const dragProps = collect({
                                dragState: applyState,
                                dragVelocity: velocity, //TODO: CAN IT BE DETERMINED BASED ON THE DRAG DISPLACEMENT??
                                dragDisplacement
                            });

                            return [
                                <this.statePublishingWrappedComponent
                                    ref={el => (this.el = el)}
                                    {...this.props}
                                    {...snapProps}
                                    {...dragProps}
                                    isDragClone={false}
                                    key="static-version"
                                />,
                                dragState !== DRAG_STATES.INACTIVE ? createPortal(
                                    <SpringRendererApplier
                                        transform={transform}
                                        onRegrab={(e) => this.pointerTracker.track(e)}
                                        isVisible={[DRAG_STATES.DRAGGED, DRAG_STATES.RELEASED].includes(dragState)}
                                        key="dragged-version"
                                    >
                                        <StyleEnforcer DOMElementHelper={this.DOMElementHelper}>
                                            <this.stateSubscribingWrappedComponent
                                                {...this.props}
                                                {...snapProps}
                                                {...dragProps}
                                                isDragClone={true}
                                            />
                                        </StyleEnforcer>
                                    </SpringRendererApplier>, 
                                    this.context.getDragContainerDOMElement()
                                ) : null
                            ];
                        }}
                    </SpringRenderer>
                );
            }
        }

        Draggable.displayName = `makeDraggable(${getDisplayName(WrappedComponent)})`;

        Draggable.propTypes = {
            draggingDisabled: PropTypes.bool,
            dragData: PropTypes.any,
            snapBack: PropTypes.bool,
        };

        Draggable.defaultProps = {
            draggingDisabled: false,
            snapBack: true,
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
            getDragContainerDOMElement: PropTypes.func.isRequired,
            relayDropEvent: PropTypes.func.isRequired,
            relayDraggableUpdateToTargets: PropTypes.func.isRequired,
            relayDraggableRemovalToTargets: PropTypes.func.isRequired
        };

        return Draggable;
    };
}

export default setConfig;