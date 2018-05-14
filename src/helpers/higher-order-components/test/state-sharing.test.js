import React from 'react';
import PropTypes from 'prop-types';
import {mount} from 'enzyme';
import {asStateSubscriber, asStatePublisher} from '../state-sharing';

describe('State sharing', () => {
    class Dummy extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                updated: false
            }
        } 

        render() {
            return (
                <div>
                    <span className="state">
                        {`Updated: ${this.state.updated}`}
                    </span>
                    <button onClick={() => this.setState({updated: true})}/>
                </div>
            );
        }
    }

    const DummyAsStatePublisher = asStatePublisher(Dummy);
    const DummyAsStateSubscriber = asStateSubscriber(Dummy);

    let handler;
    const context = {
        publishState: jest.fn((state) => handler(state)),
	    subscribeToState: jest.fn((h) => handler = h),
    	unsubscribeToState: jest.fn()  
    };

    const childContextTypes = {
        publishState: PropTypes.func,
        subscribeToState: PropTypes.func,
        unsubscribeToState: PropTypes.func
    };

    test('publisher updated own and subscribers state', () => {
        const wrapper = mount(
            <div>  
                <DummyAsStatePublisher/>
                <DummyAsStateSubscriber/>
            </div>
        , {context, childContextTypes});

        wrapper.find('button').at(0).simulate('click');
        expect(wrapper.find('.state').map(node => node.text())).toEqual(['Updated: true', 'Updated: true']);
    });

    test('subscriber is unable to update own state', () => {
        const wrapper = mount(
            <div>  
                <DummyAsStatePublisher/>
                <DummyAsStateSubscriber/>
            </div>
        , {context, childContextTypes});

        wrapper.find('button').at(1).simulate('click');
        expect(wrapper.find('.state').map(node => node.text())).toEqual(['Updated: false', 'Updated: false']);
    });
});