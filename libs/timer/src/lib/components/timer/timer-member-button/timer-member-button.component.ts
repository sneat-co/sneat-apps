import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerMemberButtonComponent implements OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  public readonly scrumID = input<string>();
  public readonly scrum = input<IScrumDbo>();
  public readonly memberID = input<string>();
  public readonly spaceID = input<string>();
  public readonly toggled = output<boolean>();
  public readonly timer = input<Timer>();

  public readonly totalElapsed = signal<string | undefined>(undefined);
  public readonly timerState = signal<ITimerState | undefined>(undefined);

  private timerSubscription?: Subscription;

  public readonly isDisabled = computed<boolean>(() => {
    const timerState = this.timerState();
    return !!(
      !(this.spaceID() && this.memberID() && this.scrumID() && timerState) ||
      timerState?.isToggling
    );
  });

  constructor() {
    effect(() => {
      const timer = this.timer();
      try {
        this.unsubscribeFromTimer();
        if (timer) {
          this.timerSubscription = timer.onTick.subscribe(this.onTimerTicked);
        }
      } catch (e) {
        this.errorLogger.logError(
          e,
          'TimerMemberButton component failed to process timer change',
          {
            feedback: false,
            show: false,
          },
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeFromTimer();
  }

  public toggleTimer(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const timerState = this.timerState();
    if (!timerState) {
      throw new Error('!this.timerState');
    }
    const { status, activeMemberId } = timerState;
    const memberID = this.memberID();
    this.toggled.emit(
      status !== TimerStatusEnum.active ||
        (status === TimerStatusEnum.active && activeMemberId !== memberID),
    );
    this.timer()
      ?.toggleTimer(memberID)
      .subscribe({
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
      this.timerState.set(timerState);
      // this.totalElapsed.set(
      // 	timerState && secondsToStr(timerState.secondsByMember?.[this.memberId]));
      throw new Error('Not implemented yet');
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to process');
    }
  };
}
