function extractPointFromEvent(e, identifier) {
	const points = {};
	if (e.changedTouches) {
		for (let i=0;i<e.changedTouches.length;i++) {
			const touch = e.changedTouches.item(i);
			points[touch.identifier] = {
				x: touch.clientX,
				y: touch.clientY
			}
		}
	} else {
		points.mouse = {
			x: e.clientX,
			y: e.clientY
		};
	}

	return points[identifier];
}

function extractFirstIdentifier(e) {
	if (e.changedTouches) {
		return e.changedTouches.item(0).identifier;
	}

	return 'mouse';
}

export {extractPointFromEvent, extractFirstIdentifier};