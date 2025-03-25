import { Location } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	Inject,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ISpaceMemberInfo } from '@sneat/contactus-core';
import { AnalyticsService, IAnalyticsService } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { secondsToStr } from '@sneat/datetime';
// import { ITeamMemberInfo, MemberRoleSpectator } from '@sneat/dto';
import {
	getMeetingIdFromDate,
	getToday,
	ITimerState,
	Timer,
	TimerFactory,
} from '@sneat/meeting';
import { ScrumService } from '../services/scrum.service';
import { IScrumDbo, IStatus, TaskType } from '@sneat/scrumspace-scrummodels';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/space-components';
import { ScrumPageTab } from '@sneat/space-services';
import { Subscription } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { IMetric } from '../interfaces';

@Component({
	selector: 'sneat-scrum-page',
	templateUrl: './scrum-page.component.html',
	styleUrls: ['./scrum-page.component.scss'],
	providers: [SpaceComponentBaseParams],
	standalone: false,
})
export class ScrumPageComponent
	extends SpaceBaseComponent
	implements OnInit, OnDestroy
{
	public tab: ScrumPageTab = 'my';

	public totalElapsed?: string;

	public scrumID?: string;

	public scrum: IScrumDbo = {
		type: 'staff',
		userIDs: [],
		statuses: [],
	};

	public timerState?: ITimerState;

	public spectators?: ISpaceMemberInfo[];

	public isToday?: boolean;
	public scrumDate?: Date;

	public prevScrumID?: string;
	public prevScrumDate?: Date;

	public nextScrumID?: string;
	public nextScrumDate?: Date;
	public allStatuses?: IStatus[];
	public displayStatuses?: IStatus[];
	public memberStatus?: IStatus;
	public userMemberId?: string;
	public readonly taskTypes: TaskType[] = ['done', 'todo', 'risk', 'qna'];
	public spaceMetrics?: IMetric[];
	public personalMetrics?: IMetric[];
	public timer?: Timer;
	public expandedMemberId?: string | null;
	private scrumsById: Record<string, IScrumDbo> = {};
	private subscriptions: Subscription[] = []; // TODO: replace with subs from BAsePage?

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		private readonly scrumService: ScrumService,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly location: Location,
		private readonly timerFactory: TimerFactory,
	) {
		super('ScrumPageComponent', route, params);
	}

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

	public override get defaultBackUrl(): string {
		return this.space?.id ? `team?id=${this.space.id}` : 'spaces';
	}

	private static getDateFromId(scrumId: string): Date {
		const year = scrumId.substr(0, 4);
		const month = scrumId.substr(5, 2);
		const day = scrumId.substr(8, 2);
		return new Date(+year, +month - 1, +day);
	}

	public override ngOnInit() {
		try {
			const tab = window?.location?.hash?.match(/[#&]tab=(\w+)/);

			this.tab = (tab?.[1] || this.tab) as ScrumPageTab;

			const scrum = history.state.scrum as IRecord<IScrumDbo>;
			if (scrum?.dbo) {
				this.setScrumId(scrum.id);
				this.scrumLoaded(scrum.id, scrum.dbo, 'history.state.scrum');
			} else {
				if (this.route) {
					this.setCurrentScrumIdFromUrl(this.route.snapshot.queryParamMap);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'ScrumPage.constructor()');
		}
	}

	public override ngOnDestroy(): void {
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
		// this.navController.navigateToScrums(this.navController, this.team);
		throw new Error('not implemented');
	}

	public changeDate(to: 'prev' | 'next' | 'today' | string): void {
		console.log(`changeDate(to=${to}, currentScrumDate=${this.scrumDate})`);
		if (!this.space) {
			this.errorLogger.logError('can not change date without team context');
			return;
		}
		this.analyticsService.logEvent('ScrumPage.changeDate', { to });
		if (to === 'today') {
			this.isToday = true;
			this.scrumDate = getToday();
			this.scrumID = getMeetingIdFromDate(this.scrumDate);
			this.subscribeScrum(this.space.id, this.scrumID, 'changeDate');
		}
		switch (to) {
			case 'today': {
				this.setScrumId(getMeetingIdFromDate(getToday()));
				break;
			}
			case 'prev': {
				throw new Error('Not implemented');
				// const prevScrumId =
				// 	this.scrum?.scrumIds?.prev ||
				// 	(this.isToday && this.team?.dto?.last?.scrum?.id);
				// if (!prevScrumId) {
				// 	this.errorLogger.logError(
				// 		`Attempted to go PREV non-existing scrum (teamId=${this.team?.id}, scrumId=${this.scrumID})`,
				// 	);
				// 	return;
				// }
				// this.setScrumId(prevScrumId);
				// break;
			}
			case 'next': {
				if (!this.scrum?.scrumIds?.next) {
					this.errorLogger.logError(
						`Attempted to go NEXT non-existing scrum (teamId=${this.space?.id}, scrumId=${this.scrumID})`,
					);
					return;
				}
				this.prevScrumDate = this.scrumDate;
				this.setScrumId(this.scrum.scrumIds.next);
				break;
			}
		}
		if (this.space?.dbo) {
			// this.merge(this.scrum, undefined, this.team.dto?.members);
			throw new Error('not implmented');
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
			if (this.displayStatuses) {
				this.displayStatuses = [...this.displayStatuses];
			}
		} else {
			this.expandedMemberId = null;
		}
	}

	public toggleScrumTimer(): void {
		try {
			this.timer?.toggleTimer().subscribe({
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to toggle scrum timer'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to call timer.toggleTimer()');
		}
	}

	protected override onSpaceIdChanged(): void {
		super.onSpaceIdChanged();
		if (!this.space?.id) {
			return;
		}
		if (this.scrumDate && this.scrumID) {
			this.subscribeScrum(
				this.space.id,
				this.scrumID,
				`subscribeTeam(this.scrumId=${this.scrumID})`,
			);
		}
	}

	protected override onSpaceDboChanged(): void {
		const teamDto = this.space?.dbo;
		if (!teamDto) {
			return;
		}
		if (this.scrumID && !this.timer) {
			this.setTimer(this.space.id, this.scrumID);
		}
		throw new Error('not implemented yet');
		// const lastScrumId = teamDto.last?.scrum?.id;
		// if (this.isToday && lastScrumId && lastScrumId !== this.scrumID) {
		// 	this.prevScrumID = lastScrumId;
		// 	this.prevScrumDate = ScrumPageComponent.getDateFromId(this.prevScrumID);
		// }
		// if (teamDto.members) {
		// 	this.spectators = teamDto.members.filter((m) =>
		// 		m.roles?.indexOf(MemberRoleSpectator),
		// 	);
		// 	const uid = this.currentUserId;
		// 	const member = Object.values(teamDto.members).find(
		// 		(m) => m.userID === uid,
		// 	);
		// 	if (member) {
		// 		this.userMemberId = member.id;
		// 		this.setStatuses();
		// 	}
		// } else {
		// 	this.spectators = [];
		// }
		// if (teamDto.metrics) {
		// 	this.teamMetrics = teamDto.metrics
		// 		.filter((m) => m.mode === 'team')
		// 		.map(() => {
		// 			// const m3 = this.teamMetrics?.find((m2) => m2.id === m.id);
		// 			// return { ...m, value: m3?.value } as IMetric;
		// 			throw new Error('not implemented');
		// 		});
		// 	this.personalMetrics = teamDto.metrics
		// 		.filter((m) => m.mode === 'personal')
		// 		.map(() => {
		// 			// const m3 = this.personalMetrics?.find((m2) => m2.id === m.id);
		// 			// return { ...m, value: m3?.value } as IMetric;
		// 			throw new Error('not implemented');
		// 		});
		// }
		// this.merge(this.scrum, undefined, teamDto.members);
	}

	protected override unsubscribe(reason?: string): void {
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

	private scrumLoaded(id: string, scrum: IScrumDbo, from: string): void {
		console.log(
			`${from}: scrumLoaded(${id}: currentScrumId=${this.scrumID}`,
			scrum,
		);
		this.scrumsById[id] = scrum;
		switch (id) {
			case this.scrumID:
				this.timer?.updateTimerState(scrum?.timer);
				this.scrum = scrum || {
					...this.scrum,
					statuses: [],
					risksCount: undefined,
					questionsCount: undefined,
					timer: undefined,
				};
				// if (scrum?.timer?.status === 'active') {
				// 	this.startTimer();
				// } else {
				// 	this.setTotalElapsed();
				// }
				console.log('this.scrum', this.scrum);
				if (this.space?.dbo) {
					throw new Error('not implemented yet');
					// this.merge(this.scrum, undefined, this.team.dto.members);
				}
				this.prevScrumID = scrum?.scrumIds?.prev;
				if (this.prevScrumID) {
					this.prevScrumDate = ScrumPageComponent.getDateFromId(
						this.prevScrumID,
					);
				}
				this.nextScrumID = scrum?.scrumIds?.next;
				if (this.nextScrumID) {
					this.nextScrumDate = ScrumPageComponent.getDateFromId(
						this.nextScrumID,
					);
				}
				console.log(`mapped to current scrum ${id}:`, this.scrum);
				break;
			case this.prevScrumID:
				// this.prevScrum = scrum || {...this.prevScrum, statuses: []};
				if (this.space?.dbo) {
					throw new Error('not implemented yet');
					// this.merge(this.scrum, undefined, this.team.dto.members);
				}
				console.log(`mapped to previous scrum ${id}:`, this.scrum);
				break;
			default:
				console.log(
					`loaded scrum(${id}) not related to current(${this.scrumID}) or previous(${this.prevScrumID}) or next(${this.nextScrumID}):`,
					scrum,
				);
		}
	}

	private subscribeScrum(teamId: string, scrumId: string, from: string) {
		console.log(`${from}: subscribeScrum(space=${teamId}, scrumId=${scrumId})`);
		if (this.scrumsById[scrumId]) {
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
						// this.navService?.navigateToTeam(
						// 	this.team.id,
						// 	undefined,
						// 	this.team.data,
						// 	'back',
						// );
						throw new Error('not implemented');
					},
				}),
		);
	}

	private merge(
		scrum: IScrumDbo,
		prevScrum?: IScrumDbo,
		members?: ISpaceMemberInfo[],
	): void {
		console.log(
			'ScrumPage.merge(),\n\tscrum:',
			scrum,
			'\n\tprevScrum:',
			prevScrum,
			'\n\tmembers:',
			members,
		);
		throw new Error('not implemented');
		// this.allStatuses = members
		// 	.filter((m) => m.roles?.includes(MemberRoleEnum.contributor))
		// 	.map((member) => ({
		// 		member,
		// 		byType: {},
		// 	}));
		// if (scrum?.statuses) {
		// 	Object.values(scrum.statuses).forEach((item) => {
		// 		console.log('item1:', item);
		// 		const { id } = item.member;
		// 		item = {
		// 			...item,
		// 			byType: {
		// 				done: item.byType.done || [],
		// 				risk: item.byType.risk || [],
		// 				plan: item.byType.plan || [],
		// 				todo: item.byType.todo || [],
		// 				qna: item.byType.qna || [],
		// 			},
		// 		};
		// 		if (this.allStatuses) {
		// 			const index = this.allStatuses.findIndex(
		// 				(v) => id && id === v.member.id,
		// 			);
		// 			console.log('item:', item);
		// 			if (index < 0) {
		// 				this.allStatuses.push(item);
		// 			} else {
		// 				this.allStatuses[index] = item;
		// 			}
		// 		}
		// 	});
		// } else {
		// 	this.allStatuses?.forEach((status) => {
		// 		status.byType.todo = [];
		// 		status.byType.done = [];
		// 		status.byType.risk = [];
		// 	});
		// }
		//
		// if (prevScrum?.statuses) {
		// 	Object.values(prevScrum.statuses).forEach((item) => {
		// 		const { id } = item.member;
		// 		if (this.allStatuses) {
		// 			const index = this.allStatuses.findIndex(
		// 				(v) => id && id === v.member.id,
		// 			);
		// 			if (index < 0) {
		// 				this.allStatuses.push({
		// 					member: item.member,
		// 					byType: {
		// 						plan: item.byType.todo,
		// 						risk: [],
		// 						todo: [],
		// 						done: [],
		// 						qna: [],
		// 					},
		// 				});
		// 			} else {
		// 				this.allStatuses[index].byType.plan = item.byType.todo;
		// 			}
		// 		}
		// 	});
		// } else {
		// 	this.allStatuses?.forEach((status) => {
		// 		status.byType.plan = [];
		// 	});
		// }
		//
		// this.setStatuses();
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
			if (timerState?.elapsedSeconds) {
				this.totalElapsed = secondsToStr(timerState.elapsedSeconds);
			} else {
				this.totalElapsed = undefined;
			}
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
		throw new Error('not implemented yet');
		// try {
		// 	this.prevScrumID = undefined;
		// 	this.prevScrumDate = undefined;
		// 	this.nextScrumID = undefined;
		// 	this.nextScrumDate = undefined;
		// 	const todayId = getMeetingIdFromDate(getToday());
		// 	if (id === 'today') {
		// 		id = todayId;
		// 	}
		// 	this.scrumID = id;
		// 	if (this.team) {
		// 		this.setTimer(this.team.id, id);
		// 	}
		// 	this.scrumDate = ScrumPageComponent.getDateFromId(id);
		// 	console.log(`setCurrentScrum() id=${id}, scrumDate:`, this.scrumDate);
		// 	const scrum = this.scrumsById[id];
		// 	console.log('setCurrentScrum() => scrum:', id, scrum, this.scrumsById);
		// 	this.scrum = scrum;
		// 	this.isToday = id === todayId;
		// 	console.log(`isToday=${this.isToday}, id=${id}, todayId=${todayId}`);
		// 	{
		// 		/*if (scrum) - we need to set prevScrumId even if no scrum record */
		// 		this.prevScrumID =
		// 			scrum?.scrumIds?.prev ||
		// 			(this.isToday && this.team?.dto?.last?.scrum?.id) ||
		// 			undefined;
		// 		if (this.prevScrumID) {
		// 			this.prevScrumDate = ScrumPageComponent.getDateFromId(
		// 				this.prevScrumID,
		// 			);
		// 		}
		// 		this.nextScrumID = scrum?.scrumIds?.next;
		// 		if (this.nextScrumID) {
		// 			this.nextScrumDate = ScrumPageComponent.getDateFromId(
		// 				this.nextScrumID,
		// 			);
		// 		}
		// 	}
		// 	if (this.team) {
		// 		this.subscribeScrum(this.team.id, this.scrumID, 'setCurrentScrum');
		// 	}
		// } catch (e) {
		// 	this.errorLogger.logError(e, `Failed in setCurrentScrum(${id})`);
		// }
	}
}
