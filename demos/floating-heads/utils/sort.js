const sort = (array, comparator) => {
	const newArray = array.slice(0);
	newArray.sort(comparator);
	return newArray;
};

export {sort};
