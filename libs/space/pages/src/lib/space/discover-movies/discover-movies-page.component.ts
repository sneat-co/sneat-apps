import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParamMap } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import {
  LISTUS_SERVICE,
  ListType,
  MovieSummary,
} from '@sneat/extension-listus-contract';
import {
  SpaceComponentBaseParams,
  SpacePageBaseComponent,
} from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { DiscoverMoviesService } from './discover-movies.service';
import {
  getWatchlistTmdbIDs,
  withAddedID,
  withRemovedID,
} from './discover-movies.utils';

// Discover screen for the movie To-Watch list: the user types a vague
// description of a half-remembered movie ("that movie about a chef who…") and
// gets up to 10 TMDB-enriched candidates back (POST listus/movies/identify —
// AI title guesses grounded via TMDB search; degrades server-side to a plain
// TMDB keyword search when no AI key is configured). Each candidate has an
// "Add" action that reuses the same addMovieToWatchlist call as the
// add-to-watch page in @sneat/extension-listus-shared.
//
// Flow: entered from the space page's Extensions ▸ Lists row (and by direct
// URL `list/watch/movies/discover`); Back returns to the watch list page;
// after an add the user stays here (multi-add) — the candidate is marked as
// added and a toast offers "View list".
@Component({
  selector: 'sneat-discover-movies-page',
  templateUrl: './discover-movies-page.component.html',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonIcon,
    IonList,
    IonSpinner,
    IonText,
  ],
  providers: [
    { provide: ClassName, useValue: 'DiscoverMoviesPageComponent' },
    SpaceComponentBaseParams,
    DiscoverMoviesService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverMoviesPageComponent extends SpacePageBaseComponent {
  private readonly discoverMoviesService = inject(DiscoverMoviesService);
  private readonly listusService = inject(LISTUS_SERVICE);
  private readonly toastCtrl = inject(ToastController);

  protected readonly $listType = signal<ListType>('watch');
  protected readonly $listID = signal('movies');

  protected readonly $description = signal('');
  protected readonly $isIdentifying = signal(false);
  protected readonly $identifyError = signal<string | undefined>(undefined);
  protected readonly $candidates = signal<MovieSummary[] | undefined>(
    undefined,
  );

  // TMDB ids already on the watch list — loaded once per space+list so
  // candidates the user already bookmarked render as "On the list".
  protected readonly $watchlistTmdbIDs = signal<ReadonlySet<number>>(new Set());
  protected readonly $addingTmdbIDs = signal<ReadonlySet<number>>(new Set());
  protected readonly $addedTmdbIDs = signal<ReadonlySet<number>>(new Set());

  // The identify endpoint returns compact MovieSummary rows (no overview), so
  // the overview is lazy-loaded per candidate on expand via the existing
  // LISTUS_SERVICE.resolveMovie() TMDB proxy.
  protected readonly $expandedTmdbID = signal<number | undefined>(undefined);
  protected readonly $overviewByTmdbID = signal<
    ReadonlyMap<number, string | undefined>
  >(new Map());
  protected readonly $loadingOverviewIDs = signal<ReadonlySet<number>>(
    new Set(),
  );

  private watchlistLoadedFor?: string;

  constructor() {
    super();
    this.spaceIDChanged$
      .pipe(this.takeUntilDestroyed())
      .subscribe(() => this.loadWatchlistIDs());
  }

  protected override onRouteParamsChanged(params: ParamMap): void {
    super.onRouteParamsChanged(params);
    const listType = params.get('listType') as ListType | null;
    const listID = params.get('listID');
    if (listType) {
      this.$listType.set(listType);
    }
    if (listID) {
      this.$listID.set(listID);
    }
    this.$defaultBackUrlSpacePath.set(
      `list/${this.$listType()}/${this.$listID()}`,
    );
    this.loadWatchlistIDs();
  }

  // Best-effort: the Discover flow must keep working even if this read fails
  // (e.g. the list does not exist yet — it is auto-created on first add), so
  // errors are logged but never surfaced as a blocking error state.
  private loadWatchlistIDs(): void {
    const spaceID = this.space?.id;
    if (!spaceID) {
      return;
    }
    const key = `${spaceID}/${this.$listType()}/${this.$listID()}`;
    if (this.watchlistLoadedFor === key) {
      return;
    }
    this.watchlistLoadedFor = key;
    this.listusService
      .getListById(this.space, this.$listType(), this.$listID())
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (list) => {
          this.$watchlistTmdbIDs.set(getWatchlistTmdbIDs(list.dbo));
        },
        error: (err) => {
          this.watchlistLoadedFor = undefined;
          this.logError(err, 'Failed to load current watchlist', {
            show: false,
          });
        },
      });
  }

  protected identify(): void {
    const description = this.$description().trim();
    if (!description || this.$isIdentifying()) {
      return;
    }
    this.$isIdentifying.set(true);
    this.$identifyError.set(undefined);
    this.$expandedTmdbID.set(undefined);
    this.discoverMoviesService
      .identifyMovies({ description })
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.$candidates.set(response.movies || []);
          this.$isIdentifying.set(false);
        },
        error: (err) => {
          this.errorLogger.logError(err, 'Failed to identify movies');
          this.$identifyError.set(
            'Failed to find matching movies. Please try again.',
          );
          this.$isIdentifying.set(false);
        },
      });
  }

  protected isOnWatchlist(movie: MovieSummary): boolean {
    return (
      this.$watchlistTmdbIDs().has(movie.tmdbID) ||
      this.$addedTmdbIDs().has(movie.tmdbID)
    );
  }

  protected isAdding(movie: MovieSummary): boolean {
    return this.$addingTmdbIDs().has(movie.tmdbID);
  }

  protected toggleDetails(movie: MovieSummary): void {
    const tmdbID = movie.tmdbID;
    if (this.$expandedTmdbID() === tmdbID) {
      this.$expandedTmdbID.set(undefined);
      return;
    }
    this.$expandedTmdbID.set(tmdbID);
    if (
      this.$overviewByTmdbID().has(tmdbID) ||
      this.$loadingOverviewIDs().has(tmdbID)
    ) {
      return;
    }
    this.$loadingOverviewIDs.update((ids) => withAddedID(ids, tmdbID));
    this.listusService
      .resolveMovie({ tmdbID })
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.$loadingOverviewIDs.update((ids) => withRemovedID(ids, tmdbID));
          this.$overviewByTmdbID.update((overviews) => {
            const next = new Map(overviews);
            next.set(tmdbID, response.movie?.overview);
            return next;
          });
        },
        error: (err) => {
          this.$loadingOverviewIDs.update((ids) => withRemovedID(ids, tmdbID));
          // Non-blocking: the candidate row still shows title/year/poster.
          this.logError(err, 'Failed to load movie overview', { show: false });
        },
      });
  }

  protected addToWatchlist(event: Event, movie: MovieSummary): void {
    event.stopPropagation();
    const spaceID = this.space?.id;
    if (!spaceID || this.isAdding(movie) || this.isOnWatchlist(movie)) {
      return;
    }
    this.$addingTmdbIDs.update((ids) => withAddedID(ids, movie.tmdbID));
    this.listusService
      .addMovieToWatchlist({ spaceID, tmdbID: movie.tmdbID })
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.$addingTmdbIDs.update((ids) => withRemovedID(ids, movie.tmdbID));
          this.$addedTmdbIDs.update((ids) => withAddedID(ids, movie.tmdbID));
          this.showAddedToast(movie);
        },
        error: (err) => {
          this.$addingTmdbIDs.update((ids) => withRemovedID(ids, movie.tmdbID));
          this.errorLogger.logError(err, 'Failed to add movie to watchlist');
          this.showErrorToast(
            `Failed to add "${movie.title}" to the watchlist. Please try again.`,
          );
        },
      });
  }

  protected goWatchlist(): void {
    this.spaceNav
      .navigateForwardToSpacePage(
        this.space,
        `list/${this.$listType()}/${this.$listID()}`,
      )
      .catch(
        this.errorLogger.logErrorHandler('Failed to navigate to watchlist'),
      );
  }

  private showAddedToast(movie: MovieSummary): void {
    this.toastCtrl
      .create({
        message: `"${movie.title}" added to the To-Watch list`,
        duration: 3000,
        color: 'success',
        buttons: [
          { text: 'View list', handler: () => this.goWatchlist() },
          { role: 'cancel', text: 'OK' },
        ],
      })
      .then((toast) => toast.present())
      .catch(this.errorLogger.logErrorHandler('Failed to present toast'));
  }

  private showErrorToast(message: string): void {
    this.toastCtrl
      .create({
        message,
        duration: 2500,
        color: 'danger',
        buttons: [{ role: 'cancel', text: 'OK' }],
      })
      .then((toast) => toast.present())
      .catch(this.errorLogger.logErrorHandler('Failed to present toast'));
  }
}
