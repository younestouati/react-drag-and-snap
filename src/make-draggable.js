import React/*, {Component}*/ from 'react';
import /*{createPortal, findDOMNode}*/ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {applyToPoint} from 'transformation-matrix';
import {createGuid} from './utils/guid-utils';
import {getTransformationMatrix, qrDecompose, overrideTranslation} from './utils/matrix-utils';
import {extend} from './utils/object-utils';
import {getDisplayName} from './utils/react-utils';
import {subtractPoints, getOrigo} from './utils/point-utils';
import {PointerTracker} from './helpers/misc/pointer-tracker';
import {DOMElementHelper} from './helpers/misc/dom-element-helper';
import {SpringRenderer, SpringRendererApplier} from './renderer/spring-renderer';
import {StyleEnforcer} from './helpers/components/style-enforcer';
import {makeClassBasedComponent} from './helpers/higher-order-components/make-class-based-component';
import {asStatePublisher, asStateSubscriber} from './helpers/higher-order-components/state-sharing';
import {getDragModeAttribute} from './drag-snap-logic/drag-modes';
import {normalizeDraggableConfig} from './drag-snap-logic/normalize-draggable-config';
import {DRAG_STATES} from './drag-snap-logic/drag-states';
import {draggableCollectors} from './defaults/default-draggable-collectors';

const {INACTIVE, GRABBED, DRAGGED, RELEASED} = DRAG_STATES;

const initialState = {
    dragState: INACTIVE,     //Either INACTIVE, GRABBED, DRAGGED, or RELEASED
    isSnapping: false,       //If this draggable is currently snapping to a snapTarget
    isPositionSnapped: null, //If it's position specificially is currently controlled by a snapTarget. Initially unknown
    isSnappingBack: false,   //If it is currently snapping back to its initial position (after a drop)
    snapTargetId: null,      //The id of the snapTarget it is currently snapping to. Null when not snapping
    customSnapProps: {},     //The customSnapProps as defined by the snapTarget currently snapped to
    flipGrabbedFlag: false,  //Used to postpone dragState sent to wrapped component one frame, when dragged
    velocity: null,          //The velocity (pixels/ms) by which the draggable is currently being dragged
    baseMatrix: null,        //The draggable's position in window coordinate system prior to dragging
    matrix: null,            //The draggable's current position in window coordinate system
    hasEscaped: false,       //If the draggable has escaped its first snapTarget in a new drag
    firstSnapTargetId: null, //Id of the first snapTarget to which draggable snapped in current drag session
    touchOffset: null        //Local coordinates of where the draggable has been grabbed
};

