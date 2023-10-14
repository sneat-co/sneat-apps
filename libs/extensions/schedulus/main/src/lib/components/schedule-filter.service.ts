import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { IScheduleFilter } from './schedule-filter/schedule-filter';

export const emptyScheduleFilter: IScheduleFilter = {
	text: '',
	showRecurrings: true,
	showSingles: true,
};

export class ScheduleFilterService {
	private readonly filter$ = new BehaviorSubject<IScheduleFilter>(
		emptyScheduleFilter,
	);
	public readonly filter = this.filter$
		.asObservable()
		.pipe(distinctUntilChanged());

	constructor() {
		console.log('ScheduleFilterService.constructor()');
	}

	next(filter: IScheduleFilter): void {
		console.log('ScheduleFilterService.next()', filter);
		if (this.filter$.value == filter) {
			return;
		}
		this.filter$.next(filter);
	}

	readonly resetFilterHandler = (event: Event): void => {
		event.stopPropagation();
		this.resetScheduleFilter();
	};

	resetScheduleFilter(): void {
		this.filter$.next(emptyScheduleFilter);
	}
}
