import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	signal,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCol,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { ISpaceDbo } from '@sneat/dto';
import { ITimerState, Timer, TimerFactory } from '@sneat/ext-meeting';
import {
	IRetrospective,
	RetrospectiveStage,
} from '@sneat/ext-scrumspace-scrummodels';
import { Subscription } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRecord } from '@sneat/data';
import { secondsToStr } from '@sneat/datetime';
import {
	IRetrospectiveRequest,
	RetrospectiveService,
} from '../../retrospective.service';

@Component({
	selector: 'sneat-retro-timer',
	templateUrl: './retro-timer.component.html',
	providers: [TimerFactory],
	imports: [
		IonList,
		IonRow,
		IonCol,
		IonItem,
		IonButtons,
		IonButton,
		IonIcon,
		IonLabel,
		IonSelect,
		IonSelectOption,
	],
})
export class RetroTimerComponent implements OnDestroy, OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly retrospectiveService = inject(RetrospectiveService);
	private readonly timerFactory = inject(TimerFactory);

	@Input() public space?: IRecord<ISpaceDbo>;
	@Input() retrospective?: IRecord<IRetrospective>;

	public timer?: Timer;

	public $feedbackDuration = signal<number>(10);
	public $reviewDuration = signal<number>(50);

	leftInSeconds = 600;
	public totalElapsed?: string;
	private timerSubscription?: Subscription;

	get minutesLeft(): number {
		return Math.round((this.leftInSeconds - 30) / 60);
	}

	get secondsLeft(): number {
		return this.leftInSeconds % 60;
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('RetroTimerComponent.ngOnChanges', changes);
		if (changes['space'] || changes['retrospective']) {
			if (this.space?.id && this.retrospective?.id) {
				if (
					this.timer?.spaceID !== this.space.id ||
					this.timer.meetingId !== this.retrospective.id
				) {
					if (this.timer) {
						this.timerSubscription?.unsubscribe();
					}
					if (this.retrospective.id !== 'upcoming') {
						this.createTimer();
					}
				}
			}
			if (changes['retrospective'] && this.retrospective?.dbo?.timer) {
				this.timer?.updateTimerState(this.retrospective.dbo.timer);
			}
		}
	}

	ngOnDestroy(): void {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	public startRetro(): void {
		try {
			this.retrospectiveService
				.startRetrospective({
					...this.createRetroRequest(),
					durationInMinutes: {
						feedback: this.$feedbackDuration(),
						review: this.$reviewDuration(),
					},
				})
				.subscribe({
					next: this.updateRetrospective,
					error: (err) =>
						this.errorLogger.logError(err, 'Failed to start retrospective'),
				});
			if (this.retrospective?.dbo) {
				this.retrospective.dbo.stage = RetrospectiveStage.feedback;
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to start retrospective');
		}
	}

	updateRetrospective = (retrospective: IRecord<IRetrospective>): void => {
		console.log('updateRetrospective()', retrospective);
		try {
			this.retrospective = retrospective;
			if (!this.timer) {
				this.createTimer();
			}
			this.timer?.updateTimerState(retrospective.dbo?.timer);
		} catch (e) {
			this.errorLogger.logError(
				e,
				'Failed to update state from new retrospective record',
			);
		}
	};

	public startReview(): void {
		this.retrospectiveService
			.startRetroReview(this.createRetroRequest())
			.subscribe({
				next: this.updateRetrospective,
				error: (err) =>
					this.errorLogger.logError(
						err,
						'Failed to start review phase of retrospective',
					),
			});
	}

	public resumeTimer(): void {
		this.timer?.startTimer().subscribe({
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to resume retrospective timer'),
		});
	}

	public pauseRetro(): void {
		console.log('pauseRetro()');
		if (!this.timer) {
			this.errorLogger.logError(
				'pauseRetro() called before timer has been initialized.',
			);
			return;
		}
		this.timer.pauseTimer().subscribe({
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to pause retrospective timer'),
		});
	}

	private createTimer(): void {
		if (!this.space) {
			throw new Error('!this.team');
		}
		if (!this.retrospective) {
			throw new Error('!this.retrospective');
		}
		this.timer = this.timerFactory.getTimer(
			this.retrospectiveService,
			this.space.id,
			this.retrospective.id,
		);
		this.timerSubscription = this.timer.onTick.subscribe(this.onTimerTicked);
	}

	private onTimerTicked = (timer: ITimerState): void => {
		console.log('onTimerTicked', timer);
		if (!this.space) {
			throw new Error('!this.team');
		}
		if (!this.retrospective) {
			throw new Error('!this.retrospective');
		}
		try {
			// this.retrospective = {
			//   ...this.retrospective,
			//   dto: {
			//     ...this.retrospective.dto,
			//     timer,
			//   },
			// };
			this.totalElapsed =
				(timer?.elapsedSeconds && secondsToStr(timer.elapsedSeconds)) || '0';
			throw new Error('not implemented yet');
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process timer ticked event');
		}
	};

	private createRetroRequest(): IRetrospectiveRequest {
		if (!this.space) {
			throw new Error('!this.team');
		}
		if (!this.retrospective) {
			throw new Error('!this.retrospective');
		}
		return { spaceID: this.space.id, meeting: this.retrospective.id };
	}
}
