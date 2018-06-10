function extractPointFromEvent(e, identifier) {
    const points = {};
    if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i += 1) {
            const touch = e.changedTouches.item(i);
            points[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY,
            };
        }
    } else {
        points.mouse = {
            x: e.clientX,
            y: e.clientY,
        };
    }

    return points[identifier];
}

function extractFirstIdentifier(e) {
    return e.changedTouches
        ? e.changedTouches.item(0).identifier
        : 'mouse';
}

export { extractPointFromEvent, extractFirstIdentifier };
