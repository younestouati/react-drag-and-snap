const randomlyOneOf = (...args) => args[Math.floor(Math.random() / (1/args.length))];
const randomInRange = (min, max) => Math.random() * (max - min) + min;

export {randomlyOneOf, randomInRange};