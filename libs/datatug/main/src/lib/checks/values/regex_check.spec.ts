import { RegExpCheck } from './regexp_check';

describe('RegExpCheck', () => {
	const check = new RegExpCheck(/^[a-zA-Z]+$/);

	it('should pass for alphabetic string', () => {
		const result = check.checkValue('abc');
		expect(result.ok).toBe(true);
		expect(result.message).toBeUndefined();
	});

	it('should fail for numeric string', () => {
		const result = check.checkValue('123');
		expect(result.ok).toBe(false);
	});
});
