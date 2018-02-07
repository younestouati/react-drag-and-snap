import PropTypes from 'prop-types';
import {getDisplayName} from '../../utils/react-utils';

/**
 * asStateSubscriber and asStatePublisher are two 'sibling' higher order components, that makes it possible to have to
 * components share state. One will publish its state each time it updates, and the other one suppresses its own internal
 * state, in favor of subscribing to an external state which it will adopt.
 *
 * The components assume a common ancestor component will provide the methods subscribeToState, unsubscribeToState, and
 * publishState used to publish and subscribe to the state.
 *
 * Note that only the components own state will be synced - not the state of any subcomponents!
 */

//Higher order component that 'disables' the components own state in favor of subscribing an externally enforced state
//injected by means of a context-provided subscription method.
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

			this.context.subscribeToState(this.boundStateChangeHandler);
		}

		componentWillUnmount() {
			if (super.componentWillUnmount) {
				super.componentWillUnmount();
			}

			this.context.unsubscribeToState(this.boundStateChangeHandler);
		}

		stateChangeHandler(state) {
			WrappedComponent.prototype.setState.call(this, state);
		}

		setState() {/*Disabling setState for component*/}
	}

	StateSubscriber.contextTypes = {
		subscribeToState: PropTypes.func.isRequired,
		unsubscribeToState: PropTypes.func.isRequired
	};

	StateSubscriber.displayName = `asStateSubscriber(${getDisplayName(WrappedComponent)})`;

	return StateSubscriber;
}

//Higher order component that ensures the components internal state is published by means of a context provided publishing
//method
function asStatePublisher(WrappedComponent) {
	class StatePublisher extends WrappedComponent {
		componentWillUpdate(nextProps, nextState) {
			if (super.componentWillUpdate) {
				super.componentWillUpdate(nextProps, nextState);
			}

			this.context.publishState(nextState);
		}
	}

	StatePublisher.contextTypes = {
		publishState: PropTypes.func.isRequired
	};

	StatePublisher.displayName = `asStatePublisher(${getDisplayName(WrappedComponent)})`;

	return StatePublisher;
}

export {asStateSubscriber, asStatePublisher};