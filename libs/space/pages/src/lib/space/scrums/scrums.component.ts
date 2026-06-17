import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  effect,
  input,
  signal,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { ISpaceDbo } from '@sneat/dto';
// import { ScrumService } from '@sneat/ext-scrumspace-dailyscrum';
import { Subject } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { getMeetingIdFromDate, getToday } from '@sneat/ext-meeting';
import { IRecord } from '@sneat/data';
import { IScrumDbo } from '@sneat/ext-scrumspace-scrummodels';
import { SpaceNavService } from '@sneat/space-services';

@Component({
  selector: 'sneat-scrums',
  templateUrl: './scrums.component.html',
  imports: [
    IonCard,
    IonItemDivider,
    IonLabel,
    IonText,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrumsComponent implements OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navController = inject(NavController);
  readonly navService = inject(SpaceNavService);

  public readonly space = input<IRecord<ISpaceDbo>>();

  public readonly prevScrumId = signal<string | undefined>(undefined);
  public readonly todayScrum = signal<IScrumDbo | undefined>(undefined);

  protected readonly destroyed = new Subject<boolean>();

  private spaceID?: string;

  constructor() {
    effect(() => {
      this.space();
      try {
        throw new Error('not implemented due to refactoring');
        // if (this.team && this.teamId !== this.team.id) {
        // 	this.todayScrum = undefined;
        // 	this.prevScrumId = undefined;
        // }
        // const team = this.team?.dto;
        // if (team?.last?.scrum?.id) {
        // 	const today = getToday();
        // 	const todayId = getMeetingIdFromDate(today);
        // 	if (team.last?.scrum?.id === todayId && this.team?.id) {
        // 		this.scrumService
        // 			.watchScrum(this.team.id, todayId)
        // 			.pipe(takeUntil(this.destroyed))
        // 			.subscribe({
        // 				next: (scrum) => {
        // 					this.todayScrum = scrum;
        // 					this.prevScrumId =
        // 						scrum && scrum.scrumIds && scrum.scrumIds.prev;
        // 				},
        // 				error: (err) =>
        // 					this.errorLogger.logError(
        // 						err,
        // 						`failed to load scrum by id=${todayId}`,
        // 						{ feedback: false, show: false, report: true },
        // 					),
        // 			});
        // 	} else {
        // 		this.prevScrumId = team.last.scrum.id;
        // 	}
        // }
      } catch (e) {
        this.errorLogger.logError(e, 'Failed to process team changes');
      }
    });
  }

  protected goScrum(
    date?: 'today' | string,
    tab?: 'team' | 'my',
    event?: Event,
  ): void {
    try {
      if (!date) {
        this.errorLogger.logError('date is empty or undefined', date);
        return;
      }
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const todayScrum = this.todayScrum();
      const scrum = date === 'today' &&
        todayScrum && {
          id: getMeetingIdFromDate(getToday()),
          data: todayScrum,
        };
      const space = this.space();
      if (space && scrum) {
        this.navService.navigateToScrum(date, space, scrum, tab);
      }
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to navigate to scrum');
    }
  }

  protected goScrums(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const space = this.space();
    if (space) {
      this.navService.navigateToScrums(this.navController, space);
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
