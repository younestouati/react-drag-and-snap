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
    convertTransform,
	transformVelocity,
	transformPosition,
    qrDecompose
} from './drag-snap-logic/matrix';
import {parseSnapDescriptor,  createSnappingMatrix} from './drag-snap-logic/create-snapping-matrix';
import {makeClassBasedComponent} from './helper-hocs/make-class-based-component';
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
    rotation: 0,
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
                this.baseDimensions = null;

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
                this.baseDimensions = null;
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

            getBaseDimensions() {
                if (!this.baseDimensions) {
                    const DOMElement = findDOMNode(this.el);
                    this.baseDimensions = {
                        width: DOMElement.clientWidth,
                        height: DOMElement.clientHeight
                    };
                }

                return this.baseDimensions;
            }

            //Converts the descriptor, velocity and cursor point from the global (window) coordinate system, to the local coordinate system of the snap taget.
            globalToLocal({id, dragState, dragData, matrix, dimensions, velocity, cursorPosition}) {
                //const globalDescriptor = matrixToDescriptor(matrix, dimensions);
                const draggableOwnTransform = qrDecompose(matrix);
                
                const {width: targetWidth, height: targetHeight} = this.getBaseDimensions();
                
                /*
                    THIS IS THE ONE THAT IS FED TO THE snapTransformer. So it should have a
                    scaleX and a scaleY
                */
                
                //Draggables transform in the snapTarget's coordinate system
                const localTransform = convertTransform(
                    this.getMatrix(), //The snapTargets matrix
                    this.getBaseDimensions(), //The base dimensions of the snapTarget (width and height)
                    draggableOwnTransform, //The draggables transform
                    dimensions //The draggable's dimensions (width and height)
                );

                return {
                    id,
                    dragState,
                    dragData,
                    targetWidth,
                    targetHeight,
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
                const descriptor = isFunction(snapDescriptor) ? snapDescriptor(...params) : snapDescriptor;

                const snapTargetTransform = qrDecompose(this.getMatrix());
                const draggableTransform = qrDecompose(dragStateDescriptor.matrix);
   
                console.log('snapTargetTransform.scaleX: ', snapTargetTransform.scaleX);
                console.log('draggableTransform.scaleX: ', draggableTransform.scaleX);
                console.log('snapTargetTransform.scaleY: ', snapTargetTransform.scaleY);
                console.log('draggableTransform.scaleY: ', draggableTransform.scaleY);

                const parsedSnapDescriptor = parseSnapDescriptor(descriptor, snapTargetTransform, this.getBaseDimensions(), draggableTransform, dragStateDescriptor.dimensions);

                invariant(isObject(parsedSnapDescriptor), `Invalid snapDescriptor ${descriptor}. Must be an object.`);
                invariant(isNumber(parsedSnapDescriptor.skewX), `Invalid skewX in snapDescriptor. Must be a number. Was ${descriptor.skewX}`);
				invariant(isNumber(parsedSnapDescriptor.skewY), `Invalid skewY in snapDescriptor. Must be a number. Was ${descriptor.skewY}`);
				invariant(isNumber(parsedSnapDescriptor.x), `Invalid x value in snapDescriptor. Must be a number or a percentage string. Was ${descriptor.x}`);
                invariant(isNumber(parsedSnapDescriptor.y), `Invalid y value in snapDescriptor. Must be a number or a percentage string. Was ${descriptor.y}`);
				invariant(isNumber(parsedSnapDescriptor.scaleX), `Invalid scaleX value in snapDescriptor. Must be a number. Was ${descriptor.scaleX}`);
				invariant(isNumber(parsedSnapDescriptor.scaleY), `Invalid scaleY value in snapDescriptor. Must be a number. Was ${descriptor.scaleY}`);
                invariant(isNumber(parsedSnapDescriptor.rotation), `Invalid rotation in snapDescriptor. Must be a number. Was ${descriptor.rotation}`);
                invariant(isObject(parsedSnapDescriptor.customSnapProps), `Invalid customSnapProps in snapDescriptor. Must be an object. Was ${descriptor.customSnapProps}`);

                const snappingMatrix  = createSnappingMatrix(this.getMatrix(), this.getBaseDimensions(), draggableTransform, dragStateDescriptor.dimensions, parsedSnapDescriptor);

                //TODO: CAN THIS COMPARISON BE DONE IN A MORE ELEGANT WAY. MAYBE COMPARING EXTRACTED X AND Y FROM snappingMatrix and dragStateDescriptor.matrix instead?
                const {x, y} = transformPosition(this.getMatrix(), extractTranslation(dragStateDescriptor.matrix));
                const isPositionSnapped = x !== parsedSnapDescriptor.x || y !== parsedSnapDescriptor.y;

                return {
                    matrix: snappingMatrix,
                    baseDimensions: this.getBaseDimensions(),
                    customSnapProps: parsedSnapDescriptor.customSnapProps,
                    draggableDimensions: dragStateDescriptor.dimensions,
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
                const {dimensions} = dragStateDescriptor;

                switch (type) {
                    case 'start':
                        const globalSnapDescriptor = matrixToDescriptor(globalSnapMatrix, dimensions);
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