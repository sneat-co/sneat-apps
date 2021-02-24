import {Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {
  IRetrospective,
  IRetrospectiveRequest,
  RetrospectiveService,
  RetrospectiveStage
} from '@sneat/scrumspace/retrospectives';
import {ITimerState} from '../../models';
import {Timer, TimerFactory} from '../../timer.service';
import {IRecord} from '@sneat/data';
import {ITeam} from '@sneat/team';
import {secondsToStr} from '@sneat/datetime';

@Component({
  selector: 'app-retro-timer',
  templateUrl: './retro-timer.component.html',
  styleUrls: ['./retro-timer.component.scss'],
})
export class RetroTimerComponent implements OnDestroy, OnChanges {

  @Input() public team: IRecord<ITeam>;
  @Input() retrospective: IRecord<IRetrospective>

  public timer: Timer;

  public feedbackDuration = 10;
  public reviewDuration = 50;

  leftInSeconds = 600;
  public totalElapsed: string;
  private timerSubscription: Subscription;

  // public get isEnabled(): boolean {
  // 	return !!this.team;
  // }

  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    private readonly retrospectiveService: RetrospectiveService,
    private readonly timerFactory: TimerFactory,
  ) {
  }

  get minutesLeft(): number {
    return Math.round((this.leftInSeconds - 30) / 60);
  }

  get secondsLeft(): number {
    return this.leftInSeconds % 60;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('RetroTimerComponent.ngOnChanges', changes);
    if (changes.team || changes.retrospective) {
      if (this.team?.id && this.retrospective?.id) {
        if (this.timer?.teamId !== this.team.id || this.timer.meetingId !== this.retrospective.id) {
          if (this.timer) {
            this.timerSubscription.unsubscribe();
          }
          if (this.retrospective.id !== 'upcoming') {
            this.createTimer();
          }
        }
      }
      if (changes.retrospective && this.retrospective?.data?.timer) {
        this.timer.updateTimerState(this.retrospective.data.timer);
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
      this.retrospectiveService.startRetrospective({
        ...this.createRetroRequest(),
        durationInMinutes: {
          feedback: this.feedbackDuration,
          review: this.reviewDuration,
        },
      }).subscribe({
        next: this.updateRetrospective,
        error: err => this.errorLogger.logError(err, 'Failed to start retrospective'),
      })
      this.retrospective.data.stage = RetrospectiveStage.feedback;
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
      this.timer.updateTimerState(retrospective.data?.timer);
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to update state from new retrospective record');
    }
  }

  public startReview(): void {
    this.retrospectiveService
      .startRetroReview(this.createRetroRequest())
      .subscribe({
        next: this.updateRetrospective,
        error: err => this.errorLogger.logError(err, 'Failed to start review phase of retrospective'),
      });
  }

  public resumeTimer(): void {
    this.timer.startTimer().subscribe({
      error: err => this.errorLogger.logError(err, 'Failed to resume retrospective timer'),
    });
  }

  public pauseRetro(): void {
    console.log('pauseRetro()');
    if (!this.timer) {
      this.errorLogger.logError('pauseRetro() called before timer has been initialized.');
      return;
    }
    this.timer.pauseTimer().subscribe({
      error: err => this.errorLogger.logError(err, 'Failed to pause retrospective timer'),
    });
  }

  private createTimer(): void {
    this.timer = this.timerFactory.getTimer(this.retrospectiveService, this.team.id, this.retrospective.id)
    this.timerSubscription = this.timer.onTick.subscribe(this.onTimerTicked);
  }

  private onTimerTicked = (timer: ITimerState): void => {
    console.log('onTimerTicked', timer);
    try {
      this.retrospective = {
        ...this.retrospective,
        data: {
          ...this.retrospective.data,
          timer,
        },
      };
      this.totalElapsed = timer && secondsToStr(timer.elapsedSeconds);
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to process timer ticked event');
    }
  }

  private createRetroRequest(): IRetrospectiveRequest {
    return {team: this.team.id, meeting: this.retrospective.id};
  }
}
