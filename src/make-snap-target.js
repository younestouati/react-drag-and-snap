import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { identity } from 'transformation-matrix';
import CustomPropTypes from './prop-types/custom-prop-types';
import {
    getTransformationMatrix,
    extractTranslation,
    deltaMatrix,
    transformMultiple,
    transformRotation,
    transformScale,
    transformSkew,
    transformVelocity,
    transformPosition,
    qrDecompose,
} from './utils/matrix-utils';
import DOMElementHelper from './helpers/misc/dom-element-helper';
import createSnapMatrix from './drag-snap-logic/create-snap-matrix';
import normalizeTransform from './drag-snap-logic/normalize-transform';
import makeClassBasedComponent from './helpers/higher-order-components/make-class-based-component';
import normalizeSnapTargetConfig from './drag-snap-logic/normalize-snap-target-config';
import DRAG_STATES from './drag-snap-logic/drag-states';
import SnapTargetCollectors from './defaults/default-snap-target-collectors';
import SnapPriorities from './defaults/default-snap-priorities';
import { shallowCloneExcluding, shallowEqual } from './utils/object-utils';
import reactUtils from './utils/react-utils';
import arrayUtils from './utils/array-utils';
import { isFunction, isObject, isNumber, isNullOrUndefined, isArray } from './utils/type-utils';
import guidUtils from './utils/guid-utils';
import { distance } from './utils/point-utils';
import { MainContext } from './drag-snap-context';
import sort from './utils/sort';

const SnapTargetContext = React.createContext({});

const SnapTargetPropTypes = {
    snapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    /* eslint-disable react/require-default-props */
    dragSnapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    releaseSnapPriority: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    externalTransformation: CustomPropTypes.transform,
    /* eslint-enable react/require-default-props */
    onDropStart: PropTypes.func,
    onDropComplete: PropTypes.func,
    onDropCancel: PropTypes.func,
    continuousUpdate: PropTypes.bool,
    /* eslint-disable-next-line react/forbid-prop-types */
    dragSnapContext: PropTypes.object.isRequired,
};

const LIBRARY_PROPS = Object.keys(SnapTargetPropTypes);

