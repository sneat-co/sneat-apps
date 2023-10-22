import {
	Component,
	Inject,
	Input,
	OnChanges,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { IContactBrief, IIdAndBrief, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IContactusTeamDtoAndID,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import {
	emptyScheduleFilter,
	ScheduleFilterService,
} from '../schedule-filter.service';
import { WeekdaysFormBase } from '../weekdays/weekdays-form-base';
import { IScheduleFilter } from './schedule-filter';

@Component({
	selector: 'sneat-schedule-filter',
	templateUrl: 'schedule-filter.component.html',
})
export class ScheduleFilterComponent
	extends WeekdaysFormBase
	implements OnChanges
{
	@Input({ required: true }) contactusTeam?: IContactusTeamDtoAndID;
	@Input({ required: true }) team?: ITeamContext;
	@Input() showWeekdays = false;
	@Input() showRepeats = false;

	@ViewChild(IonAccordionGroup) accordionGroup?: IonAccordionGroup;

	readonly text = new FormControl<string>('');
	protected weekdays: WeekdayCode2[] = [];
	protected memberIDs: string[] = [];
	protected selectedMembers: IIdAndBrief<IContactBrief>[] = [];
	protected repeats: string[] = [];
	protected memberID = '';

	protected members = signal<readonly IIdAndBrief<IContactBrief>[] | undefined>(
		undefined,
	);

	protected expanded = false;
	protected accordionValue?: string;
	private resetting = false;

	protected readonly repeatsWeekly = new FormControl<boolean>(false);
	protected readonly repeatsMonthly = new FormControl<boolean>(false);
	protected readonly repeatsQuarterly = new FormControl<boolean>(false);
	protected readonly repeatsYearly = new FormControl<boolean>(false);

	public get hasFilter(): boolean {
		return (
			!!this.text.value?.trim() ||
			!!this.weekdays?.length ||
			!!this.memberIDs?.length ||
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
			this.memberIDs = [...contactIDs];
			if (contactIDs.length === 1) {
				this.memberID = contactIDs[0];
				this.accordionValue = 'filter';
				this.expanded = true;
			}
		}
		if (!contactIDs?.length) {
			this.memberIDs = [];
			this.memberID = '';
		}
		this.setSelectedMembers();
		this.weekdays = filter.weekdays || [];
		this.repeats = filter.repeats || [];
		// TODO: reset weekday & repeats controls
		this.emitChanged();
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ScheduleFilterComponent.ngOnChanges()', changes);
		if (changes['contactusTeam']) {
			const members = zipMapBriefsWithIDs(this.contactusTeam?.dto?.contacts);
			this.members.set(members);
		}
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
			Object.values(this.weekdayById).forEach((wd) =>
				wd.setValue(false, resetFormControlOptions),
			);
			this.repeatsWeekly.setValue(false);
			this.repeatsMonthly.setValue(false);
			this.repeatsQuarterly.setValue(false);
			this.repeatsYearly.setValue(false);
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
		if (this.memberIDs.length) {
			filter = { ...filter, contactIDs: [...this.memberIDs] };
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

	clearMembers(): void {
		this.memberIDs = [];
		this.emitChanged();
	}

	onMemberChanged(event: Event): void {
		console.log('ScheduleFilterComponent.onMemberChanged()', event);
		event.stopPropagation();
		const cs = event as CustomEvent;
		const { checked, value } = cs.detail;
		if (checked === undefined) {
			// a dropdown
			this.memberIDs = this.memberID ? [this.memberID] : [];
		} else if (checked === true) {
			this.memberIDs.push(value);
		} else if (checked === false) {
			this.memberIDs = this.memberIDs.filter((id) => id !== value);
		}
		this.setSelectedMembers();
		this.emitChanged();
	}

	private setSelectedMembers(): void {
		const members = this.members() || [];
		this.selectedMembers = this.memberIDs.map((mID) => {
			const m = members.find((m) => m.id == mID);
			return m as IIdAndBrief<IContactBrief>;
		});
	}
}
