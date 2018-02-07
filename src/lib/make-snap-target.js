import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import {identity} from 'transformation-matrix';
import {CustomPropTypes} from './prop-types/custom-prop-types';
import {
    getTransformationMatrix,
    extractTranslation,
    deltaMatrix,
    transformMultiple,
    matrixToDescriptor,
    transformRotation,
    transformScale,
    transformSkew,
	transformVelocity,
	transformPosition,
    qrDecompose
} from './utils/matrix-utils';
import {createSnapMatrix} from './drag-snap-logic/create-snapping-matrix';
import {normalizeTransform} from './drag-snap-logic/normalize-transform';
import {makeClassBasedComponent} from './helpers/higher-order-components/make-class-based-component';
import {snapTargetConfigBuilder} from './drag-snap-logic/snap-target-config-builder';
import {DRAG_STATES} from './drag-snap-logic/drag-states'; 
import {snapTargetCollectors} from './defaults/default-snap-target-collectors';
import {distanceBasedWithOffset} from './defaults/default-snap-priority';
import {extend, shallowCloneExcluding, shallowEqual} from './utils/object-utils';
import {getDisplayName} from './utils/react-utils';
import {toArray} from './utils/array-utils';
import {isFunction, isObject, isNumber, isNullOrUndefined, isArray} from './utils/type-utils';
import {createGuid} from './utils/guid-utils';
import {distance} from './utils/point-utils';
import {byId} from './utils/sort';

const defaultTransformation = {
    rotate: 0,
    skewX: 0,
    x: 0,
    y: 0,
    scale: 1
};

