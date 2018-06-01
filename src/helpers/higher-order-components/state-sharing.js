import React from 'react';
import PropTypes from 'prop-types';
import reactUtils from '../../utils/react-utils';
import { draggableContext } from '../../make-draggable';

/**
 * asStateSubscriber and asStatePublisher are two 'sibling' higher order components, that makes
 * it possible to have to components share state. One will publish its state each time it updates,
 * and the other one suppresses its own internal state, in favor of subscribing to an external
 * state which it will adopt.
 *
 * The components assume a common ancestor component will provide the methods subscribeToState,
 * unsubscribeToState, and publishState used to publish and subscribe to the state.
 *
 * Note that only the components own state will be synced - not the state of any subcomponents!
 */

// Higher order component that 'disables' the components own state in favor of subscribing an
// externally enforced state injected by means of a context-provided subscription method.
function asStateSubscriber(WrappedComponent) {
    class StateSubscriber extends WrappedComponent {
        constructor(props) {
            super(props);

            this.boundStateChangeHandler = this.stateChangeHandler.bind(this);
        }

        componentWillMount() {
            if (super.componentWillMount) {
                super.componentWillMount();
            }

            this.props.draggableContext.subscribeToState(this.boundStateChangeHandler);
        }

        componentWillUnmount() {
            if (super.componentWillUnmount) {
                super.componentWillUnmount();
            }

            this.props.draggableContext.unsubscribeToState(this.boundStateChangeHandler);
        }

        stateChangeHandler(state) {
            WrappedComponent.prototype.setState.call(this, state);
        }

        /* eslint-disable class-methods-use-this */
        setState() { /* Disabling setState for component */ }
        /* eslint-enable class-methods-use-this */
    }

    /* eslint-disable-next-line react/prefer-stateless-function */
    class StateSubscriberWithContext extends React.Component {
        render() {
            return (
                <draggableContext.Consumer>
                    {context => <StateSubscriber draggableContext={context} {...this.props} />}
                </draggableContext.Consumer>
            );
        }
    }

    StateSubscriberWithContext.displayName = `asStateSubscriber(
        ${reactUtils.getComponentDisplayName(WrappedComponent)}
    )`;

    return StateSubscriberWithContext;
}

// Higher order component that ensures the components internal state is published by means
// of a context provided publishing method
function asStatePublisher(WrappedComponent) {
    class StatePublisher extends WrappedComponent {
        componentWillUpdate(nextProps, nextState) {
            if (super.componentWillUpdate) {
                super.componentWillUpdate(nextProps, nextState);
            }

            this.props.draggableContext.publishState(nextState);
        }
    }

    /* eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp */
    class StatePublisherWithContext extends React.Component {
        render() {
            return (
                <draggableContext.Consumer>
                    {context => <StatePublisher draggableContext={context} {...this.props} />}
                </draggableContext.Consumer>
            );
        }
    }

    StatePublisherWithContext.displayName = `asStatePublisher(${reactUtils.getComponentDisplayName(WrappedComponent)})`;

    return StatePublisherWithContext;
}

export { asStateSubscriber, asStatePublisher };
