import { NgOptimizedImage } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
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
})
export class MovieCardComponent implements OnChanges {
	private readonly param = inject(ListusComponentBaseParams);
	private readonly tmdbService = inject(ITmdbService);

	@Input()
	public movie?: IMovie;
	@Input()
	public showWatchedMovies = false;
	@Input() public space?: ISpaceContext;
	@Input() public list?: IListContext;
	@Output() addToWatchlist = new EventEmitter<IMovie>();
	@Output() goMovie = new EventEmitter<IMovie>();
	@Output() movieChanged = new EventEmitter<IMovieDbo>();
	@Output() public readonly listChanged = new EventEmitter<IListContext>();

	get userId(): string | undefined {
		return this.param.spaceParams.userService.currentUserID;
	}

	public get isWatched(): boolean {
		console.warn('isWatched is not implemented yet');
		return false;
		// return this.listusDbService.isWatched(this.movie, this.userId);
	}

	ngOnChanges(changes: SimpleChanges): void {
		const mode = changes['mode'];
		if (mode && !mode.currentValue) {
			throw new Error('mode is required');
		}
		if (changes['movie'] && this.movie) {
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
		console.log('MovieCardComponent.emitGoMovie()', this.movie);
		if (this.movie) {
			this.goMovie.emit(this.movie);
		}
	}

	public emitAddToWatchlist(): void {
		console.log('MovieCardComponent.addToWatchlist()', this.movie);
		this.addToWatchlist.emit(this.movie);
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
