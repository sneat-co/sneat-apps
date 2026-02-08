import { IAvatar } from './avatar';

describe('auth models sanity', () => {
	it('should allow creating an IAvatar object', () => {
		const avatar: IAvatar = { gravatar: 'test' };
		expect(avatar.gravatar).toBe('test');
	});
});
