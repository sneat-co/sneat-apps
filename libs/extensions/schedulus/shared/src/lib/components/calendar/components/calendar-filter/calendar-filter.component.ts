import { Component, computed, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	IonAccordion,
	IonAccordionGroup,
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonCheckbox,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { ContactTitlePipe } from '@sneat/components';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { WeekdaysFormBase } from '../../../weekdays/weekdays-form-base';
import { ContactsFilterComponent } from './contacts-filter.component';
import { ICalendarFilter } from './calendar-filter';

@Component({
	selector: 'sneat-calendar-filter',
	templateUrl: 'calendar-filter.component.html',
	imports: [
		ContactTitlePipe,
		ContactsFilterComponent,
		ReactiveFormsModule,
		IonCard,
		IonAccordionGroup,
		IonItem,
		IonIcon,
		IonInput,
		IonButtons,
		IonButton,
		IonItemGroup,
		IonItemDivider,
		IonGrid,
		IonRow,
		IonCol,
		IonCheckbox,
		IonAccordion,
		IonBadge,
		IonLabel,
	],
})
export class CalendarFilterComponent extends WeekdaysFormBase {
	protected readonly $expanded = signal(false);
	public accordionValue?: string;
	private resetting = false;

	@Input({ required: true }) space?: ISpaceContext;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;

	readonly text = new FormControl<string>('');

	// protected readonly $weekdays = computed(() => this.$filter().weekdays);
	protected readonly $repeats = computed(() => this.$filter().repeats);

	contactID = '';
	selectedContacts: IContactWithBriefAndSpace[] = [];
	contacts?: IContactWithBriefAndSpace[];

	protected readonly repeatWeekly = new FormControl<boolean>(false);
	protected readonly repeatMonthly = new FormControl<boolean>(false);
	protected readonly repeatQuarterly = new FormControl<boolean>(false);
	protected readonly repeatYearly = new FormControl<boolean>(false);

	protected readonly $filter = signal<ICalendarFilter>(emptyCalendarFilter);

	protected readonly $hasFilter = computed(() => {
		const filter = this.$filter();
		return (
			!!filter.text.trim() ||
			!!filter.weekdays.length ||
			!!filter.contactIDs.length ||
			!!filter.repeats?.length
		);
	});

	constructor(private readonly filterService: CalendarFilterService) {
		super('ScheduleFilterComponent', false);
		filterService.filter.subscribe({
			next: this.onFilterChanged,
		});
	}

	protected onSelectedContactsChanged(contactIDs: readonly string[]): void {
		console.log(
			'ScheduleFilterComponent.onSelectedContactsChanged()',
			contactIDs,
		);
		this.onFilterChanged({ ...this.$filter(), contactIDs: [...contactIDs] });
	}

	private readonly onFilterChanged = (filter: ICalendarFilter): void => {
		if (this.$filter() === filter) {
			return;
		}
		console.log('ScheduleFilterComponent.onFilterChanged()', filter);
		this.$filter.set(filter);
		this.text.setValue(filter.text || '');
		const { contactIDs } = filter;
		if (contactIDs) {
			if (filter.contactIDs.length === 1) {
				this.contactID = contactIDs[0];
				this.accordionValue = 'filter';
				this.$expanded.set(true);
			}
		}
		// TODO: reset weekday & repeats controls
		this.emitChanged();
	};

	clearFilter(event?: Event): void {
		event?.stopPropagation();
		this.resetting = true;
		try {
			this.$filter.update((f) => ({
				...f,
				contactIDs: [],
				repeats: [],
				weekdays: [],
			}));
			this.contactID = '';

			const resetFormControlOptions = {
				onlySelf: true,
				emitEvent: false,
				emitModelToViewChange: true,
				emitViewToModelChange: false,
			};
			this.text.setValue('', resetFormControlOptions);
			Object.values(this.weekdayById).forEach((wd) => wd.set(false));
			this.repeatWeekly.setValue(false);
			this.repeatMonthly.setValue(false);
			this.repeatQuarterly.setValue(false);
			this.repeatYearly.setValue(false);
		} catch (e) {
			console.error(e);
		}
		this.resetting = false;
		this.emitChanged();
	}

	public accordionChanged(event: Event): void {
		console.log('accordionChanged', event);
		event.stopPropagation();
		this.$expanded.set(!!(event as CustomEvent).detail.value);
	}

	// repeatChecked(id: string): boolean {
	// 	return this.repeats.includes(id);
	// }

	public repeatChanged(event: Event): void {
		const ce = event as CustomEvent;
		const { checked, value } = ce.detail;
		const found = this.$repeats().includes(value);
		if (checked) {
			if (!found) {
				this.$filter.update((f) => ({ ...f, repeats: [...f.repeats, value] }));
			}
		} else if (found) {
			this.$filter.update((f) => ({
				...f,
				repeats: f.repeats.filter((r) => r !== value),
			}));
		}
		// console.log('repeatChanged()', checked, value, 'repeats', this.repeats);
		this.emitChanged();
	}

	protected onTextKeyUp(): void {
		this.emitChanged();
	}

	protected override onWeekdayChanged(
		wd: WeekdayCode2,
		checked: boolean,
	): void {
		super.onWeekdayChanged(wd, checked);
		this.emitChanged();
	}

	protected emitChanged(): void {
		if (this.resetting) {
			return;
		}
		this.$filter.update((filter) => ({
			...filter,
			text: this.text.value || '',
			showRecurrings: true,
			showSingles: true,
			weekdays: this.selectedWeekdayCodes(),
		}));
		this.filterService.next(this.$filter());
	}
}
