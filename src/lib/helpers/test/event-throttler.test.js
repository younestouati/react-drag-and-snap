import {EventThrottler} from '../event-throttler';

test('EventThrottler correctly throttles the given events', () => {
    const handler = jest.fn();
    let requestAnimationFrameHandler;

    window.requestAnimationFrame = jest.fn(h => requestAnimationFrameHandler = h);
    window.cancelAnimationFrame = jest.fn();
    
    const eventThrottler = new EventThrottler(handler);

    eventThrottler.addEvent({x: 1, y: 2});
    eventThrottler.addEvent({x: 4, y: 2});
    requestAnimationFrameHandler();
    
    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toEqual({x: 4, y: 2});
    
    eventThrottler.addEvent({x: 6, y: 2});
    requestAnimationFrameHandler();
    
    expect(handler.mock.calls.length).toBe(2);
    expect(handler.mock.calls[1][0]).toEqual({x: 6, y: 2});

    expect(window.cancelAnimationFrame.mock.calls.length).toBe(0);
    eventThrottler.pause();
    expect(window.cancelAnimationFrame.mock.calls.length).toBe(1);

});