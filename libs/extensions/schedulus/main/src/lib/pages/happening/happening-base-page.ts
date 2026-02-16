import { computed, signal } from '@angular/core';
import { ISpaceRef } from '@sneat/core';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import {
  distinctUntilChanged,
  map,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { CalendarBasePage } from '../calendar-base-page';
import { HappeningComponentBaseParams } from '@sneat/extensions-schedulus-shared';

const emptyHappeningContext = { id: '', space: { id: '' } };

export abstract class HappeningBasePage extends CalendarBasePage {
  private readonly happeningID$ = new Subject<string>(); //TODO: switch to $happeningID signal?
  protected readonly $happening = signal<IHappeningContext>(
    emptyHappeningContext,
  );
  protected readonly $happeningID = computed<string | undefined>(
    () => this.$happening().id || undefined,
  );

  // private calendariumSpaceDbo?: ICalendariumSpaceDbo | null;
  private calendariumSpaceSub?: Subscription;

  protected constructor(
    protected readonly params: HappeningComponentBaseParams, // 	HappeningModuleSchema,
  ) {
    // 	typeof SingleHappeningKind | typeof RegularHappeningKind>,
    super();
    try {
      const happening = window.history.state
        .happening as unknown as IHappeningContext;
      if (happening) {
        this.happeningID$.next(happening.id);
        this.setHappening(happening, 'history.state');
        this.watchHappeningChanges(happening.id, happening.space);
      }
      this.trackHappeningIDFromUrl();
    } catch (e) {
      console.error(
        `Failed in ${this.className}.HappeningBasePage.constructor()`,
        e,
      );
    }
    this.spaceChanged$.subscribe({
      next: (space) => {
        const happening = this.$happening();
        if (space && happening) {
          this.setHappening({ ...happening, space: space }, 'spaceChanged$');
        } else if (!space) {
          this.$happening.set(emptyHappeningContext);
        }
      },
    });
  }

  protected override onSpaceIdChanged(): void {
    super.onSpaceIdChanged();
    this.calendariumSpaceSub?.unsubscribe();
    this.calendariumSpaceSub = this.params.calendariumSpaceService
      .watchSpaceModuleRecord(this.space.id)
      .subscribe({
        next: (calendariumSpace) => {
          const happening = this.$happening();
          if (
            happening?.id &&
            !happening?.dbo // If we loaded happening record we use it as a brief and ignore the brief from calendariumSpace
          ) {
            const brief =
              calendariumSpace.dbo?.recurringHappenings?.[happening?.id];
            if (brief) {
              this.setHappening(
                { ...happening, brief },
                'calendariumSpaceDbo changed',
              );
            }
          }
        },
      });
  }

  protected readonly setHappening = (
    happening: IHappeningContext,
    from: string,
  ): void => {
    const prevHappening = this.$happening();
    if (!happening.dbo && prevHappening.brief) {
      happening = { ...happening, brief: prevHappening.brief };
    }
    if (!this.$spaceID() && happening.space) {
      this.setSpaceRef(happening.space); // we probably should never hit this case
    }
    this.$happening.set(happening);
  };

  private readonly onHappeningIDChanged = (id?: string): void => {
    if (!id) {
      this.$happening.set(emptyHappeningContext);
      return;
    }
    if (this.$happeningID() === id) {
      return;
    }
    const space = this.space;
    if (!space) {
      console.error('Space is not defined');
    }
    this.setHappening({ id, space }, 'url');
    this.watchHappeningChanges(id);
  };

  private watchHappeningChanges(id: string, space?: ISpaceRef): void {
    if (!space) {
      space = this.space;
    }
    if (!space?.id) {
      console.warn('watchHappeningChanges: space is not defined');
      return;
    }
    try {
      this.params.happeningService
        .watchHappeningByID(space, id)
        .pipe(this.takeUntilDestroyed(), takeUntil(this.happeningID$))
        .subscribe({
          next: (happening) => {
            // This can be called twice - first for `snapshot.type=added`, then `snapshot.type=modified`
              'watchHappeningChanges() => happeningService.watchHappeningByID() => happening:',
              happening,
            );
            if (happening.id === this.$happeningID()) {
              this.setHappening(
                happening,
                'watchHappeningChanges() => watchHappeningByID',
              );
            }
          },
          error: this.logErrorHandler('failed to get happening by ID'),
        });
    } catch (e) {
      console.error(
        `Failed in ${this.className}.watchHappeningChanges(id=${id})`,
        e,
      );
    }
  }

  private trackHappeningIDFromUrl(): void {
    this.route?.params
      .pipe(
        this.takeUntilDestroyed(),
        map((params) => params['happeningID']),
        distinctUntilChanged(),
      )
      .subscribe({
        next: (happeningID) => {
          if (this.$happeningID() !== happeningID) {
            this.$happening.set({
              id: happeningID,
              space: this.$space(),
            });
            this.happeningID$.next(happeningID);
          }
        },
      });
    this.happeningID$
      .pipe(this.takeUntilDestroyed(), distinctUntilChanged())
      .subscribe({
        next: (happeningID) => {
          this.onHappeningIDChanged(happeningID);
        },
      });
  }
}
