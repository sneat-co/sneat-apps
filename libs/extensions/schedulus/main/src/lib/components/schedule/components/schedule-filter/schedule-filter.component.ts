import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { IContactusTeamDtoAndID, IContactBrief } from '@sneat/contactus-core';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import {
	emptyScheduleFilter,
	ScheduleFilterService,
} from '../../../schedule-filter.service';
import { WeekdaysFormBase } from '../../../weekdays/weekdays-form-base';
import { IScheduleFilter } from './schedule-filter';

@Component({
	selector: 'sneat-schedule-filter',
	templateUrl: 'schedule-filter.component.html',
})
export class ScheduleFilterComponent extends WeekdaysFormBase {
	@ViewChild(IonAccordionGroup) accordionGroup?: IonAccordionGroup;
	public expanded = false;
	public accordionValue?: string;
	private resetting = false;

	@Input({ required: true }) team?: ITeamContext;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;
	readonly text = new FormControl<string>('');
	weekdays: WeekdayCode2[] = [];
	repeats: string[] = [];

	contactID = '';
	contactIDs: string[] = [];
	selectedContacts: IIdAndBrief<IContactBrief>[] = [];
	members?: IIdAndBrief<IContactBrief>[];

	readonly repeatWeekly = new FormControl<boolean>(false);
	readonly repeatMonthly = new FormControl<boolean>(false);
	readonly repeatQuarterly = new FormControl<boolean>(false);
	readonly repeatYearly = new FormControl<boolean>(false);

	public get hasFilter(): boolean {
		return (
			!!this.text.value?.trim() ||
			!!this.weekdays?.length ||
			!!this.contactIDs?.length ||
			!!this.repeats?.length
		);
	}

	private filter: IScheduleFilter = emptyScheduleFilter;

	constructor(
		private readonly filterService: ScheduleFilterService,
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
	) {
		super('ScheduleFilterComponent', false, errorLogger);
		filterService.filter.subscribe({
			next: this.onFilterChanged,
		});
	}

	private readonly onFilterChanged = (filter: IScheduleFilter): void => {
		if (this.filter === filter) {
			return;
		}
		console.log('ScheduleFilterComponent.onFilterChanged()', filter);
		this.filter = filter;
		this.text.setValue(filter.text || '');
		const { contactIDs } = filter;
		if (contactIDs) {
			this.contactIDs = [...contactIDs];
			if (contactIDs.length === 1) {
				this.contactID = contactIDs[0];
				this.accordionValue = 'filter';
				this.expanded = true;
			}
		}
		if (!contactIDs?.length) {
			this.contactIDs = [];
			this.contactID = '';
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
			this.contactIDs = [];
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
			Object.values(this.weekdayById).forEach((wd) =>
				wd.setValue(false, resetFormControlOptions),
			);
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
				this.repeats.push(value);
			}
		} else if (found) {
			this.repeats = this.repeats.filter((r) => r !== value);
		}
		// console.log('repeatChanged()', checked, value, 'repeats', this.repeats);
		this.emitChanged();
	}

	emitChanged(): void {
		if (this.resetting) {
			return;
		}
		let filter: IScheduleFilter = {
			text: this.text.value || '',
			showRecurrings: true,
			showSingles: true,
		};
		if (this.contactIDs.length) {
			filter = { ...filter, contactIDs: [...this.contactIDs] };
		}
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
