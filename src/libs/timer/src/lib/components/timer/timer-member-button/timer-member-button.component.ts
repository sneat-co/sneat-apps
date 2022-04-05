import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITimerState, TimerStatusEnum } from '../../../../../../meeting/src/lib/timer/models';
import { secondsToStr } from '@sneat/datetime';
import { Timer } from '../../../../../../meeting/src/lib/timer/timer.service';
import { IScrumDto } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-timer-member-button',
	templateUrl: './timer-member-button.component.html',
	styleUrls: ['./timer-member-button.component.scss'],
})
export class TimerMemberButtonComponent implements OnDestroy, OnChanges {
	@Input() public scrumId: string;
	@Input() public scrum?: IScrumDto;
	@Input() public memberId: string;
	@Input() public teamId: string;
	@Output() public toggled = new EventEmitter<boolean>();
	@Input() public timer: Timer;

	public totalElapsed: string;
	public timerState: ITimerState;

	private timerSubscription: Subscription;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public get isDisabled(): boolean {
		return (
			!(this.teamId && this.memberId && this.scrumId && this.timerState) ||
			this.timerState?.isToggling
		);
	}

	ngOnDestroy(): void {
		this.unsubscribeFromTimer();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('TimerMemberButton.ngOnChanges()', changes);
		try {
			if (changes.timer && this.timer) {
				this.unsubscribeFromTimer();
				this.timerSubscription = this.timer.onTick.subscribe(
					this.onTimerTicked,
				);
			}
		} catch (e) {
			this.errorLogger.logError(
				e,
				'TimerMemberButton component failed to process ngOnChanges()',
				{
					feedback: false,
					show: false,
				},
			);
		}
	}

	public toggleTimer(event: Event): void {
		if (event) {
			event.stopPropagation();
		}
		const { status, activeMemberId } = this.timerState;
		this.toggled.emit(
			status !== TimerStatusEnum.active ||
			(status === TimerStatusEnum.active && activeMemberId !== this.memberId),
		);
		this.timer.toggleTimer(this.memberId).subscribe({
			error: (err) =>
				this.errorLogger.logError(err, 'Failed toggle timer for a member`'),
		});
	}

	private unsubscribeFromTimer(): void {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
			this.timerSubscription = undefined;
		}
	}

	private onTimerTicked = (timerState: ITimerState): void => {
		try {
			this.timerState = timerState;
			this.totalElapsed =
				timerState && secondsToStr(timerState.secondsByMember?.[this.memberId]);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process');
		}
	};
}
