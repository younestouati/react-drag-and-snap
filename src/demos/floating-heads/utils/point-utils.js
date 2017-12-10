const getOrigo = () => ({x: 0, y: 0});

const distance = (p1, p2 = getOrigo()) => Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));

const scalePoint = (point, scalar) => ({
	x: point.x * scalar,
	y: point.y * scalar
});

const addPoints = (p1, p2) => ({
	x: p1.x + p2.x,
	y: p1.y + p2.y
});

const extractPoint = (o) => ({
	x: o.x,
	y: o.y
});

const arePointsDifferent = (p1, p2) => p1.x !== p2.x || p1.y !== p2.y;

const byDistance = (a,b) => distance(a) - distance(b);

export {distance, getOrigo, scalePoint, byDistance, extractPoint, addPoints, arePointsDifferent};