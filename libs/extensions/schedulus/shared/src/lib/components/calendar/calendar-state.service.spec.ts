import {
	CalendarStateService,
	getToday,
	addDays,
} from './calendar-state.service';

describe('CalendarStateService', () => {
	it('should be created', () => {
		expect(new CalendarStateService()).toBeTruthy();
	});
});

describe('getToday', () => {
	it('should return a date with time set to midnight', () => {
		const today = getToday();
		expect(today.getHours()).toBe(0);
		expect(today.getMinutes()).toBe(0);
		expect(today.getSeconds()).toBe(0);
		expect(today.getMilliseconds()).toBe(0);
	});
});

describe('addDays', () => {
	it('should add days to date', () => {
		const date = new Date(2024, 0, 1);
		const result = addDays(date, 5);
		expect(result.getDate()).toBe(6);
	});

	it('should return same date when adding 0 days', () => {
		const date = new Date(2024, 0, 1);
		const result = addDays(date, 0);
		expect(result).toBe(date);
	});
});