function configure(customConfig = {}, collect = draggableCollectors.allProps) {
    const config = normalizeDraggableConfig(customConfig);
    const dragModeAttribute = getDragModeAttribute(config.mode);

    return function makeDraggable(WrappedComponent, helpers = {DOMElementHelper, PointerTracker}) {
        class Draggable extends React.Component {
            constructor(props) {
                super(props);
                this.state = initialState;
                this.id = createGuid();
                this.DOMElementHelper = new helpers.DOMElementHelper();
                this.pointerTracker = new helpers.PointerTracker(
                    this.dragStartHandler.bind(this),
                    this.dragMoveHandler.bind(this),
                    this.dragEndHandler.bind(this)
                );

                //Convert to class based, if functional. Functional components can't have refs since. We need refs
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
                this.DOMElement = ReactDOM.findDOMNode(this.el);
                this.DOMElement.addEventListener('mousedown', this.boundStartPointerTracker, {passive: true});
                this.DOMElement.addEventListener('touchstart', this.boundStartPointerTracker, {passive: true});
            }

            componentWillUnmount() {
                this.DOMElement.removeEventListener('mousedown', this.boundStartPointerTracker);
                this.DOMElement.removeEventListener('touchstart', this.boundStartPointerTracker);
                this.pointerTracker.destroy();

                if (this.state.dragState !== INACTIVE) {
                    if (this.state.dragState !== RELEASED) {
                        this.context.onDragStateUpdate('ending');
                    }

                    this.context.relayDraggableRemovalToTargets(this.id);
                    this.context.onDragStateUpdate('ended');
                }
            }

            componentWillUpdate(nextProps, {dragState: nextDragState}) {
                const {dragState} = this.state;

                if (dragState !== DRAGGED && nextDragState === DRAGGED) {
                    this.DOMElement.setAttribute(dragModeAttribute, true);
                }

                if (dragState !== INACTIVE && nextDragState === INACTIVE) {
                    this.DOMElement.removeAttribute(dragModeAttribute);
                }
            }

            componentDidUpdate() {
                if (this.state.flipGrabbedFlag) {
                    //Postpone till after next DOM update after clone is mounted (to support css transition 
                    //triggered by change of the grabbed property)
                    requestAnimationFrame(() => this.setState({flipGrabbedFlag: false}));
                }
            }

            startTracker(e) {
                if (this.state.dragState === INACTIVE) {
                    this.pointerTracker.track(e);
                }
            }

            getSnapping(dragState, cursorPosition, velocity, state = this.state) {
                const elementDragPosition = subtractPoints(cursorPosition, state.touchOffset);
                const draggedMatrix = overrideTranslation(state.baseMatrix, elementDragPosition);

                return this.context.snap(
                    state.firstSnapTargetId,
                    state.hasEscaped,
                    dragState,
                    this.getDraggableDescriptor(dragState, draggedMatrix, cursorPosition, velocity, state.snapTargetId)
                );
            }

            getDraggableDescriptor(dragState, matrix, cursorPosition, velocity, snapTargetId) {
                const {scaleX, scaleY} = qrDecompose(matrix);
                
                return {
                    id: this.id,
                    dragData: this.props.dragData,
                    DOMElementHelper: this.DOMElementHelper,
                    scaledSize: {
                        width: this.DOMElementHelper.getSize().width * scaleX,
                        height: this.DOMElementHelper.getSize().height * scaleY
                    },
                    dragState,
                    velocity,
                    cursorPosition,
                    matrix,
                    snapTargetId
                };
            }

            setInactive() {
                this.setState({dragState: INACTIVE, isSnappingBack: false, customSnapProps: {}, velocity: getOrigo()});  
                //this.setState(initialState);    
            }

            restAfterReleaseHandler() {
                this.setInactive();
                const {snapTargetId, matrix} = this.state;

                if (snapTargetId) {
                    const draggableDescriptor = this.getDraggableDescriptor(INACTIVE, matrix);
                    this.context.relayDropEvent(snapTargetId, 'complete', draggableDescriptor);
                }

                this.context.relayDraggableRemovalToTargets(this.id);
                this.context.onDragStateUpdate('ended');
            }

            dragEndHandler({position, velocity}) {
                if (this.state.dragState === GRABBED) {
                    this.setInactive(); 
                    this.context.onDragStateUpdate('cancel');
                    return;
                }

                const dragState = RELEASED;
                const {baseMatrix, matrix: priorMatrix} = this.state;
                const snapping = this.getSnapping(dragState, position, velocity);
                let matrix = snapping.matrix;
                let isSnappingBack = false;

                if (snapping.isSnapping) {
                    const draggableDescriptor = this.getDraggableDescriptor(dragState, priorMatrix, position, velocity, snapping.snapTargetId);
                    this.context.relayDropEvent(snapping.snapTargetId, 'start', draggableDescriptor, snapping.matrix);
                } else if (this.props.snapBack) {
                    matrix = baseMatrix;
                    isSnappingBack = true;
                }

                this.setState(extend(snapping, {matrix, velocity, isSnappingBack, dragState}));

                this.context.relayDraggableUpdateToTargets(
                    this.getDraggableDescriptor(dragState, matrix, position, velocity, snapping.snapTargetId)
                );

                this.context.onDragStateUpdate('ending');
            }

            dragMoveHandler({position, velocity}) {
                if (this.state.dragState === GRABBED) {
                    this.context.onDragStateUpdate('start');
                }

                const dragState = DRAGGED;
                const snapping = this.getSnapping(dragState, position, velocity);

                this.setState(extend({dragState,velocity}, snapping));

                this.context.relayDraggableUpdateToTargets(
                    this.getDraggableDescriptor(dragState, snapping.matrix, position, velocity, snapping.snapTargetId)
                );
            }

            getInitialDragState(globalTouchOffset) {
                const dragState = GRABBED;
                const baseMatrix = getTransformationMatrix(this.DOMElement);
                const touchOffset = subtractPoints(globalTouchOffset, applyToPoint(baseMatrix, getOrigo()));

                return {
                    dragState,
                    baseMatrix,
                    touchOffset,
                    hasEscaped: false,
                    firstSnapTargetId: null,
                    flipGrabbedFlag: true,
                    isSnappingBack: false,
                    isPositionSnapped: null //Unclear if this is true or false at this point. Initialize to null
                };
            }

            startDrag(position, velocity) {
                this.context.onDragStateUpdate('grab');
                this.DOMElementHelper.updateElement(this.DOMElement);
                const initialState = this.getInitialDragState(position);
                const snapping = this.getSnapping(initialState.dragState, position, velocity, initialState);

                this.setState(extend(initialState, snapping, {velocity}));

                this.context.relayDraggableUpdateToTargets(
                    this.getDraggableDescriptor(
                        initialState.dragState,
                        snapping.matrix,
                        position,
                        velocity,
                        snapping.snapTargetId
                    )
                );
            }

            resumeDrag(position, velocity) {
                const dragState = DRAGGED;
                const {matrix: priorMatrix} = this.state;

                const newState = extend(this.state, {
                    dragState,
                    isSnappingBack: false,
                    touchOffset: subtractPoints(position, applyToPoint(priorMatrix, getOrigo()))
                });

                const snapping = this.getSnapping(dragState, position, velocity, newState);

                this.setState(extend(newState, snapping, {velocity}));
                
                this.context.onDragStateUpdate('resume');
                this.context.relayDraggableUpdateToTargets(
                    this.getDraggableDescriptor(
                        dragState, 
                        snapping.matrix, 
                        position,
                        velocity,
                        snapping.snapTargetId
                    )
                );

                if (snapping.snapTargetId) {
                    this.context.relayDropEvent(snapping.snapTargetId, 'cancel', this.getDraggableDescriptor(dragState, snapping.matrix));
                }   
            }

            dragStartHandler({position, velocity}) {
                if (this.props.draggingDisabled) {
                    return;
                }

                if (this.state.dragState === INACTIVE) {
                    this.startDrag(position, velocity);
                } else {
                    this.resumeDrag(position, velocity);
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
                const applyState = (dragState === GRABBED && flipGrabbedFlag) ? INACTIVE : dragState;

                //Matrix is in window coordinates, but draggables will be rendered in the context, so must be transformed
                const contextTransform = matrix ? qrDecompose(this.context.windowToContext(matrix)) : undefined;
                
                return (
                    <SpringRenderer
                        transform={contextTransform}
                        snapTargetId={snapTargetId}
                        isPositionSnapped={isPositionSnapped}
                        isSnappingBack={isSnappingBack}
                        onRestAfterRelease={this.restAfterReleaseHandler.bind(this)}
                        isActive={dragState !== INACTIVE}
                        isReleased={dragState === RELEASED}
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
                                dragState !== INACTIVE ? ReactDOM.createPortal(
                                    <SpringRendererApplier
                                        draggableCenterInBorderBoxCoordinates={this.DOMElementHelper.getCenterInBorderBoxCoordinates()}
                                        contextSize={this.context.getSize()}
                                        transform={transform}
                                        onRegrab={(e) => this.pointerTracker.track(e)}
                                        isVisible={[DRAGGED, RELEASED].includes(dragState)}
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
            getSize: PropTypes.func.isRequired,
            getDragContainerDOMElement: PropTypes.func.isRequired,
            relayDropEvent: PropTypes.func.isRequired,
            relayDraggableUpdateToTargets: PropTypes.func.isRequired,
            relayDraggableRemovalToTargets: PropTypes.func.isRequired
        };

        return Draggable;
    };
}

export default configure;
