import PointerTracker from '../pointer-tracker';

test('PointerTracker correctly tracks the given pointer (cursor or finger)', () => {
    const startCallback = jest.fn();
    const moveCallback = jest.fn();
    const endCallback = jest.fn();

    const MockEventThrottler = jest.fn();
    MockEventThrottler.prototype.addEvent = jest.genMockFn();
    MockEventThrottler.prototype.pause = jest.genMockFn();
    /* MockEventThrottler.prototype.addEvent.mockImplementation(function (key, link) {}); */

    let moveEventHandler;
    let endEventHandler;
    window.addEventListener = jest.fn((eventType, handler) => {
        moveEventHandler = (eventType === 'mousemove') ? handler : moveEventHandler;
        endEventHandler = (eventType === 'mouseup') ? handler : endEventHandler;
    });
    window.removeEventListener = jest.fn();

    const pointerTracker = new PointerTracker(startCallback, moveCallback, endCallback, MockEventThrottler);
    expect(MockEventThrottler.mock.calls).toHaveLength(1);
    expect(MockEventThrottler.mock.calls[0][0]).toBe(moveCallback);

    pointerTracker.track({ clientX: 1, clientY: 2 });

    // New events will be added to the event throttler
    const relevantEvent = { clientX: 3, clientY: 4, preventDefault: jest.fn() };
    moveEventHandler(relevantEvent);
    expect(MockEventThrottler.prototype.addEvent.mock.calls).toHaveLength(1);
    expect(MockEventThrottler.prototype.addEvent.mock.calls[0][0]).toEqual({ x: 3, y: 4 });

    // New events with another identifer will be ignored
    const itemMock = jest.fn();
    itemMock.mockReturnValue({ identifier: 'other-identifer', clientX: -1, clientY: -2 });

    const irrelevantEvent = {
        changedTouches: { item: itemMock },
        preventDefault: jest.fn(),
    };

    moveEventHandler(irrelevantEvent);
    expect(MockEventThrottler.prototype.addEvent.mock.calls).toHaveLength(1);

    // End event handler
    endEventHandler({ clientX: 5, clientY: 4, preventDefault: jest.fn() });
    expect(endCallback.mock.calls).toHaveLength(1);
    expect(endCallback.mock.calls[0][0]).toEqual({ x: 5, y: 4 });
    expect(MockEventThrottler.prototype.pause.mock.calls).toHaveLength(1);
});
