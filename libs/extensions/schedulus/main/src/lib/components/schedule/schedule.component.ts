import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { dateToIso, localDateToIso } from '@sneat/core';
import { IHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import {
	IContactusTeamDtoAndID,
	IHappeningContext,
	IHappeningWithUiState,
	IMemberContext,
	ISchedulusTeamDto,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import { HappeningService, ScheduleDayService } from '@sneat/team/services';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription, takeUntil } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule';
import { SchedulusTeamService } from '../../services';
import { isToday } from '../schedule-core';
import {
	emptyScheduleFilter,
	ScheduleFilterService,
} from '../schedule-filter.service';
import { IScheduleFilter } from '../schedule-filter/schedule-filter';
import { ScheduleFilterComponent } from '../schedule-filter/schedule-filter.component';
import { ScheduleStateService } from '../schedule-state.service';

export type ScheduleTab = 'day' | 'week' | 'recurrings' | 'singles';

@Component({
	selector: 'sneat-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent
	extends SneatBaseComponent
	implements AfterViewInit, OnChanges, OnDestroy
{
	@Input({ required: true }) team: ITeamContext = { id: '' };
	@Input({ required: true }) contactusTeam?: IContactusTeamDtoAndID;

	@Input() member?: IMemberContext;

	@Input() tab: ScheduleTab = 'day';
	@Output() readonly tabChange = new EventEmitter<ScheduleTab>();

	@Input() dateID = '';
	@Output() readonly dateIDChange = new EventEmitter<string>();

	@ViewChild('scheduleFilterComponent')
	private filter = emptyScheduleFilter;
	private date = new Date();
	// prevWeekdays: SlotsGroup[];
	public readonly teamDaysProvider: TeamDaysProvider;
	scheduleFilterComponent?: ScheduleFilterComponent;
	public showRecurrings = true;
	public showEvents = true;
	allRecurrings?: IHappeningWithUiState[];

	// private date: Date;
	recurrings?: IHappeningWithUiState[];

	private schedulusTeamDto?: ISchedulusTeamDto | null;

	private schedulusTeamSubscription?: Subscription;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly params: TeamComponentBaseParams,
		filterService: ScheduleFilterService,
		scheduleStateService: ScheduleStateService,
		happeningService: HappeningService,
		scheduleDayService: ScheduleDayService,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		private readonly schedulusTeamService: SchedulusTeamService,
	) {
		super('ScheduleComponent', errorLogger);
		this.teamDaysProvider = new TeamDaysProvider(
			this.errorLogger,
			happeningService,
			scheduleDayService,
			afs,
			sneatApiService,
		);

		filterService.filter.pipe(takeUntil(this.destroyed)).subscribe({
			next: (filter) => {
				this.filter = filter;
				this.recurrings = this.filterRecurrings(filter);
			},
			error: this.errorLogger.logErrorHandler('failed to get schedule filter'),
		});

		scheduleStateService.dateChanged.subscribe({
			next: (changed) => {
				const { date } = changed;
				this.date = date;
				this.dateID = dateToIso(date);
			},
		});

		// setTimeout(() => {
		// 	// TODO: Fix this dirty workaround for initial animations
		// 	this.setToday();
		// }, 10);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.onTeamContextChanged();
			const teamChange = changes['team'];
			const currentTeam = teamChange.currentValue as ITeamContext;
			const prevTeam = teamChange.previousValue as ITeamContext;
			if (currentTeam?.id !== prevTeam?.id) {
				this.onTeamIdChanged();
			}
		}
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.teamDaysProvider.destroy();
	}

	ngAfterViewInit(): void {
		this.tabChange.emit(this.tab);
	}

	segmentChanged(event: Event): void {
		console.log('ScheduleComponent.segmentChanged()', event);
		history.replaceState(
			history.state,
			document.title,
			location.href.replace(/tab=\w+/, `tab=${this.tab}`),
		);
		switch (this.tab) {
			case 'week':
				// if (this.activeDay.date) {
				// 	this.setDay('segmentChanged', this.activeDay.date);
				// } else {
				// 	throw new Error('activeDay has no date');
				// }
				break;
			case 'singles':
				// this.slotsProvider.loadTodayAndFutureEvents(undefined)
				// 	.subscribe({
				// 		error: this.errorLogger.logError,
				// 		next: events => {
				// 			const slotGroupsByDate: { [dateKey: string]: SlotsGroup } = {};
				// 			events.forEach(event => {
				// 				const eventStartDate = new Date(event.dtStarts);
				// 				const dateKey = localDateToIso(eventStartDate);
				// 				let slotGroup = slotGroupsByDate[dateKey];
				// 				if (!slotGroup) {
				// 					const wd = 'we'; // TODO: why Wednesday?
				// 					slotGroupsByDate[dateKey] = slotGroup = {
				// 						wd,
				// 						date: eventStartDate,
				// 						title: wdCodeToWeekdayName(wd),
				// 						slots: [],
				// 					};
				// 				}
				// 				slotGroup.slots.push(eventToSlot(event));
				// 			});
				// 			this.todayAndFutureEvents = Object.values(slotGroupsByDate);
				// 		},
				// 	});
				break;
			default:
				break;
		}
	}

	onShowEventsChanged(): void {
		if (!this.showEvents) {
			this.showRecurrings = true;
		}
	}

	onShowRecurringsChanged(): void {
		if (!this.showRecurrings) {
			this.showEvents = true;
		}
	}

	// readonly goNewHappening = (params: NewHappeningParams): void => {
	// 	const { type, wd, date } = params;
	//
	// 	const state: { type?: HappeningType; date?: string; wd?: WeekdayCode2 } = { type };
	//
	// 	if (date) {
	// 		// tslint:disable-next-line:no-non-null-assertion
	// 		state.date = date;
	// 	} else if (wd) {
	// 		state.wd = wd;
	// 	} else if (this.tab === 'day') {
	// 		state.date = dateToIso(this.date);
	// 	}
	// 	if (!this.team) {
	// 		this.errorLogger.logError('!this.team');
	// 		return;
	// 	}
	// 	this.params.teamNavService
	// 		.navigateForwardToTeamPage(this.team, 'new-happening', {
	// 			queryParams: params,
	// 		})
	// 		.catch(this.errorLogger.logErrorHandler('failed to navigate to new happening page'));
	// };

	readonly onSlotClicked = (args: { slot: ISlotItem; event: Event }): void => {
		console.log('ScheduleComponent.onSlotClicked()', args);
		if (!this.team) {
			throw new Error('!team');
		}
		const happening: IHappeningContext = args.slot.happening;
		const page = `happening/${happening.id}`;
		this.params.teamNavService
			.navigateForwardToTeamPage(this.team, page, {
				state: { happening },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to recurring happening page',
				),
			);
	};

	public readonly onDateSelected = (date: Date): void => {
		this.tab = 'day';
		this.setDay('onDateSelected', date);
	};

	protected readonly id = (_: number, o: { id: string }) => o.id;

	readonly index = (i: number): number => i;

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// noinspection JSMethodCanBeStatic

	public isToday(): boolean {
		return isToday(this.date);
	}

	protected onTeamIdChanged(): void {
		console.log('ScheduleComponent.onTeamIdChanged()', this.team?.id);
		this.schedulusTeamSubscription?.unsubscribe();
		if (this.team?.id) {
			this.schedulusTeamSubscription = this.schedulusTeamService
				.watchTeamModuleRecord(this.team)
				.subscribe({
					next: (schedulusTeam) => {
						console.log(
							'ScheduleComponent.onTeamIdChanged() => schedulusTeam:',
							schedulusTeam,
						);
						this.schedulusTeamDto = schedulusTeam?.dto;
						this.teamDaysProvider.setSchedulusTeam(schedulusTeam);
						this.populateRecurrings();
					},
				});
			// this.slotsProvider.setCommuneId(this.team.id)
			// 	.subscribe(
			// 		(regulars) => {
			// 			console.log('Loaded regulars:', regulars);
			// 			this.allRegulars = regulars;
			// 			this.regulars = this.filterRegulars();
			// 		},
			// 		this.errorLogger.logError,
			// 		() => {
			// 			// this.activeWeek.weekdays = [...this.activeWeek.weekdays];
			// 			this.setDay('onCommuneIdChanged', this.activeDay.date || new Date());
			// 		},
			// 	);
		}
	}

	private onTeamContextChanged(): void {
		if (this.team) {
			this.teamDaysProvider.setTeam(this.team);
			this.populateRecurrings();
		}
		this.setDay('onTeamDtoChanged', this.date);
	}

	// noinspection JSMethodCanBqw2se3333eStatic

	private populateRecurrings(): void {
		console.log('populateRecurrings()');
		const prevAll = this.allRecurrings;
		this.allRecurrings =
			zipMapBriefsWithIDs(
				this.schedulusTeamDto?.recurringHappenings || {},
			)?.map((rh) => {
				const { id } = rh;
				const prev = prevAll?.find((p) => p.id === id);
				const result: IHappeningWithUiState = {
					id,
					brief: rh.brief,
					state: prev?.state || {},
					team: this.team || { id: '' },
				};
				return result;
			}) || [];
		this.recurrings = this.filterRecurrings(this.filter || emptyScheduleFilter);
	}

	// We filter recurring at schedule level, so we can share it across different components?
	private filterRecurrings(
		filter: IScheduleFilter,
	): IHappeningWithUiState[] | undefined {
		const text = filter.text.toLowerCase();
		const { contactIDs, repeats, weekdays } = filter;

		const filtered = this.allRecurrings?.filter((r) => {
			const title = r.brief?.title || r.dto?.title;
			if (title && title.trim().toLowerCase().indexOf(text) < 0) {
				return false;
			}
			if (!r.brief || !this.hasContact(r.brief, contactIDs)) {
				return false;
			}
			if (!this.hasWeekday(r.brief?.slots || r.dto?.slots, weekdays)) {
				return false;
			}
			if (
				repeats?.length &&
				!r.brief?.slots?.some((slot) => repeats.includes(slot.repeats))
			) {
				return false;
			}

			return true;
		});
		console.log(
			`ScheduleComponent.filterRecurrings(')`,
			filter,
			this.allRecurrings,
			' => ',
			filtered,
		);

		return filtered;
	}

	// TODO: Decouple and reuse
	private hasContact(
		item: { contactIDs?: string[] } | undefined,
		contactIDs?: string[],
	): boolean {
		return (
			!contactIDs?.length ||
			!!item?.contactIDs?.some((id) => contactIDs.includes(id))
		);
	}

	// noinspection JSMethodCanBeStatic

	private hasWeekday(
		slots: IHappeningSlot[] | undefined,
		weekdays?: WeekdayCode2[],
	): boolean {
		return (
			!weekdays ||
			!!slots?.some(
				(slot) => slot.weekdays?.some((wd) => weekdays.includes(wd)),
			)
		);
	}

	private setDay(source: string, d: Date): void {
		console.log(`ScheduleComponent.setDay(source=${source}), d=`, d);
		if (!d) {
			return;
		}

		// this.setSlidesAnimationState();
		//
		// this.activeDay.changeDate(d);
		//
		// this.activeWeek.activeDate = d;
		// const { tab } = this;
		// const activeWd = jsDayToWeekday(d.getDay() as wdNumber);
		// const datesToPreload: Date[] = [];
		// const datesToLoad: Day[] = [];
		// activeWeek.weekdays.forEach((weekday) => {
		// 	const weekdayDate = getWdDate(weekday.wd, activeWd, d);
		// 	if (!weekday.date || weekday.date.getTime() !== weekdayDate.getTime() || !weekday.slots) {
		// 		// console.log('weekday.date !== weekdayDate', weekday.date, weekdayDate);
		// 		weekday = { ...weekday, date: weekdayDate };
		// 		if (tab === 'week' || tab === 'day' && weekday.wd === activeWd) {
		// 			datesToLoad.push(weekday);
		// 			// tslint:disable-next-line:no-magic-numbers
		// 			const diff = tab === 'day' ? SHIFT_1_DAY : SHIFT_1_WEEK;
		// 			const wdDate = weekday.date;
		// 			if (wdDate) {
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() + diff));
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() - diff));
		// 			}
		// 			if (tab === 'day') {
		// 				const activeWeekDaysToPreload = activeWeek.weekdays
		// 					.filter(wd =>
		// 						!wd.date ||
		// 						// tslint:disable-next-line:no-non-null-assertion
		// 						!datesToPreload.some(dtp => dtp.getTime() === wd.date?.getTime()));
		// 				activeWeekDaysToPreload.forEach(wd => {
		// 					if (!wd.date) {
		// 						// wd.date = weekdayDate;
		// 						// this.errorLogger.logError('not implemented yet: !wd.date');
		// 						console.error('not implemented yet: !wd.date');
		// 					} else {
		// 						datesToPreload.push(wd.date);
		// 					}
		// 				});
		// 			}
		// 		}
		// 	}
		// 	if (weekday.wd === activeWd) {
		// 		this.activeDay.weekday = weekday;
		// 	}
		// });
		//
		// console.log(`segment=${tab}, datesToPreload:`, datesToPreload);
		// if (this.team) {
		// 	this.slotsProvider.getDays(...datesToLoad)
		// 		.pipe(
		// 			takeUntil(this.destroyed),
		// 		)
		// 		.subscribe({
		// 			error: this.errorLogger.logErrorHandler('failed to get days'),
		// 		});
		// }
		// this.slotsProvider.preloadEvents(tx, ...datesToPreload),

		// Change URL
		if (this.isToday()) {
			history.replaceState(
				history.state,
				document.title,
				location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, ''),
			);
		} else {
			const isoDate = `&date=${localDateToIso(d)}`;
			if (location.href.indexOf('&date') < 0) {
				history.replaceState(
					history.state,
					document.title,
					location.href + isoDate,
				);
			} else {
				history.replaceState(
					history.state,
					document.title,
					location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, isoDate),
				);
			}
		}
	}
}
