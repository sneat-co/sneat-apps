export const eq = <T = string | number>(x?: T, y?: T) => !x && !y || x === y;
