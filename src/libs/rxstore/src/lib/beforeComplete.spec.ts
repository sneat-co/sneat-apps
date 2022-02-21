import {beforeComplete} from './beforeComplete';

describe('beforeComplete', () => {
	it('should be created', () => {
		const operator = beforeComplete(() => {});
		expect(operator)
			.toBeTruthy();
	});
});
