import {RegExpCheck} from './regexp_check';

describe('RegExpCheck', () => {
	const check = new RegExpCheck(/\w+/);

	let result = check.checkValue('abc');
	if (!result.ok) {
		throw new Error('expected to pass');
	}
	if (result.message) {
		throw new Error('expected not to have a message for passed validation');
	}

	result = check.checkValue('123');
	if (result.ok) {
		throw new Error('expected to fail');
	}
})