function configure(customConfig = {}, collect = SnapTargetCollectors.staticAndLowFrequencyProps) {
    const config = normalizeSnapTargetConfig(customConfig);

    return function makeSnapTarget(WrappedComponent) {
        class SnapTarget extends React.Component {
            constructor(props) {
                super(props);

                this.draggedItems = [];
                this.baseExternalTransformation = null;
                this.internalTransformation = null;
                this.matrix = null;
                this.size = null;
                this.DOMElementHelper = new DOMElementHelper();

                this.state = {
                    collectedDragProps: this.collectDragProps().collectedDragProps,
                };

                // Convert to class based component, if functional.
                // Functional components can't have refs since. We need refs
                this.ClassBasedWrappedComponent = makeClassBasedComponent(WrappedComponent);
                this.id = guidUtils.createGuid();

                this.boundSetInternalTransformation = this.setInternalTransformation.bind(this);
            }

            componentDidMount() {
                this.DOMElementHelper.updateElement(ReactDOM.findDOMNode(this.el));

                if (this.props.dragSnapContext.registerAsSnapTarget) {
                    this.props.dragSnapContext.registerAsSnapTarget(this.id, this);
                } else {
                    throw new Error('Not in a drag and snap context!');
                }
            }

            componentWillUnmount() {
                this.props.dragSnapContext.unregisterAsSnapTarget(this.id);
            }

            // For dropStart the additionalMatrix is the matrix describing the draggable when snapping is complete
            // for dropComplete the additionalMatrix is the matrix describing the draggable when it was released
            onDropEvent(type, draggableDescriptor, additionalMatrix) {
                const snapTargetSpecificDraggableDescriptor = this.makeSnapTargetSpecific(draggableDescriptor);
                
                const snapTargetSpecificAdditionalTransform = additionalMatrix
                    ? this.toSnapTargetSpecificTransform(additionalMatrix, draggableDescriptor.scaledSize)
                    : null;

                switch (type) {
                case 'start':
                    this.props.onDropStart(
                        snapTargetSpecificDraggableDescriptor,
                        this.getSelfDescriptor(),
                        snapTargetSpecificAdditionalTransform
                    );
                    break;
                case 'complete':
                    this.props.onDropComplete(
                        snapTargetSpecificDraggableDescriptor,
                        this.getSelfDescriptor(),
                        snapTargetSpecificAdditionalTransform
                    );
                    break;
                case 'cancel':
                    this.props.onDropCancel(snapTargetSpecificDraggableDescriptor, this.getSelfDescriptor());
                    break;
                default:
                    break;
                }
            }

            getMatrix() {
                if (!this.matrix) {
                    this.matrix = getTransformationMatrix(this.DOMElementHelper.getElement());
                    this.baseExternalTransformation = this.props.externalTransformation;
                }

                const externalDelta = this.props.externalTransformation
                    ? deltaMatrix(this.baseExternalTransformation, this.props.externalTransformation)
                    : identity();

                const internalDelta = this.internalTransformation
                    ? deltaMatrix({
                        x: 0, y: 0, rotate: 0, skewX: 0, scale: 1,
                    }, this.internalTransformation)
                    : identity();

                return transformMultiple(this.matrix, externalDelta, internalDelta);
            }

            getSize() {
                // If size is queried before first render, just report 0 size
                return this.DOMElementHelper.getSizeOrDefault({ width: 0, height: 0 });
            }

            getScaledSize() {
                const size = this.getSize();
                const { scaleX, scaleY } = qrDecompose(this.getMatrix());

                return {
                    width: size.width * scaleX,
                    height: size.height * scaleY,
                };
            }

            getProps() {
                const { collectedDragProps } = this.state;

                return isArray(collectedDragProps)
                    ? { ...shallowCloneExcluding(this.props, LIBRARY_PROPS), snapTargetSize: this.getSize(), draggedItems: collectedDragProps }
                    : { ...shallowCloneExcluding(this.props, LIBRARY_PROPS), snapTargetSize: this.getSize(), ...collectedDragProps };
            }

            getSelfDescriptor() {
                return { ...this.getSize(), props: this.getProps(), snapTarget: this.el };
            }

            getParams(draggableDescriptor) {
                return [
                    this.makeSnapTargetSpecific(draggableDescriptor),
                    this.getSelfDescriptor(),
                    { draggedItems: this.draggedItems },
                ]; // TODO: SHOULD WE SOMEHOW INJECT THE draggableToTarget and targetToDraggable matrices here?
            }

            getSnapPriority(dragState, draggableDescriptor) {
                const { releaseSnapPriority, dragSnapPriority, snapPriority: commonPriority } = this.props;
                const snapPriority = (dragState === DRAG_STATES.RELEASED
                    ? releaseSnapPriority
                    : dragSnapPriority) || commonPriority;
                const params = this.getParams(draggableDescriptor);
                const priority = isFunction(snapPriority) ? snapPriority(...params) : snapPriority;

                invariant(isNumber(priority), 'snapPriority must be a number or a function that returns a number.');
                invariant(priority >= 1, `SnapPriority should be 1 (highest priority) or larger. Was ${priority}`);

                return priority;
            }

            getSnapping(dragState, draggableDescriptor) {
                const transform = dragState === DRAG_STATES.RELEASED
                    ? config.releaseSnapTransform
                    : config.dragSnapTransform;
                const params = this.getParams(draggableDescriptor);
                const snapTransform = isFunction(transform) ? transform(...params) : transform;

                const normalizedSnapTransform = normalizeTransform(
                    snapTransform,
                    draggableDescriptor.scaledSize,
                    this.getScaledSize()
                );

                const snapMatrix = createSnapMatrix(
                    this.getMatrix(),
                    normalizedSnapTransform,
                    this.DOMElementHelper,
                    draggableDescriptor.DOMElementHelper
                );

                const { x, y } = transformPosition(this.getMatrix(), extractTranslation(draggableDescriptor.matrix));
                const isPositionSnapped = x !== normalizedSnapTransform.x || y !== normalizedSnapTransform.y;

                return {
                    matrix: snapMatrix,
                    customSnapProps: normalizedSnapTransform.customSnapProps,
                    isPositionSnapped,
                    snapTargetId: this.id,
                };
            }

            getId() {
                return this.id;
            }

            setInternalTransformation(internalTransformation) {
                this.internalTransformation = internalTransformation;
            }

            updateItem(draggableDescriptor) {
                const localDragStateDescriptor = this.makeSnapTargetSpecific(draggableDescriptor);
                this.draggedItems = this.draggedItems
                    .filter(p => p.id !== draggableDescriptor.id).concat(localDragStateDescriptor);
                this.updateDragProps();
            }

            removeItem(id) {
                this.draggedItems = this.draggedItems.filter(d => d.id !== id);
                this.updateDragProps();
            }

            updateDragProps() {
                const { collectedDragProps, hasChanged } = this.collectDragProps(this.state.collectedDragProps);

                if (hasChanged) {
                    this.setState({ collectedDragProps });
                }
            }

            collectDragProps(cur) {
                const items = this.draggedItems || [];
                items.sort(sort.byId);

                const next = collect(
                    items,
                    {
                        ...this.getSize(),
                        props: shallowCloneExcluding(this.props, LIBRARY_PROPS),
                    }
                );

                invariant(
                    isObject(next) || (isArray(next) && next.length === items.length),
                    'collect function must return an object or an array of objects equal to the number of dragged items'
                );

                const hasChanged = (
                    isNullOrUndefined(cur) ||
                    (isObject(next) && !shallowEqual(cur, next)) ||
                    (isArray(next) && (cur.length !== next.length || next.some((o, i) => !shallowEqual(o, cur[i]))))
                );

                return {
                    hasChanged,
                    collectedDragProps: next,
                };
            }

            isSnapCriteriaMet(dragState, draggableDescriptor) {
                const criteria = arrayUtils.toArray(dragState === DRAG_STATES.RELEASED
                    ? config.releaseSnapCriteria
                    : config.dragSnapCriteria);
                const params = this.getParams(draggableDescriptor);
                return criteria.every(criterium => criterium(...params));
            }

            toSnapTargetSpecificTransform(matrix, scaledSize) {
                const {
                    x, y, rotate, skewX, skewY,
                } = qrDecompose(matrix);
                const localPosition = transformPosition(this.getMatrix(), { x, y });
                const localRotation = transformRotation(this.getMatrix(), rotate);
                const localScale = transformScale(this.getScaledSize(), scaledSize);
                const localSkew = transformSkew(this.getMatrix(), { x: skewX, y: skewY });
               
                return {
                    rotate: localRotation,
                    ...localPosition,
                    ...localScale,
                    ...localSkew,
                };
            }

            // Converts the descriptor, velocity and cursor point from the global (window) coordinate system,
            // to the local coordinate system of the snap taget.
            makeSnapTargetSpecific({
                id,
                dragState,
                dragData,
                matrix,
                scaledSize,
                velocity,
                cursorPosition,
                snapTargetId,
                snapCount,
            }) {
                const localTransform = this.toSnapTargetSpecificTransform(matrix, scaledSize);
                const isSnappingToThisTarget = (this.id === snapTargetId);
                const isSnappingToOtherTarget = !isNullOrUndefined(snapTargetId) && !isSnappingToThisTarget;

                return {
                    id,
                    dragState,
                    dragData,
                    transform: localTransform,
                    distance: distance({ x: localTransform.x, y: localTransform.y }),
                    velocity: velocity ? transformVelocity(this.getMatrix(), velocity) : null,
                    cursorPosition: cursorPosition ? transformPosition(this.getMatrix(), cursorPosition) : null,
                    isSnappingToThisTarget,
                    isSnappingToOtherTarget,
                    snapCount: snapCount[this.id] || 0,
                };
            }

            continuousUpdateIfEnabled() {
                if (this.props.continuousUpdate) {
                    this.update();
                }
            }

            update() {
                this.matrix = null; // Invalidate the matrix, so it will be recalculated next time it is needed
                this.DOMElementHelper.refresh();
            }

            render() {
                return (
                    <SnapTargetContext.Provider
                        value={{
                            setInternalTransformation: this.boundSetInternalTransformation,
                        }}
                    >
                        <this.ClassBasedWrappedComponent {...this.getProps()} ref={el => (this.el = el)} />
                    </SnapTargetContext.Provider>
                );
            }
        }

        SnapTarget.propTypes = SnapTargetPropTypes;

        SnapTarget.defaultProps = {
            onDropStart: () => {},
            onDropComplete: () => {},
            onDropCancel: () => {},
            continuousUpdate: false,
            snapPriority: SnapPriorities.distanceBasedWithOffset(100),
        };

        // Injecting context as a prop so it can be accessed outside the render function in the snapTarget
        const SnapTargetWithContext = props => (
            <MainContext.Consumer>
                {context => (
                    <SnapTargetContext.Provider>
                        <SnapTarget dragSnapContext={context} {...props} />
                    </SnapTargetContext.Provider>
                )}
            </MainContext.Consumer>
        );

        SnapTargetWithContext.displayName = `makeSnapTarget(${reactUtils.getComponentDisplayName(WrappedComponent)})`;

        return SnapTargetWithContext;
    };
}

export { SnapTargetContext };
export default configure;
