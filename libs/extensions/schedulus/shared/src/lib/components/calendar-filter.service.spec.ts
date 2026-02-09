import {
	CalendarFilterService,
	emptyCalendarFilter,
} from './calendar-filter.service';

describe('CalendarFilterService', () => {
	it('should be created', () => {
		expect(new CalendarFilterService()).toBeTruthy();
	});

	it('should have initial filter as emptyCalendarFilter', () => {
		return new Promise<void>((resolve) => {
			const service = new CalendarFilterService();
			service.filter.subscribe((filter) => {
				expect(filter).toEqual(emptyCalendarFilter);
				resolve();
			});
		});
	});
});
