import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';

describe('CountryFlagPipe', () => {
	it('should create', () => {
		expect(new CountryFlagPipe()).toBeTruthy();
	});
});

describe('CountryTitle', () => {
	it('should create', () => {
		expect(new CountryTitle()).toBeTruthy();
	});
});
