const RULES = {
	knight: {
		isLegalMove: (src, dst) => {
			const dx = Math.abs(src[0] - dst[0]);
			const dy = Math.abs(src[1] - dst[1]);

			return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
		}
	}
};

export {RULES};