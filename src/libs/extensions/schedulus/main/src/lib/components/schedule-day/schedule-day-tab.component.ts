import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { dateToIso, isoStringsToDate } from '@sneat/core';
import { ITeamContext } from '@sneat/team/models';
import { Subject, takeUntil } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ScheduleStateService } from '../schedule-state.service';

@Component({
	selector: 'sneat-day-tab',
	templateUrl: 'schedule-day-tab.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDayTabComponent implements OnDestroy {

	private readonly destroyed = new Subject<void>();
	public displayDatePicker = false;
	public date?: Date;

	public get dateAsIsoString(): string | undefined {
		return this.date && dateToIso(this.date);
	}

	@Input() team?: ITeamContext;
	@Input() teamDaysProvider?: TeamDaysProvider;

	@Input() onSlotClicked?: (slot: ISlotItem) => void = (_: ISlotItem) => {
		throw new Error('onSlotClicked not set');
	};

	constructor(
		private readonly scheduleSateService: ScheduleStateService,
		private readonly popoverController: PopoverController,
	) {
		scheduleSateService.dateChanged
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: value => {
					this.date = value.date;
				},
			});
	}


	onPickerDateChanged(event: Event): void {
		const ce = event as CustomEvent;
		const value: string = ce.detail.value;
		console.log('onPickerDateChanged()', value);
		const date = isoStringsToDate(value);
		this.scheduleSateService.setActiveDate(date);
		this.popoverController.dismiss().catch(console.error);
	}

	swipe(days: 1 | -1, event: Event): void {
		event.stopPropagation();
		this.scheduleSateService.shiftDays(days);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
