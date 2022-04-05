import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { IMemberInfo, IRecord, IScrum, IStatus, ITimerState, TaskType } from '../../models/interfaces';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Subscription } from 'rxjs';
import { ScrumService } from '../../services/scrum.service';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat-team/ui-core';
import { NavService, ScrumPageTab } from '../../services/nav.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Location } from '@angular/common';
import { IMetric } from '../interfaces';
import { secondsToStr } from '../../pipes/date-time-pipes';
import { Timer, TimerFactory } from '../../services/timer.service';
import { TeamContextService } from '../../services/team-context.service';
import { TeamBaseComponent } from '@sneat/team/components';
import { MemberRoleEnum } from '../../models/dto-models';
import { first, mergeMap } from 'rxjs/operators';
import { getMeetingIdFromDate, getToday } from '../../services/meeting.service';

@Component({
	selector: 'sneat-scrum-page',
	templateUrl: './scrum.page.html',
	styleUrls: ['./scrum.page.scss'],
})
export class ScrumPage extends TeamBaseComponent
	extends TeamBaseComponent
	implements OnInit, OnDestroy {
	public tab: ScrumPageTab = 'my';

	public totalElapsed: string;

	public scrumID: string;
	public scrum: IScrum = {
		userIDs: [],
		statuses: [],
	};

	public timerState?: ITimerState;

	public spectators: IMemberInfo[];

	public isToday: boolean;
	public scrumDate: Date;

	public prevScrumID: string;
	public prevScrumDate: Date;

	public nextScrumID: string;
	public nextScrumDate: Date;

	public get prevScrumTitle(): string {
		return this.prevScrumDate
			? `Previous scrum: ${this.prevScrumDate.toDateString()}`
			: 'Previous scrum';
	}

	public get nextScrumTitle(): string {
		return this.nextScrumDate
			? `Next scrum: ${this.nextScrumDate.toDateString()}`
			: 'Next scrum';
	}

	public allStatuses: IStatus[];
	public displayStatuses: IStatus[];
	public memberStatus: IStatus;
	public userMemberId?: string;

	public readonly taskTypes: TaskType[] = ['done', 'todo', 'risk', 'qna'];

	public teamMetrics: IMetric[];
	public personalMetrics: IMetric[];

	public timer: Timer;

	public get defaultBackUrl(): string {
		return this.team?.id ? `team?id=${this.team.id}` : 'teams';
	}

	public expandedMemberId?: string | null;

	private scrumsById: { [id: string]: IScrum } = {};
	private subscriptions: Subscription[] = []; // TODO: replace with subs from BAsePage?

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly teamService: TeamService,
		readonly navController: NavController,
		readonly teamContextService: TeamContextService,
		readonly route: ActivatedRoute,
		readonly userService: UserService,
		private readonly scrumService: ScrumService,
		private readonly analyticsService: AnalyticsService,
		public readonly navService: NavService,
		private readonly location: Location,
		private readonly timerFactory: TimerFactory,
	) {
		super(
			changeDetectorRef,
			route,
			errorLogger,
			navController,
			teamService,
			teamContextService,
			userService,
		);
	}

	private static getDateFromId(scrumId: string): Date {
		const year = scrumId.substr(0, 4);
		const month = scrumId.substr(5, 2);
		const day = scrumId.substr(8, 2);
		return new Date(+year, +month - 1, +day);
	}

	public ngOnInit() {
		try {
			const tab = window?.location?.hash?.match(/[#&]tab=(\w+)/);
			// @ts-ignore
			this.tab = tab?.[1] || this.tab;

			const scrum = history.state.scrum as IRecord<IScrum>;
			if (scrum) {
				this.setScrumId(scrum.id);
				this.scrumLoaded(scrum.id, scrum.data, 'history.state.scrum');
			} else {
				this.setCurrentScrumIdFromUrl(this.route.snapshot.queryParamMap);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'ScrumPage.constructor()');
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
		if (this.timer) {
			this.timer.releaseTimer();
		}
	}

	public trackByMember(index: number, item: IStatus) {
		return item.member.id;
	}

	public showChanged() {
		console.log(
			'showChanged(), tab:',
			this.tab,
			'location.hash:',
			location.hash,
		);
		// if (this.tab) {
		// 	location.hash = '#tab=' + this.tab;
		// }
		this.setStatuses();
	}

	public goScrumsList(): void {
		this.navService.navigateToScrums(this.navController, this.team);
	}

	public changeDate(to: 'prev' | 'next' | 'today' | string): void {
		console.log(`changeDate(to=${to}, currentScrumDate=${this.scrumDate})`);
		this.analyticsService.logEvent('ScrumPage.changeDate', { to });
		if (to === 'today') {
			this.isToday = true;
			this.scrumDate = getToday();
			this.scrumID = getMeetingIdFromDate(this.scrumDate);
			this.subscribeScrum(this.team.id, this.scrumID, 'changeDate');
		}
		switch (to) {
			case 'today': {
				this.setScrumId(getMeetingIdFromDate(getToday()));
				break;
			}
			case 'prev': {
				const prevScrumId =
					this.scrum?.scrumIds?.prev ||
					(this.isToday && this.team?.data?.last?.scrum?.id);
				if (!prevScrumId) {
					this.errorLogger.logError(
						`Attempted to go PREV non-existing scrum (teamId=${this.team?.id}, scrumId=${this.scrumID})`,
					);
					return;
				}
				this.setScrumId(prevScrumId);
				break;
			}
			case 'next': {
				if (!this.scrum?.scrumIds?.next) {
					this.errorLogger.logError(
						`Attempted to go NEXT non-existing scrum (teamId=${this.team?.id}, scrumId=${this.scrumID})`,
					);
					return;
				}
				this.prevScrumDate = this.scrumDate;
				this.setScrumId(this.scrum.scrumIds.next);
				break;
			}
		}
		if (this.team?.data) {
			this.merge(this.scrum, undefined, this.team.data.members);
		}

		const path = this.location.path().split('?')[0];

		console.log(
			'location.replaceState',
			window.location.search,
			`date=${this.isToday ? 'today' : this.scrumID}&`,
		);
		this.location.replaceState(
			path, // TODO(StackOverflow): do proper navigation
			window.location.search.replace(
				/date=.+?(&|$)/,
				`date=${this.isToday ? 'today' : this.scrumID}&`,
			),
		);
		console.log('changeDate =>', to, this.scrumDate);
	}

	public onScrumExpandChanged(memberId: string, isExpanded: boolean) {
		if (isExpanded) {
			this.expandedMemberId = memberId;
			this.displayStatuses = [...this.displayStatuses];
		} else {
			this.expandedMemberId = null;
		}
	}

	public toggleScrumTimer(): void {
		try {
			this.timer.toggleTimer().subscribe({
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to toggle scrum timer'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to call timer.toggleTimer()');
		}
	}

	protected onTeamIdChanged(): void {
		super.onTeamIdChanged();
		if (!this.team?.id) {
			return;
		}
		if (this.scrumDate) {
			this.subscribeScrum(
				this.team.id,
				this.scrumID,
				`subscribeTeam(this.scrumId=${this.scrumID})`,
			);
		}
	}

	protected onTeamDtoChanged(): void {
		const team = this.team?.data;
		if (!team) {
			return;
		}
		if (this.scrumID && !this.timer) {
			this.setTimer(this.team.id, this.scrumID);
		}
		const lastScrumId = team.last?.scrum?.id;
		if (this.isToday && lastScrumId && lastScrumId !== this.scrumID) {
			this.prevScrumID = lastScrumId;
			this.prevScrumDate = ScrumPage.getDateFromId(this.prevScrumID);
		}
		if (team.members) {
			this.spectators = team.members.filter((m) =>
				m.roles?.indexOf(MemberRoleEnum.spectator),
			);
			const uid = this.currentUserId;
			const member = Object.values(team.members).find((m) => m.uid === uid);
			if (member) {
				this.userMemberId = member.id;
				this.setStatuses();
			}
		} else {
			this.spectators = [];
		}
		if (team.metrics) {
			this.teamMetrics = team.metrics
				.filter((m) => m.mode === 'team')
				.map((m) => {
					const m3 = this.teamMetrics?.find((m2) => m2.id === m.id);
					return { ...m, value: m3?.value } as IMetric;
				});
			this.personalMetrics = team.metrics
				.filter((m) => m.mode === 'personal')
				.map((m) => {
					const m3 = this.personalMetrics?.find((m2) => m2.id === m.id);
					return { ...m, value: m3?.value } as IMetric;
				});
		}
		this.merge(this.scrum, undefined, team.members);
	}

	protected unsubscribe(reason?: string): void {
		super.unsubscribe(reason);
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
		this.scrumsById = {};
	}

	private setCurrentScrumIdFromUrl(params: ParamMap) {
		let id = params.get('date') || 'today';
		console.log('setCurrentScrumIdFromUrl()', id);
		if (id === 'today') {
			this.isToday = true;
			const today = getToday();
			id = getMeetingIdFromDate(today);
			console.log(`date: ${id}, today:`, today);
		}
		this.setScrumId(id);
	}

	// private setScrum(scrum: IScrum): void {
	// 	this.scrum = scrum;
	// 	if (this.scrum?.timer?.status === 'active') {
	// 		const now = new Date();
	// 	}
	// }

	private scrumLoaded(id: string, scrum: IScrum, from: string): void {
		console.log(
			`${from}: scrumLoaded(${id}: currentScrumId=${this.scrumID}`,
			scrum,
		);
		this.scrumsById[id] = scrum;
		switch (id) {
			case this.scrumID:
				this.timer.updateTimerState(scrum?.timer);
				this.scrum = scrum || {
					...this.scrum,
					statuses: [],
					risksCount: undefined,
					questionsCount: undefined,
					timer: scrum?.timer,
				};
				// if (scrum?.timer?.status === 'active') {
				// 	this.startTimer();
				// } else {
				// 	this.setTotalElapsed();
				// }
				console.log('this.scrum', this.scrum);
				if (this.team?.data) {
					this.merge(this.scrum, undefined, this.team.data.members);
				}
				this.prevScrumID = scrum?.scrumIds?.prev;
				if (this.prevScrumID) {
					this.prevScrumDate = ScrumPage.getDateFromId(this.prevScrumID);
				}
				this.nextScrumID = scrum?.scrumIds?.next;
				if (this.nextScrumID) {
					this.nextScrumDate = ScrumPage.getDateFromId(this.nextScrumID);
				}
				console.log(`mapped to current scrum ${id}:`, this.scrum);
				break;
			case this.prevScrumID:
				// this.prevScrum = scrum || {...this.prevScrum, statuses: []};
				if (this.team?.data) {
					this.merge(this.scrum, undefined, this.team.data.members);
				}
				console.log(`mapped to previous scrum ${id}:`, this.scrum);
				break;
			default:
				console.log(
					// eslint-disable-next-line max-len
					`loaded scrum(${id}) not related to current(${this.scrumID}) or previous(${this.prevScrumID}) or next(${this.nextScrumID}):`,
					scrum,
				);
		}
	}

	private subscribeScrum(teamId: string, scrumId: string, from: string) {
		console.log(`${from}: subscribeScrum(team=${teamId}, scrumId=${scrumId})`);
		if (this.scrumsById.hasOwnProperty(scrumId)) {
			return;
		}
		this.subscriptions.push(
			this.userService.userChanged
				.pipe(
					first(),
					mergeMap(() => this.scrumService.watchScrum(teamId, scrumId)),
				)
				.subscribe({
					next: (scrum) =>
						this.scrumLoaded(scrumId, scrum, from + ': subscribeScrum'),
					error: (err) => {
						this.errorLogger.logError(
							err,
							`failed to load scrum by id=${scrumId}`,
						);
						this.navService.navigateToTeam(
							this.team.id,
							undefined,
							this.team.data,
							'back',
						);
					},
				}),
		);
	}

	private merge(
		scrum: IScrum,
		prevScrum: IScrum,
		members: IMemberInfo[],
	): void {
		console.log(
			'ScrumPage.merge(),\n\tscrum:',
			scrum,
			'\n\tprevScrum:',
			prevScrum,
			'\n\tmembers:',
			members,
		);
		this.allStatuses = members
			.filter((m) => m.roles?.indexOf(MemberRoleEnum.contributor) >= 0)
			.map((member) => ({
				member,
				byType: {},
			}));
		if (scrum?.statuses) {
			Object.values(scrum.statuses).forEach((item) => {
				console.log('item1:', item);
				const { id } = item.member;
				item = {
					...item,
					byType: {
						done: item.byType.done || [],
						risk: item.byType.risk || [],
						plan: item.byType.plan || [],
						todo: item.byType.todo || [],
						qna: item.byType.qna || [],
					},
				};
				const index = this.allStatuses.findIndex(
					(v) => id && id === v.member.id,
				);
				console.log('item:', item);
				if (index < 0) {
					this.allStatuses.push(item);
				} else {
					this.allStatuses[index] = item;
				}
			});
		} else {
			this.allStatuses.forEach((status) => {
				status.byType.todo = [];
				status.byType.done = [];
				status.byType.risk = [];
			});
		}

		if (prevScrum?.statuses) {
			Object.values(prevScrum.statuses).forEach((item) => {
				const { id } = item.member;
				const index = this.allStatuses.findIndex(
					(v) => id && id === v.member.id,
				);
				if (index < 0) {
					this.allStatuses.push({
						member: item.member,
						byType: {
							plan: item.byType.todo,
							risk: [],
							todo: [],
							done: [],
							qna: [],
						},
					});
				} else {
					this.allStatuses[index].byType.plan = item.byType.todo;
				}
			});
		} else {
			this.allStatuses.forEach((status) => {
				status.byType.plan = [];
			});
		}

		this.setStatuses();
	}

	private setStatuses() {
		if (this.allStatuses) {
			this.displayStatuses = this.allStatuses;
			this.setHasRisks();
			if (this.userMemberId) {
				this.memberStatus = this.allStatuses.find(
					(s) => s.member.id === this.userMemberId,
				);
			}
		}
	}

	private setHasRisks(): void {
		// this.hasRisks = !!this.displayStatuses.find(s => s.byType?.risk?.length);
	}

	// taskAdded(newTask: { member: IMemberInfo, task: ITask, type: TaskType }): void {
	// 	const {member, task, type} = newTask;
	// 	const status = this.allStatuses.find(item => member.id && item.member.id === member.id);
	// 	status[type].push(task);
	// 	this.setStatuses();
	// }

	private setTimer(teamId: string, scrumId: string): void {
		console.log('ScrumPage.setTimer()');
		this.timer = this.timerFactory.getTimer(this.scrumService, teamId, scrumId);
		this.timer.onTick.subscribe(this.onTimerTicked);
	}

	private onTimerTicked = (timerState: ITimerState): void => {
		try {
			console.log(
				'ScrumPage.onTimerTicked() => elapsedSeconds:',
				timerState?.elapsedSeconds,
				timerState,
			);
			this.timerState = timerState;
			this.totalElapsed = timerState && secondsToStr(timerState.elapsedSeconds);
		} catch (e) {
			this.errorLogger.logError(
				e,
				'ScrumPage failed to process timer ticked event',
			);
		}
	};

	private setScrumId(id: string): void {
		console.log(`setCurrentScrum(${id})`);
		if (id === this.scrumID) {
			return;
		}
		try {
			this.prevScrumID = undefined;
			this.prevScrumDate = undefined;
			this.nextScrumID = undefined;
			this.nextScrumDate = undefined;
			const todayId = getMeetingIdFromDate(getToday());
			if (id === 'today') {
				id = todayId;
			}
			this.scrumID = id;
			if (this.team) {
				this.setTimer(this.team.id, id);
			}
			this.scrumDate = ScrumPage.getDateFromId(id);
			console.log(`setCurrentScrum() id=${id}, scrumDate:`, this.scrumDate);
			const scrum = this.scrumsById[id];
			console.log('setCurrentScrum() => scrum:', id, scrum, this.scrumsById);
			this.scrum = scrum;
			this.isToday = id === todayId;
			console.log(`isToday=${this.isToday}, id=${id}, todayId=${todayId}`);
			{
				/*if (scrum) - we need to set prevScrumId even if no scrum record */
				this.prevScrumID =
					scrum?.scrumIds?.prev ||
					(this.isToday && this.team?.data?.last?.scrum?.id);
				if (this.prevScrumID) {
					this.prevScrumDate = ScrumPage.getDateFromId(this.prevScrumID);
				}
				this.nextScrumID = scrum?.scrumIds?.next;
				if (this.nextScrumID) {
					this.nextScrumDate = ScrumPage.getDateFromId(this.nextScrumID);
				}
			}
			if (this.team) {
				this.subscribeScrum(this.team.id, this.scrumID, 'setCurrentScrum');
			}
		} catch (e) {
			this.errorLogger.logError(e, `Failed in setCurrentScrum(${id})`);
		}
	}
}
