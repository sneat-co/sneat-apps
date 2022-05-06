import { AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { IMemberBrief, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { emptyScheduleFilter, ScheduleFilterService } from '../schedule-filter.service';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';
import { IScheduleFilter } from './schedule-filter';

@Component({
	selector: 'sneat-schedule-filter',
	templateUrl: 'schedule-filter.component.html',
})
export class ScheduleFilterComponent extends WeekdaysFormBase implements OnChanges {
	@ViewChild(IonAccordionGroup) accordionGroup?: IonAccordionGroup;
	public expanded = false;
	public accordionValue?: string;
	private resetting = false;
	@Input() team?: ITeamContext;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;
	readonly text = new FormControl('');
	weekdays: WeekdayCode2[] = [];
	memberIDs: string[] = [];
	repeats: string[] = [];
	memberID = '';

	members?: IMemberContext[];

	readonly repeatWeekly = new FormControl(false);
	readonly repeatMonthly = new FormControl(false);
	readonly repeatQuarterly = new FormControl(false);
	readonly repeatYearly = new FormControl(false);

	public get hasFilter(): boolean {
		return !!this.text.value.trim() ||
			!!this.weekdays?.length ||
			!!this.memberIDs?.length ||
			!!this.repeats?.length;
	}

	private filter: IScheduleFilter = emptyScheduleFilter;

	constructor(
		private readonly filterService: ScheduleFilterService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		super(false);
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
		const { memberIDs } = filter;
		if (memberIDs) {
			this.memberIDs = [...memberIDs];
			if (memberIDs.length === 1) {
				this.memberID = memberIDs[0];
				this.accordionValue = 'filter';
				this.expanded = true;
			}
		}
		if (!memberIDs?.length) {
			this.memberIDs = [];
			this.memberID = '';
		}
		this.weekdays = filter.weekdays || [];
		this.repeats = filter.repeats || [];
		// TODO: reset weekday & repeats controls
	};

	ngOnChanges(changes: SimpleChanges): void {
		this.members = this.team?.dto?.members?.map(m => ({id: m.id, brief: m}));
	}

	clearFilter(event?: Event): void {
		event?.stopPropagation();
		this.resetting = true;
		try {
			this.memberIDs = [];
			this.repeats = [];
			this.weekdays = [];
			this.memberID = '';

			const resetFormControlOptions = {
				onlySelf: true,
				emitEvent: false,
				emitModelToViewChange: true,
				emitViewToModelChange: false,
			};
			this.text.setValue('', resetFormControlOptions);
			Object.values(this.weekdayById)
				.forEach(wd => wd.setValue(false, resetFormControlOptions));
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
	// 	return this.repeats.indexOf(id) >= 0;
	// }

	public repeatChanged(event: Event): void {
		const ce = event as CustomEvent;
		const { checked, value } = ce.detail;
		const found = this.repeats.indexOf(value) >= 0;
		if (checked) {
			if (!found) {
				this.repeats.push(value);
			}
		} else if (found) {
			this.repeats = this.repeats.filter(r => r !== value);
		}
		// console.log('repeatChanged()', checked, value, 'repeats', this.repeats);
		this.emitChanged();
	}

	emitChanged(): void {
		if (this.resetting) {
			return;
		}
		let filter: IScheduleFilter = { text: this.text.value, showRecurrings: true, showSingles: true };
		if (this.memberIDs.length) {
			filter = { ...filter, memberIDs: [...this.memberIDs] };
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

	onMemberChanged(event: Event): void {
		console.log('ScheduleFilterComponent.onMemberChanged()', event);
		event.stopPropagation();
		this.memberIDs = this.memberID ? [this.memberID] : [];
		this.emitChanged();
	}
}
