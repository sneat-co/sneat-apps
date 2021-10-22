type Portion = [
	'year' | 'day' | 'hour' | 'minute' | 'second',
	'min' | 'sec' | undefined,
	(seconds: number) => number
];

const y = 31536000,
	d = 86400,
	h = 3600;

const portions: Portion[] = [
	['year', undefined, (s) => Math.floor(s / y)],
	['day', undefined, (s) => Math.floor((s % y) / d)],
	['hour', undefined, (s) => Math.floor(((s % y) % d) / h)],
	['minute', 'min', (s) => Math.floor((((s % y) % d) % h) / 60)],
	['second', 'sec', (s) => Math.floor((((s % y) % d) % h) % 60)],
];

export const secondsToStr = (s: number): string | undefined => {
	if (s === undefined || s === null) {
		return undefined;
	}
	const a = portions.map((v) => [v[0], v[1], v[2](s)]).filter((v) => v[2]);
	return a
		.map(
			(v) =>
				v[2] +
				' ' +
				(a.length === 1 || !v[1] ? v[0] : v[1]) +
				(v[2] === 1 ? '' : 's')
		)
		.join(' ');
};
