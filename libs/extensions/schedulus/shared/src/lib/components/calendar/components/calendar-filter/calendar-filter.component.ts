import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonAccordionGroup, IonicModule } from '@ionic/angular';
import { ContactTitlePipe } from '@sneat/components';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief, IContactWithSpace } from '@sneat/contactus-core';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { WeekdaysFormBase } from '../../../weekdays/weekdays-form-base';
import { ContactsFilterComponent } from '../contacts-filter/contacts-filter.component';
import { ICalendarFilter } from './calendar-filter';

@Component({
	selector: 'sneat-calendar-filter',
	templateUrl: 'calendar-filter.component.html',
	imports: [
		IonicModule,
		ContactTitlePipe,
		ContactsFilterComponent,
		ReactiveFormsModule,
	],
})
export class CalendarFilterComponent extends WeekdaysFormBase {
	@ViewChild(IonAccordionGroup) accordionGroup?: IonAccordionGroup;
	public expanded = false;
	public accordionValue?: string;
	private resetting = false;

	@Input({ required: true }) space?: ISpaceContext;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;
	readonly text = new FormControl<string>('');
	weekdays: readonly WeekdayCode2[] = [];
	repeats: readonly string[] = [];

	contactID = '';
	selectedContacts: IContactWithSpace[] = [];
	contacts?: IContactWithSpace[];

	readonly repeatWeekly = new FormControl<boolean>(false);
	readonly repeatMonthly = new FormControl<boolean>(false);
	readonly repeatQuarterly = new FormControl<boolean>(false);
	readonly repeatYearly = new FormControl<boolean>(false);

	public get hasFilter(): boolean {
		return (
			!!this.text.value?.trim() ||
			!!this.weekdays?.length ||
			!!this.filter.contactIDs.length ||
			!!this.repeats?.length
		);
	}

	protected filter: ICalendarFilter = emptyCalendarFilter;

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
		this.onFilterChanged({ ...this.filter, contactIDs: [...contactIDs] });
	}

	private readonly onFilterChanged = (filter: ICalendarFilter): void => {
		if (this.filter === filter) {
			return;
		}
		console.log('ScheduleFilterComponent.onFilterChanged()', filter);
		this.filter = filter;
		this.text.setValue(filter.text || '');
		const { contactIDs } = filter;
		if (contactIDs) {
			if (this.filter.contactIDs.length === 1) {
				this.contactID = contactIDs[0];
				this.accordionValue = 'filter';
				this.expanded = true;
			}
		}
		this.weekdays = filter.weekdays || [];
		this.repeats = filter.repeats || [];
		// TODO: reset weekday & repeats controls
		this.emitChanged();
	};

	clearFilter(event?: Event): void {
		event?.stopPropagation();
		this.resetting = true;
		try {
			this.filter = {
				...this.filter,
				contactIDs: [],
			};
			this.repeats = [];
			this.weekdays = [];
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
		this.expanded = !!(event as CustomEvent).detail.value;
	}

	// repeatChecked(id: string): boolean {
	// 	return this.repeats.includes(id);
	// }

	public repeatChanged(event: Event): void {
		const ce = event as CustomEvent;
		const { checked, value } = ce.detail;
		const found = this.repeats.includes(value);
		if (checked) {
			if (!found) {
				this.repeats = [...this.repeats, value];
			}
		} else if (found) {
			this.repeats = this.repeats.filter((r) => r !== value);
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
		let filter: ICalendarFilter = {
			...this.filter,
			text: this.text.value || '',
			showRecurrings: true,
			showSingles: true,
		};
		this.weekdays = this.selectedWeekdayCodes();
		if (this.weekdays.length) {
			filter = { ...filter, weekdays: this.weekdays };
		}
		if (this.repeats.length) {
			filter = { ...filter, repeats: [...this.repeats] };
		}
		this.filter = filter;
		this.filterService.next(filter);
	}
}
