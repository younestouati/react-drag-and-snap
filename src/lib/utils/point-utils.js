const addPoints = (p1, p2) => ({
	x: p1.x + p2.x,
	y: p1.y + p2.y
});

const subtractPoints = (p1, p2) => ({
	x: p1.x - p2.x,
	y: p1.y - p2.y
});

const averagePoints = (points) => ({
	x: points.reduce(function (acc, curr) {return curr.x + acc}, 0) / points.length,
	y: points.reduce(function (acc, curr) {return curr.y + acc}, 0) / points.length
});

const scalePoint = (point, scale) => ({
	x: point.x * scale,
	y: point.y * scale
});

const distance = (p1, p2 = {x: 0, y: 0}) => (
	Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))
);

const getOrigo = () => ({x: 0, y: 0});

export {addPoints, subtractPoints, averagePoints, scalePoint, distance, getOrigo};