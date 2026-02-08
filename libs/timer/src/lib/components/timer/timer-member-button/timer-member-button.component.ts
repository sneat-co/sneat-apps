import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonIcon,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ITimerState, Timer } from '@sneat/ext-meeting';
import { IScrumDbo, TimerStatusEnum } from '@sneat/ext-scrumspace-scrummodels';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-timer-member-button',
	templateUrl: './timer-member-button.component.html',
	imports: [IonButton, IonSpinner, IonIcon, IonLabel],
})
export class TimerMemberButtonComponent implements OnDestroy, OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input() public scrumID?: string;
	@Input() public scrum?: IScrumDbo;
	@Input() public memberID?: string;
	@Input() public spaceID?: string;
	@Output() public toggled = new EventEmitter<boolean>();
	@Input() public timer?: Timer;

	public totalElapsed?: string;
	public timerState?: ITimerState;

	private timerSubscription?: Subscription;

	public get isDisabled(): boolean {
		return !!(
			!(this.spaceID && this.memberID && this.scrumID && this.timerState) ||
			this.timerState?.isToggling
		);
	}

	ngOnDestroy(): void {
		this.unsubscribeFromTimer();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('TimerMemberButton.ngOnChanges()', changes);
		try {
			if (changes['timer'] && this.timer) {
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
		if (!this.timerState) {
			throw new Error('!this.timerState');
		}
		const { status, activeMemberId } = this.timerState;
		this.toggled.emit(
			status !== TimerStatusEnum.active ||
				(status === TimerStatusEnum.active && activeMemberId !== this.memberID),
		);
		this.timer?.toggleTimer(this.memberID).subscribe({
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
			// this.totalElapsed =
			// 	timerState && secondsToStr(timerState.secondsByMember?.[this.memberId]);
			throw new Error('Not implemented yet');
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process');
		}
	};
}
