import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { ICalendarFilter } from './calendar/components/calendar-filter/calendar-filter';

export const emptyCalendarFilter: ICalendarFilter = {
  text: '',
  showRecurrings: true,
  showSingles: true,
  contactIDs: [],
  weekdays: [],
  repeats: [],
};

export class CalendarFilterService {
  private readonly filter$ = new BehaviorSubject<ICalendarFilter>(
    emptyCalendarFilter,
  );
  public readonly filter = this.filter$
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
// console.log('ScheduleFilterService.constructor()');
  }

  next(filter: ICalendarFilter): void {
// console.log('ScheduleFilterService.next()', filter);
    if (this.filter$.value == filter) {
      return;
    }
    this.filter$.next(filter);
  }

  resetScheduleFilter(event: Event): void {
    event.stopPropagation();
    this.filter$.next(emptyCalendarFilter);
  }
}
