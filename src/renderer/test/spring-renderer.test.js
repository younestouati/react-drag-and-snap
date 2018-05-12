import React from 'react';
import {mount} from 'enzyme';
import {SpringRenderer} from '../spring-renderer';

test('Spring Renderer applies the given transform props to the wrapper div', () => {
    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRestAfterRelease={() => {}}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={() => {}}
            springConfig={{stiffness: 30, damping: 40}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));

    const style = wrapper.find('div').at(0).prop('style');
    expect(style.transformOrigin).toMatch('50% 50%');
    expect(style.transform).toMatch('translate3d(calc(1px - 50%),calc(2px - 50%), 0) rotate(3deg) scaleX(4) scaleY(5) skewX(6deg) skewY(7deg)');
    expect(style.WebkitTouchCallout).toMatch('none');
    expect(style.WebkitUserSelect).toMatch('none');
    expect(style.userSelect).toMatch('none');
    expect(style.position).toMatch('absolute');
    expect(style.left).toMatch('50%');
    expect(style.top).toMatch('50%');
});

test('Spring Renderer invokes the onRestAfterRelease callback when coming to rest after being released', (done) => {
    const restAfterReleaseHandler = jest.fn(() => done());
    
    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRestAfterRelease={restAfterReleaseHandler}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={() => {}}
            springConfig={{stiffness: 170, damping: 26}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));

    wrapper.setProps({
        x: 5,
        isReleased: true
    });
});

test('Spring Renderer will not invoke onRestAfterRelease when coming to rest, if it is not released', (done) => {    
    const restAfterReleaseHandler = jest.fn();
    const restHandler = () => {
        expect(restAfterReleaseHandler.mock.calls.length).toBe(0);
        done();
    };
    
    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRest={restHandler}
            onRestAfterRelease={restAfterReleaseHandler}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={() => {}}
            springConfig={{stiffness: 170, damping: 26}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));

    wrapper.setProps({x: 5});
});

test('Spring Renderer invokes the onRestAfterRelease callback when released while already at rest when being released', (done) => {
    const restAfterReleaseHandler = jest.fn(() => done());

    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRest={() => wrapper.setProps({isReleased: true})}
            onRestAfterRelease={restAfterReleaseHandler}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={() => {}}
            springConfig={{stiffness: 170, damping: 26}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));

    wrapper.setProps({x: 5});
});

test('Spring Renderer invokes onRegrab callback when mouse is down', (done) => {
    const onRegrab = jest.fn(() => done());

    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRestAfterRelease={() => {}}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={onRegrab}
            springConfig={{stiffness: 170, damping: 26}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));
    
    wrapper.find('div').at(0).simulate('mouseDown');
});

test('Spring Renderer invokes onRegrab callback when touch start', (done) => {
    const onRegrab = jest.fn(() => done());

    const wrapper = mount((
        <SpringRenderer
            x={1}
            y={2}
            rotate={3}
            scaleX={4}
            scaleY={5}
            skewX={6}
            skewY={7}
            onRestAfterRelease={() => {}}
            isReleased={false}
            ignoreSticky={false}
            onRegrab={onRegrab}
            springConfig={{stiffness: 170, damping: 26}}
            sticky={true}
        >
            <div/>;
        </SpringRenderer>
    ));
    
    wrapper.find('div').at(0).simulate('touchStart');
});