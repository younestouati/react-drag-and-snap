import { extractPointFromEvent, extractFirstIdentifier } from '../mouse-touch-event';

test('extractFirstIdentifier returns "mouse" if event has no changedTouches property', () => {
    expect(extractFirstIdentifier({})).toMatch(/mouse/);
});

test('extractFirstIdentifier returns first identifier from changedTouches property', () => {
    const itemMock = jest.fn();
    itemMock.mockReturnValueOnce({ identifier: 'some-identifier' });

    const e = {
        changedTouches: {
            item: itemMock,
        },
    };

    expect(extractFirstIdentifier(e)).toMatch(/some-identifier/);
});

test('extractPointFromEvent extracts point from mouse event', () => {
    const event = { clientX: 1, clientY: 2 };

    const mousePoint = extractPointFromEvent(event, 'mouse');
    expect(mousePoint).toEqual({ x: 1, y: 2 });
});

test('extractPointFromEvent extracts point from touch event', () => {
    const itemMock = jest.fn();
    itemMock
        .mockReturnValueOnce({ identifier: 'some-identifier', clientX: -1, clientY: -2 })
        .mockReturnValueOnce({ identifier: 'touch-event-identifier', clientX: 1, clientY: 2 });

    const event = {
        changedTouches: {
            item: itemMock,
        },
    };

    event.changedTouches.length = 2;

    const mousePoint = extractPointFromEvent(event, 'touch-event-identifier');
    expect(mousePoint).toEqual({ x: 1, y: 2 });
});
