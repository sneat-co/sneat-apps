import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  inject,
} from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonThumbnail,
  IonToolbar,
} from '@ionic/angular/standalone';
import { listItemAnimations } from '@sneat/core';
import { IMovie, IMovieDbo } from '../dto';
import { IListContext } from '../contexts';
import { ISpaceContext } from '@sneat/space-models';
import { ListusComponentBaseParams } from '../listus-component-base-params';
import { ITmdbService } from '../watchlist';

@Component({
  selector: 'sneat-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  animations: [listItemAnimations],
  imports: [
    NgOptimizedImage,
    IonCard,
    IonCardHeader,
    IonToolbar,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonThumbnail,
    IonItem,
    IonLabel,
    IonInput,
    IonBadge,
    IonCardContent,
    IonText,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent {
  private readonly param = inject(ListusComponentBaseParams);
  private readonly tmdbService = inject(ITmdbService);

  public readonly movie = input<IMovie>();
  public readonly showWatchedMovies = input(false);
  public readonly space = input<ISpaceContext>();
  public readonly list = input<IListContext>();
  readonly addToWatchlist = output<IMovie>();
  readonly goMovie = output<IMovie>();
  readonly movieChanged = output<IMovieDbo>();
  public readonly listChanged = output<IListContext>();

  constructor() {
    effect(() => {
      if (this.movie()) {
        console.error('not implemented yet');
        // this.movieService.getById(this.movie.id)
        // 	.subscribe(
        // 		movie => {
        // 			console.log('movie-card-movie', movie);
        //
        // 			if (movie) {
        // 				this.movie = movie;
        // 			}
        // 		},
        // 		this.errorLogger.logError,
        // 	);
      }
    });
  }

  get userId(): string | undefined {
    return this.param.spaceParams.userService.currentUserID;
  }

  public get isWatched(): boolean {
    console.warn('isWatched is not implemented yet');
    return false;
    // return this.listusDbService.isWatched(this.movie, this.userId);
  }

  public removeFromWatchlist(movie?: IMovie): void {
    console.error(
      'MovieCardComponent.removeFromWatchlist() - not implemented yet',
      movie,
    );
    // this.listService.deleteListItem(this.createListItemCommandParams(movie))
    // 	.subscribe(
    // 		listDto => {
    // 			console.log('MovieCardComponent => movie deleted');
    // 			this.listChanged.emit(listDto);
    // 		},
    // 	);
  }

  public markAsWatched(event: Event): void {
    console.error('markAsWatched() - not implemented yet');
    event.preventDefault();
    event.stopPropagation();
    // this.listusDbService.setIsWatched(this.movie, this.userId, !this.isWatched)
    // 	.subscribe(
    // 		{
    // 			next: movieDto => {
    // 				this.movie = movieDto;
    // 			},
    // 			error: this.errorLogger.logError,
    // 		},
    // 	);
  }

  public emitGoMovie(): void {
    // console.log('MovieCardComponent.emitGoMovie()', this.movie);
    const movie = this.movie();
    if (movie) {
      this.goMovie.emit(movie);
    }
  }

  public emitAddToWatchlist(): void {
    // console.log('MovieCardComponent.addToWatchlist()', this.movie);
    this.addToWatchlist.emit(this.movie() as IMovie);
  }

  public checkMovieId(): boolean {
    return false; //!!this.movie?.id;
  }

  // private createListItemCommandParams(movie: IMovie): IListItemCommandParams {
  // 	return {
  // 		commune: this.commune,
  // 		list: { dto: this.list, shortId: this.shortListId },
  // 		items: [movie],
  // 	};
  // }
}
