import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { dateToIso, isoStringsToDate } from '@sneat/core';
import { ISpaceContext } from '@sneat/team-models';
import { Subject, takeUntil } from 'rxjs';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';
import { addDays, CalendarStateService } from '../../calendar-state.service';

@Component({
	selector: 'sneat-day-tab',
	templateUrl: 'calendar-day-tab.component.html',
	styleUrls: ['calendar-day-tab.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayTabComponent implements OnDestroy {
	private readonly destroyed = new Subject<void>();
	public date?: Date;

	public get dateAsIsoString(): string | undefined {
		return this.date && dateToIso(this.date);
	}

	@Input() team: ISpaceContext = { id: '' };
	@Input() teamDaysProvider?: SpaceDaysProvider;

	@Input() onSlotClicked?: (args: {
		slot: ISlotUIContext;
		event: Event;
	}) => void = (args: { slot: ISlotUIContext; event: Event }) => {
		console.error('onSlotClicked is not set', args);
	};

	constructor(
		private readonly scheduleSateService: CalendarStateService,
		private readonly popoverController: PopoverController,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		scheduleSateService.dateChanged.pipe(takeUntil(this.destroyed)).subscribe({
			next: (value) => {
				console.log('ScheduleDayTabComponent => date changed:', value.date);
				this.date = value.date;
				this.changeDetectorRef.markForCheck();
			},
		});
	}

	onPickerDateChanged(event: Event): void {
		const ce = event as CustomEvent;
		event.stopPropagation();
		event.preventDefault();
		const value: string = ce.detail.value;
		console.log('onPickerDateChanged()', value);
		this.date = isoStringsToDate(value);
		this.changeDetectorRef.markForCheck();
		this.scheduleSateService.setActiveDate(this.date);
		this.popoverController.dismiss().catch(console.error);
	}

	swipe(days: 1 | -1, event: Event): void {
		event.stopPropagation();
		this.scheduleSateService.shiftDays(days);
		this.changeDetectorRef.markForCheck();
	}

	goToday(): void {
		const today = new Date();
		this.scheduleSateService.setActiveDate(today);
		this.popoverController.dismiss().catch(console.error);
	}

	goTomorrow(): void {
		const tomorrow = addDays(new Date(), 1);
		this.scheduleSateService.setActiveDate(tomorrow);
		this.popoverController.dismiss().catch(console.error);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
