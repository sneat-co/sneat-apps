import { BehaviorSubject } from 'rxjs';
import { IScheduleFilter } from './schedule-filter/schedule-filter';

export const emptyScheduleFilter: IScheduleFilter = { text: '', showRecurrings: true, showSingles: true };

export class ScheduleFilterService {
	private readonly filter$ = new BehaviorSubject<IScheduleFilter>(emptyScheduleFilter);
	public readonly filter = this.filter$.asObservable();

	next(filter: IScheduleFilter): void {
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
