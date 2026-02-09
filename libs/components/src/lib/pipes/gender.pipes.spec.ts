import {
	GenderIconNamePipe,
	GenderEmojiPipe,
	GenderColorPipe,
} from './gender.pipes';

describe('GenderIconNamePipe', () => {
	it('should create', () => {
		expect(new GenderIconNamePipe()).toBeTruthy();
	});
});

describe('GenderEmojiPipe', () => {
	it('should create', () => {
		expect(new GenderEmojiPipe()).toBeTruthy();
	});
});

describe('GenderColorPipe', () => {
	it('should create', () => {
		expect(new GenderColorPipe()).toBeTruthy();
	});
});