function setConfig(customConfig = {}, collect = snapTargetCollectors.staticAndLowFrequencyProps) {
    const config = snapTargetConfigBuilder(customConfig);

    return function makeSnapTarget(WrappedComponent) {
        class SnapTarget extends Component {
            constructor(props) {
                super(props);

                this.state = {
                    collectedDragProps: this.collectDragProps().collectedDragProps
                };

                this.draggedItems = [];
                this.baseExternalTransformation = null;
                this.internalTransformation = null;
                this.matrix = null;
                this.size = null;

                //Convert to class based component, if functional. Functional components can't have refs since. We need refs
                this.ClassBasedWrappedComponent = makeClassBasedComponent(WrappedComponent);
                this.id = createGuid();
            }

            getChildContext() {
                return {
                    setInternalTransformation: this.setInternalTransformation.bind(this)
                };
            }

            componentDidMount() {
                if (this.context.registerAsSnapTarget) {
                    this.context.registerAsSnapTarget(this.id, this);
                } else {
                    console.warn('Not in a drag and snap context!');
                }
            }

            componentWillUnmount() {
                this.context.unregisterAsSnapTarget(this.id);
            }

            getId() {
                return this.id;
            }

            update() {
                this.matrix = null; //Invalidate the matrix, so it will be recalculated next time it is needed
                this.size = null;
            }

            continuousUpdateIfEnabled() {
                if (this.props.continuousUpdate) {
                    this.update();
                }
            }

            getMatrix() {
                if (!this.matrix) {
                    this.matrix = getTransformationMatrix(findDOMNode(this.el));
                    this.baseExternalTransformation = this.props.externalTransformation;
                }

                const externalDelta = this.props.externalTransformation
                    ? deltaMatrix(this.baseExternalTransformation, this.props.externalTransformation, defaultTransformation)
                    : identity();

                const internalDelta = this.internalTransformation
                    ? deltaMatrix(defaultTransformation, this.internalTransformation, defaultTransformation)
                    : identity();

                return transformMultiple(this.matrix, externalDelta, internalDelta);
            }

            getSize() {
                if (!this.size) {
                    const DOMElement = findDOMNode(this.el);
                    this.size = {
                        width: DOMElement.clientWidth,
                        height: DOMElement.clientHeight
                    };
                }

                return this.size;
            }

            getActualSize() {
                const size = this.getSize();
                const {scaleX, scaleY}= qrDecompose(this.getMatrix());

                return {
                    width: size.width * scaleX,
                    height: size.height * scaleY
                };
            }

            //Converts the descriptor, velocity and cursor point from the global (window) coordinate system, to the local coordinate system of the snap taget.
            globalToLocal({id, dragState, dragData, matrix, size, velocity, cursorPosition}) {                                
                const {x, y, scaleX, scaleY, rotate, skewX, skewY} = qrDecompose(matrix);
                const localPosition = transformPosition(this.getMatrix(), {x, y});
                const localRotation = transformRotation(this.getMatrix(), rotate);
                const localSize = transformScale(this.getMatrix(), this.getSize(), {scaleX, scaleY}, size);
                const localSkew = transformSkew(this.getMatrix(), {x: skewX, y: skewY});
            
                const localTransform = extend({rotate: localRotation}, localPosition, localSize, localSkew)

                return {
                    id,
                    dragState,
                    dragData,
                    targetWidth: this.getSize().width,
                    targetHeight: this.getSize().height,
                    transform: localTransform,
                    distance: distance({x: localTransform.x, y: localTransform.y}),
                    velocity: velocity ? transformVelocity(this.getMatrix(), velocity) : null,
                    cursorPosition: cursorPosition ? transformPosition(this.getMatrix(), cursorPosition) : null
                };
            }

            getProps() {
                const {collectedDragProps} = this.state;
                
                return isArray(collectedDragProps) ?
                    extend(shallowCloneExcluding(this.props, LIBRARY_PROPS), {draggedItems: collectedDragProps}) :
                    extend(shallowCloneExcluding(this.props, LIBRARY_PROPS), collectedDragProps);
            }

            getParams(...args) {
                return [this.globalToLocal(...args), this.getProps(), {draggedItems: this.draggedItems}]; //TODO: SHOULD WE SOMEHOW INJECT THE draggableToTarget and targetToDraggable methods here?
            }

            isSnapCriteriaMet(dragState, dragStateDescriptor) {
                const criteria = toArray(dragState === DRAG_STATES.RELEASED ? config.releaseSnapCriteria : config.dragSnapCriteria);
                const params = this.getParams(dragStateDescriptor);
                return criteria.every(criterium => criterium(...params));
            }

            getSnapPriority(dragState, dragStateDescriptor) {
                const {releaseSnapPriority, dragSnapPriority, snapPriority: commonPriority} = this.props;
                const snapPriority = (dragState === DRAG_STATES.RELEASED ? releaseSnapPriority : dragSnapPriority) || commonPriority;
                const params = this.getParams(dragStateDescriptor);
                const priority = isFunction(snapPriority) ? snapPriority(...params) : snapPriority;

                invariant(isNumber(priority), `snapPriority must be a number or a function that returns a number.`);
                invariant(priority >= 1, `SnapPriority should be 1 (highest priority) or larger. Was ${priority}`);

                return priority;
            }

            getSnapping(dragState, dragStateDescriptor) {
                const snapDescriptor = dragState === DRAG_STATES.RELEASED ? config.releaseSnapDescriptor : config.dragSnapDescriptor;
                const params = this.getParams(dragStateDescriptor);
                const snapTransform = isFunction(snapDescriptor) ? snapDescriptor(...params) : snapDescriptor;

                //TODO: DETERMINE THIS ELSEWHERE
                const draggableTransform = qrDecompose(dragStateDescriptor.matrix);
                const actualDraggableSize = {
                    width: dragStateDescriptor.size.width * draggableTransform.scaleX,
                    height: dragStateDescriptor.size.height * draggableTransform.scaleY
                };

                const normalizedSnapTransform = normalizeTransform(snapTransform, actualDraggableSize, this.getActualSize());
                const snapMatrix = createSnapMatrix(this.getMatrix(), normalizedSnapTransform, actualDraggableSize, this.getActualSize());

                //TODO: CAN THIS COMPARISON BE DONE IN A MORE ELEGANT WAY. MAYBE COMPARING EXTRACTED X AND Y FROM snappingMatrix and dragStateDescriptor.matrix instead?
                const {x, y} = transformPosition(this.getMatrix(), extractTranslation(dragStateDescriptor.matrix));
                const isPositionSnapped = x !== normalizedSnapTransform.x || y !== normalizedSnapTransform.y;

                return {
                    matrix: snapMatrix,
                    customSnapProps: normalizedSnapTransform.customSnapProps,
                    isPositionSnapped,
                    snapTargetId: this.id
                };
            }

            allowsEasyEscape(dragStateDescriptor) {
                const draggable = this.globalToLocal(dragStateDescriptor);
                const {easyEscape} = this.props;
                return isFunction(easyEscape) ? easyEscape(draggable) : easyEscape;
            }

            onDropEvent(type, dragStateDescriptor, globalSnapMatrix) {
                const localDescriptor = this.globalToLocal(dragStateDescriptor);
                const {size} = dragStateDescriptor;

                switch (type) {
                    case 'start':
                        const globalSnapDescriptor = matrixToDescriptor(globalSnapMatrix, size);
                        this.props.onDropStart(localDescriptor, globalSnapDescriptor); //TODO: FIGURE OUT IF THIS SHOULD INFACT BE GLOABEL? PROBABLY NOT!!!
                        break;
                    case 'complete':
                        this.props.onDropComplete(localDescriptor);
                        break;
                    case 'cancel':
                        this.props.onDropCancel(localDescriptor);
                        break;
                    default:
                        break;
                }
            }

            collectDragProps(cur) {
                const items = this.draggedItems || [];
                items.sort(byId);
                const next = collect(items, shallowCloneExcluding(this.props, LIBRARY_PROPS));

                invariant(
                    isObject(next) || (isArray(next) && next.length === items.length),
                    `collect function must return an object or an array of objects equal to the number of dragged items`
                );

                const hasChanged = (
                    isNullOrUndefined(cur) ||
                    (isObject(next) && !shallowEqual(cur, next)) ||
                    (isArray(next) && (cur.length !== next.length || next.some((o, i) => !shallowEqual(o, cur[i]))))
                ); 

                return {
                    hasChanged,
                    collectedDragProps: next
                };
            }

            updateDragProps() {
                const {collectedDragProps, hasChanged} = this.collectDragProps(this.state.collectedDragProps);

                if (hasChanged) {
                    this.setState({collectedDragProps})
                }
            }

            updateItem(idOfTargetSnappedTo, dragStateDescriptor) {
                const draggable = this.globalToLocal(dragStateDescriptor);
                draggable.isSnappingToThisTarget = false;
                draggable.isSnappingToOtherTarget = false;

                if (!isNullOrUndefined(idOfTargetSnappedTo)) {
                    if (this.id === idOfTargetSnappedTo) {
                        draggable.isSnappingToThisTarget = true;
                    } else {
                        draggable.isSnappingToOtherTarget = true;
                    }
                }

                this.draggedItems = this.draggedItems.filter(p => p.id !== dragStateDescriptor.id).concat(draggable);
                this.updateDragProps();
            }

            removeItem(id) {
                this.draggedItems = this.draggedItems.filter(d => d.id !== id);
                this.updateDragProps();
            }

            setInternalTransformation(internalTransformation) {
                this.internalTransformation = internalTransformation;
            }

            render() {
                return <this.ClassBasedWrappedComponent {...this.getProps()} ref={el => (this.el = el)} />;
            }
        }

        SnapTarget.displayName = `makeSnapTarget(${getDisplayName(WrappedComponent)})`;
        SnapTarget.propTypes = SnapTargetPropTypes;

        SnapTarget.defaultProps = {
            onDropStart: () => {},
            onDropComplete: () => {},
            onDropCancel: () => {},
            easyEscape: false,
            continuousUpdate: false,
            snapPriority: distanceBasedWithOffset(100)
        };

        SnapTarget.contextTypes = {
            registerAsSnapTarget: PropTypes.func.isRequired,
            unregisterAsSnapTarget: PropTypes.func.isRequired
        };

        SnapTarget.childContextTypes = {
            setInternalTransformation: PropTypes.func
        };

        return SnapTarget;
    };
}

const SnapTargetPropTypes = {
    snapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    dragSnapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    releaseSnapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    onDropStart: PropTypes.func,
    onDropComplete: PropTypes.func,
    onDropCancel: PropTypes.func,
    easyEscape: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    continuousUpdate: PropTypes.bool,
    externalTransformation: CustomPropTypes.transform
};

const LIBRARY_PROPS = Object.keys(SnapTargetPropTypes);

export default setConfig;