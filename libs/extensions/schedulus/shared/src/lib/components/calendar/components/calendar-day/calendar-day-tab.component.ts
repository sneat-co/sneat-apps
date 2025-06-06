import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	input,
	signal,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonDatetime,
	IonIcon,
	IonItem,
	IonLabel,
	IonPopover,
	PopoverController,
} from '@ionic/angular/standalone';
import { dateToIso, isoStringsToDate } from '@sneat/core';
import { WithSpaceInput } from '@sneat/space-services';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { addDays, CalendarStateService } from '../../calendar-state.service';
import { CalendarDayCardComponent } from './calendar-day-card.component';

@Component({
	imports: [
		CalendarDayCardComponent,
		IonItem,
		IonButtons,
		IonButton,
		IonIcon,
		IonLabel,
		IonPopover,
		IonDatetime,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-day-tab',
	templateUrl: 'calendar-day-tab.component.html',
	styleUrls: ['calendar-day-tab.component.scss'],
})
export class CalendarDayTabComponent extends WithSpaceInput {
	private readonly scheduleSateService = inject(CalendarStateService);
	private readonly popoverController = inject(PopoverController);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly $date = signal<Date | undefined>(undefined);

	protected readonly $dateAsIsoString = computed(() => {
		const date = this.$date();
		return date && dateToIso(date);
	});

	public readonly $spaceDaysProvider = input.required<CalendarDataProvider>();

	constructor() {
		super('CalendarDayTabComponent');
		const scheduleSateService = this.scheduleSateService;

		scheduleSateService.dateChanged.pipe(this.takeUntilDestroyed()).subscribe({
			next: (value) => {
				console.log('ScheduleDayTabComponent => date changed:', value.date);
				this.$date.set(value.date);
			},
		});
	}

	protected onPickerDateChanged(event: Event): void {
		const ce = event as CustomEvent;
		event.stopPropagation();
		event.preventDefault();
		const value: string = ce.detail.value;
		console.log('onPickerDateChanged()', value);
		const date = isoStringsToDate(value);
		this.$date.set(date);
		this.scheduleSateService.setActiveDate(date);
		this.popoverController.dismiss().catch(console.error);
	}

	protected swipe(days: 1 | -1, event: Event): void {
		event.stopPropagation();
		this.scheduleSateService.shiftDays(days);
		this.changeDetectorRef.markForCheck();
	}

	protected goToday(): void {
		this.goDate(new Date());
	}

	protected goTomorrow(): void {
		const tomorrow = addDays(new Date(), 1);
		this.goDate(tomorrow);
	}

	private goDate(date: Date): void {
		this.scheduleSateService.setActiveDate(date);
		this.popoverController
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to dismiss popover after going to date',
				),
			);
	}
}
