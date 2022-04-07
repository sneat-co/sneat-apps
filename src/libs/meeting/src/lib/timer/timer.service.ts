import { Inject, Injectable } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { interval, Observable, ReplaySubject, Subject, Subscription, throwError } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

import firebase from 'firebase/compat/app';
import {
	IMeetingTimerRequest,
	IMemberTimerRequest,
	ITimerResponse,
	ITimerState,
	TimerOperation,
	TimerOperationEnum,
	TimerStatusEnum,
} from './models';
import Timestamp = firebase.firestore.Timestamp;

export interface IMeetingTimerService {
	readonly meetingType: string;

	toggleMemberTimer(request: IMemberTimerRequest): Observable<ITimerResponse>;

	toggleMeetingTimer(request: IMeetingTimerRequest): Observable<ITimerResponse>;
}

export class Timer {
	private tick = new ReplaySubject<ITimerState>(1);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly onTick = this.tick.asObservable();

	private state?: ITimerState;
	private prevState?: ITimerState;

	private intervalSubscription?: Subscription;
	private destroyed = new Subject<boolean>();

	private lastTick?: ITimerState;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly timerService: IMeetingTimerService,
		private readonly released: () => void,
		public readonly teamId: string,
		public readonly meetingId: string,
	) {
	}

	public releaseTimer(): void {
		if (this.intervalSubscription) {
			this.intervalSubscription.unsubscribe();
			this.intervalSubscription = undefined;
		}
		this.destroyed.next(true);
		this.released();
	}

	public updateTimerState(timerState?: ITimerState): ITimerState {
		console.log(
			'Timer.updateTimerState()',
			{ ...timerState },
			{ ...this.state },
		);
		if (!timerState) {
			this.state = {};
			this.tick.next(this.state);
			return this.state;
		}
		timerState = timerState || {};
		try {
			const prevState = this.state;
			const prevAt =
				prevState && typeof prevState.at === 'string'
					? Timestamp.fromDate(new Date(prevState.at))
					: (prevState?.at as Timestamp);
			const { elapsedSeconds } = timerState;
			const at =
				typeof timerState.at === 'string'
					? Timestamp.fromDate(new Date(timerState.at))
					: timerState.at;
			if (at?.nanoseconds && prevAt?.nanoseconds !== at.nanoseconds) {
				this.state = {
					...timerState,
					isToggling: this.state?.isToggling,
					status: this.state?.isToggling
						? this.state?.status
						: timerState.status,
					elapsedSeconds:
						timerState.status === TimerStatusEnum.active
							? (elapsedSeconds || 0) +
							(new Date().getTime() / 1000 - at.seconds)
							: timerState?.elapsedSeconds,
				};
			}
			if (isNaN(this.state?.elapsedSeconds as number)) {
				console.log('this.state.elapsedSeconds is NaN');
			}
			switch (this.state?.status) {
				case undefined:
				case TimerStatusEnum.active:
					if (prevState?.status !== TimerStatusEnum.active) {
						this.startTicking();
					} else {
						this.emitTick();
					}
					break;
				case TimerStatusEnum.stopped:
					if (prevState?.status !== TimerStatusEnum.stopped) {
						this.stopTicking();
					} else {
						this.emitTick();
					}
					break;
				default:
					this.emitTick();
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to update timer state', {
				feedback: false,
				show: false,
			});
		}
		return this.state || {};
	}

	public startTimer(member?: string): Observable<never> {
		return this.setTimerState(TimerOperationEnum.start, member);
	}

	public pauseTimer(member?: string): Observable<never> {
		return this.setTimerState(TimerOperationEnum.pause, member);
	}

	public stopTimer(member?: string): Observable<never> {
		return this.setTimerState(TimerOperationEnum.stop, member);
	}

	public toggleTimer(member?: string): Observable<never> {
		let operation: TimerOperation;
		switch (this.state?.status) {
			case TimerStatusEnum.stopped:
			case TimerStatusEnum.paused:
				operation = TimerOperationEnum.start;
				break;
			case TimerStatusEnum.active:
				operation =
					!member || member === this.state.activeMemberId
						? TimerOperationEnum.stop
						: TimerOperationEnum.start;
				break;
			default:
				return throwError(() => `Unexpected timer status: ${this.state?.status}`);
		}
		return this.setTimerState(operation, member);
	}

	public setTimerState(
		operation: TimerOperation,
		member?: string,
	): Observable<never> {
		console.log(`Timer.toggleTimer(member=${member})`);
		const result = new Subject<never>();
		try {
			this.prevState = this.state;

			this.state = {
				...this.state,
				isToggling: true,
				status:
					operation === TimerOperationEnum.start
						? TimerStatusEnum.active
						: operation === TimerOperationEnum.stop
							? TimerStatusEnum.stopped
							: undefined,
				activeMemberId: member,
			};
			this.emitTick();

			switch (operation) {
				case TimerOperationEnum.start:
					this.startTicking();
					break;
				case TimerOperationEnum.pause:
				case TimerOperationEnum.stop:
					this.stopTicking();
					break;
				default:
					return throwError(() => 'Unknown operation: ' + operation);
			}
			let toggleTimerMethod: () => Observable<ITimerResponse>;
			if (member) {
				toggleTimerMethod = () => this.timerService.toggleMemberTimer({
					teamID: this.teamId,
					meeting: this.meetingId,
					operation,
					member,
				});
			} else {
				toggleTimerMethod = () => this.timerService.toggleMeetingTimer({
					teamID: this.teamId,
					meeting: this.meetingId,
					operation,
				});
			}

			toggleTimerMethod()
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (response) => {
						try {
							this.onTimerResponse(response);
							if (!result.closed) {
								result.complete();
							}
						} catch (e) {
							this.errorLogger.logError(
								e,
								'toggleTimer() => failed to process API response',
							);
						}
					},
					error: (err) => {
						try {
							this.onTimerToggleFailed(operation);
							if (!result.closed) {
								result.error(err);
							}
						} catch (e) {
							this.errorLogger.logError(
								e,
								'toggleTimer() => failed to process observable error',
							);
						}
					},
				});
		} catch (e) {
			this.errorLogger.logError(e, 'toggleTimer() => failed to execute');
			try {
				this.onTimerToggleFailed(operation);
				if (!result.closed) {
					result.error(e);
				}
			} catch (ee) {
				this.errorLogger.logError(
					ee,
					'toggleTimer() => failed to process error',
				);
			}
		}
		return result.asObservable();
	}

	private onTimerToggleFailed = (operation: TimerOperation): void => {
		this.state = {
			...this.prevState,
			isToggling: false,
		};
		if (operation === TimerOperationEnum.start) {
			this.unsubscribeInterval();
		}
		this.emitTick();
	};

	private onTimerResponse = (response: ITimerResponse): ITimerState => {
		console.log('onTimerResponse()', response);
		this.prevState = undefined;
		this.state = {
			...this.state,
			isToggling: false,
		};
		return this.updateTimerState(response.timer);
	};

	private unsubscribeInterval(): void {
		if (this.intervalSubscription) {
			this.intervalSubscription.unsubscribe();
		}
	}

	private startTicking(): void {
		if (this.state?.status !== TimerStatusEnum.active) {
			this.state = {
				...this.state,
				status: TimerStatusEnum.active,
			};
		}
		this.unsubscribeInterval();
		this.emitTick();
		this.intervalSubscription = interval(1000).subscribe({
			next: this.nextSecond,
		});
	}

	private stopTicking(): void {
		this.unsubscribeInterval();
		console.log('Timer.stopTicking()', this.state?.status);
		if (this.state?.status !== TimerStatusEnum.stopped) {
			this.state = {
				...this.state,
				status: TimerStatusEnum.stopped,
			};
		}
		this.emitTick();
	}

	private nextSecond = (): void => {
		this.state = {
			...this.state,
			elapsedSeconds: (this.state?.elapsedSeconds || 0) + 1,
		};
		if (this.state?.activeMemberId) {
			if (!this.state.secondsByMember) {
				this.state.secondsByMember = {};
			}
			this.state.secondsByMember = {
				...this.state.secondsByMember,
				[this.state.activeMemberId]:
				(this.state.secondsByMember[this.state.activeMemberId] ?? 0) + 1,
			};
		}
		this.emitTick();
	};

	private emitTick(): void {
		const state = this.state || {},
			lastTick = this.lastTick;
		if (
			!lastTick ||
			state.status !== lastTick.status ||
			state.activeMemberId !== lastTick.activeMemberId ||
			state.elapsedSeconds !== lastTick.elapsedSeconds ||
			state.isToggling !== lastTick.isToggling
		) {
			this.lastTick = state;
			console.log('Timer.emitTick()', JSON.stringify(state));
			this.tick.next(state);
		} else {
			console.log('Timer.emitTick(): state not changed');
		}
	}
}

@Injectable()
export class TimerFactory {
	private readonly timers: { [id: string]: Timer } = {};

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public getTimer(
		timerService: IMeetingTimerService,
		teamId: string,
		meetingId: string,
	): Timer {
		if (!teamId) {
			throw new Error('teamId is required');
		}
		if (!meetingId) {
			throw new Error('meetingId is required');
		}
		const { meetingType } = timerService;
		if (!meetingType) {
			throw new Error('timerService.meetingType is required');
		}
		const k = `${teamId}/${meetingType}/${meetingId}`;
		return (
			this.timers[k] ??
			(this.timers[k] = this.newTimer(k, timerService, teamId, meetingId))
		);
	}

	private newTimer = (
		k: string,
		timerService: IMeetingTimerService,
		teamId: string,
		meetingId: string,
	) =>
		new Timer(
			this.errorLogger,
			timerService,
			this.onTimerReleased(k),
			teamId,
			meetingId,
		);

	private onTimerReleased = (k: string) => () => {
		delete this.timers[k];
	};
}
