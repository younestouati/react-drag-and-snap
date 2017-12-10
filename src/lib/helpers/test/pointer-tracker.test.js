import {PointerTracker} from '../pointer-tracker';

test('PointerTracker correctly tracks the given pointer (cursor or finger)', () => {
    const startCallback = jest.fn();
    const moveCallback = jest.fn();
    const endCallback = jest.fn();
    
    const MockEventThrottler = jest.fn();
    MockEventThrottler.prototype.addEvent = jest.genMockFn();
    MockEventThrottler.prototype.pause = jest.genMockFn();
    /*MockEventThrottler.prototype.addEvent.mockImplementation(function (key, link) {});*/

    let moveEventHandler;
    let endEventHandler;
    window.addEventListener = jest.fn((eventType, handler) => {
        moveEventHandler = (eventType === 'mousemove') ? handler : moveEventHandler;
        endEventHandler = (eventType === 'mouseup') ? handler : endEventHandler;
    });
    window.removeEventListener = jest.fn();

    const pointerTracker = new PointerTracker(startCallback, moveCallback, endCallback, MockEventThrottler);
    expect(MockEventThrottler.mock.calls.length).toBe(1);
    expect(MockEventThrottler.mock.calls[0][0]).toBe(moveCallback);

    pointerTracker.track({clientX: 1, clientY: 2});

    //New events will be added to the event throttler
    const relevantEvent = {clientX: 3, clientY: 4, preventDefault: jest.fn()};
    moveEventHandler(relevantEvent);
    expect(MockEventThrottler.prototype.addEvent.mock.calls.length).toBe(1);
    expect(MockEventThrottler.prototype.addEvent.mock.calls[0][0]).toEqual({x: 3, y: 4});

    //New events with another identifer will be ignored
    const itemMock = jest.fn();    
    itemMock.mockReturnValue({identifier: 'other-identifer', clientX: -1, clientY: -2});
    
    const irrelevantEvent = {
        changedTouches: {item: itemMock},
        preventDefault: jest.fn()
    };

    moveEventHandler(irrelevantEvent);
    expect(MockEventThrottler.prototype.addEvent.mock.calls.length).toBe(1);

    //End event handler
    endEventHandler({clientX: 5, clientY: 4, preventDefault: jest.fn()});
    expect(endCallback.mock.calls.length).toBe(1);
    expect(endCallback.mock.calls[0][0]).toEqual({x: 5, y: 4});
    expect(MockEventThrottler.prototype.pause.mock.calls.length).toBe(1);
});


/*
import {Speedometer} from '../speedometer';

test('speedometer.getVelocity returns the veloctiy', () => {
    let pointerEventHandler;
    let tick;

    window.addEventListener = jest.fn((eventName, h) => pointerEventHandler = h);
    window.requestAnimationFrame = jest.fn((h) => tick = h);
    window.removeEventListener = jest.fn();
    window.cancelAnimationFrame = jest.fn();
    window.performance = {now: jest.fn()};
    window.performance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(15)
        .mockReturnValueOnce(40);

    const speedometer = new Speedometer();
    speedometer.start();
    pointerEventHandler({clientX: 10, clientY: 20});
    tick();
    pointerEventHandler({clientX: 100, clientY: 200}); //Should not impact the velocity, will be overriden before next tick
    pointerEventHandler({clientX: 20, clientY: 40});
    tick();
    pointerEventHandler({clientX: 40, clientY: 80});
    tick();

    const velocity = speedometer.getVelocity();
    expect(velocity).toEqual({x: 0.8, y: 1.6});

    expect(window.cancelAnimationFrame.mock.calls.length).toBe(0);
    expect(window.removeEventListener.mock.calls.length).toBe(0);

    speedometer.stop();

    expect(window.cancelAnimationFrame.mock.calls.length).toBe(1);
    expect(window.removeEventListener.mock.calls.length).toBe(1);
});
*/