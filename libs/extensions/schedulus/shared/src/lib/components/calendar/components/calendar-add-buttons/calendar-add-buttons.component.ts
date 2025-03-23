import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import {
	HappeningType,
	WeekdayCode2,
	NewHappeningParams,
	ScheduleNavService,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-calendar-add-buttons',
	templateUrl: './calendar-add-buttons.component.html',
	imports: [IonButtons, IonButton, IonIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarAddButtonsComponent {
	@Input({ required: true }) public space?: ISpaceContext;

	@Input({ required: true }) dateID?: string;
	@Input({ required: true }) weekdayID?: WeekdayCode2;

	constructor(private readonly scheduleNavService: ScheduleNavService) {}

	protected newHappeningUrl(type: HappeningType): string {
		const params: string[] = [];
		if (this.weekdayID && type === 'recurring') {
			params.push(`wd=${this.weekdayID}`);
		}
		if (this.dateID && type === 'single') {
			params.push(`date=${this.dateID}`);
		}
		return (
			`space/${this.space?.type}/${this.space?.id}/new-happening?type=${type}` +
			(params.length === 0 ? '' : `&${params.join('&')}`)
		);
	}

	protected goNewHappening(event: Event, type: HappeningType): boolean {
		console.log(
			'CalendarAddButtonsComponent.goNewHappening()',
			type,
			this.space,
		);
		event.preventDefault();
		event.stopPropagation();
		if (!this.space) {
			return false;
		}
		const params: NewHappeningParams = {
			type,
			wd: type === 'recurring' ? this.weekdayID : undefined,
			date: type === 'single' ? this.dateID : undefined,
		};
		this.scheduleNavService.goNewHappening(this.space, params);
		return false;
	}
}
