import { CalendarBaseComponent } from './calendar-base.component';

export class CalendarBriefComponent extends CalendarBaseComponent {
	override onRecurringsLoaded(): void {
		// do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onDayChanged(d: Date): void {
		// do nothing
	}
}
