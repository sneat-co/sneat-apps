import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RetroTimerComponent } from '@sneat/timer';
import { filter, first, mergeMap, takeUntil } from 'rxjs/operators';
import { RetrospectiveService } from '../../retrospective.service';
import { Subscription } from 'rxjs';
import { SpaceBaseComponent } from '@sneat/space-components';
import { IRecord } from '@sneat/data';
import {
  IRetrospective,
  RetrospectiveStage,
} from '@sneat/ext-scrumspace-scrummodels';
import { SpaceService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { getMeetingIdFromDate } from '@sneat/ext-meeting';

@Component({
  selector: 'sneat-retrospective',
  templateUrl: './retrospective-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    RetroTimerComponent,
  ],
})
export class RetrospectivePageComponent
  extends SpaceBaseComponent
  implements OnDestroy
{
  readonly changeDetectorRef: ChangeDetectorRef;
  readonly errorLogger: IErrorLogger;
  readonly spaceService: SpaceService;
  readonly route: ActivatedRoute;
  readonly userService: SneatUserService;
  readonly navController: NavController;
  private readonly retrospectiveService = inject(RetrospectiveService);

  public title = 'Retrospective';
  public retrospective: IRecord<IRetrospective>;
  private retroSub: Subscription;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const errorLogger = inject<IErrorLogger>(ErrorLogger);
    const spaceService = inject(SpaceService);
    const route = inject(ActivatedRoute);
    const userService = inject(SneatUserService);
    const navController = inject(NavController);

    super(
      changeDetectorRef,
      route,
      errorLogger,
      navController,
      spaceService,
      userService,
    );
    this.changeDetectorRef = changeDetectorRef;
    this.errorLogger = errorLogger;
    this.spaceService = spaceService;
    this.route = route;
    this.userService = userService;
    this.navController = navController;

    this.trackMeetingIdFromUrl();
  }

  public showPersonalFeedback(): boolean {
    const stage = this.retrospective?.dbo?.stage;
    return (
      stage === RetrospectiveStage.upcoming ||
      stage === RetrospectiveStage.feedback
    );
  }

  ngOnDestroy() {
    // super.ngOnDestroy();
    if (this.retroSub) {
      this.retroSub.unsubscribe();
    }
  }

  protected onRetrospectiveIdChanged(): void {
    if (
      this.space?.id &&
      this.retrospective.id &&
      this.retrospective.id !== RetrospectiveStage.upcoming
    ) {
      this.watchRetro();
    }
  }

  protected override onSpaceIdChanged() {
    super.onSpaceIdChanged();
    try {
      console.log('RetrospectivePage.onSpaceIdChanged()');
      if (this.retrospective?.id) {
        this.watchRetro();
      }
    } catch (e) {
      this.logError(e, 'Failed to process changed team ID');
    }
  }

  private trackMeetingIdFromUrl(): void {
    try {
      this.userService.userChanged
        .pipe(
          filter((uid) => !!uid),
          first(),
          mergeMap(() => this.route.queryParamMap),
          takeUntil(this.destroyed$),
        )
        .subscribe({
          next: (queryParams) => {
            let id = queryParams.get('id');
            switch (id) {
              case 'today':
                id = getMeetingIdFromDate(new Date()); // TODO: replace URL?
                break;
              case RetrospectiveStage.upcoming:
                this.retrospective = {
                  id,
                  dbo: {
                    stage: RetrospectiveStage.upcoming,
                    userIDs: undefined,
                  },
                };
                break;
            }
            if (!this.retrospective) {
              this.retrospective = { id };
              this.onRetrospectiveIdChanged();
            }
          },
          error: (err) =>
            this.errorLogger.logError(err, 'Failed to load retrospective'),
        });
    } catch (e) {
      this.errorLogger.logError(e, 'Failed in track meeting id from URL');
    }
  }

  private watchRetro(): void {
    console.log('RetrospectivePage.watchRetro()');
    this.userService.userChanged
      // .pipe(filter(uid => !!uid))
      .subscribe((userID) => {
        console.log('RetrospectivePage.watchRetro() => userID:', userID);
        try {
          if (this.retroSub) {
            this.retroSub.unsubscribe();
          }
          if (!userID) {
            return;
          }
          const { id } = this.retrospective;
          if (id === RetrospectiveStage.upcoming) {
            return;
          }
          const spaceID = this.space.id;
          this.retroSub = this.retrospectiveService
            .watchRetro(spaceID, id)
            .pipe(takeUntil(this.destroyed$)) // TODO(StackOverflow): Do we need .asObservable() here?
            .subscribe({
              next: (retrospective) =>
                this.setRetro(spaceID, { id, dbo: retrospective }),
              error: (e) => this.logError(e, 'Failed to watch retrospective'),
            });
        } catch (e) {
          this.logError(e, 'Failed to watchTeam');
        }
      });
  }

  private setRetro(
    teamId: string,
    retrospective: IRecord<IRetrospective>,
  ): void {
    console.log('RetrospectivePage.setRetro()');
    try {
      if (
        this.retrospective?.id === retrospective.id &&
        this.space?.id === teamId
      ) {
        this.retrospective = retrospective;
      }
    } catch (e) {
      this.logError(e, 'Failed process new retrospective record');
    }
  }
}
