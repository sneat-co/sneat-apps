import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { listItemAnimations } from '@sneat/core';
import { IMovie, IMovieDto } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { ListusComponentBaseParams } from '../listus-component-base-params';
import { ITmdbService } from '../watchlist/interfaces';

@Component({
	selector: 'sneat-movie-card',
	templateUrl: './movie-card.component.html',
	styleUrls: ['./movie-card.component.scss'],
	animations: [listItemAnimations],
})
export class MovieCardComponent implements OnChanges {

	@Input()
	public movie?: IMovie;
	@Input()
	public showWatchedMovies = false;
	@Input() public team?: ITeamContext;
	@Input() public list?: IListContext;
	@Output() addToWatchlist = new EventEmitter<IMovie>();
	@Output() goMovie = new EventEmitter<IMovie>();
	@Output() movieChanged = new EventEmitter<IMovieDto>();
	@Output() public readonly listChanged = new EventEmitter<IListContext>();

	constructor(
		private readonly param: ListusComponentBaseParams,
		private readonly tmdbService: ITmdbService,
	) {
	}

	get userId(): string | undefined {
		return this.param.teamParams.userService.currentUserId;
	}

	public get isWatched(): boolean {
		console.warn('isWatched is not implemented yet')
		return false;
		// return this.listusDbService.isWatched(this.movie, this.userId);
	}

	ngOnChanges(changes: SimpleChanges): void {
		const mode = changes['mode'];
		if (mode && !mode.currentValue) {
			throw new Error('mode is required');
		}
		if (changes['movie'] && this.movie && this.movie.id) {
			console.error('not implemented yet')
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
		console.error('MovieCardComponent.removeFromWatchlist() - not implemented yet', movie);
		// this.listService.deleteListItem(this.createListItemCommandParams(movie))
		// 	.subscribe(
		// 		listDto => {
		// 			console.log('MovieCardComponent => movie deleted');
		// 			this.listChanged.emit(listDto);
		// 		},
		// 	);
	}

	public markAsWatched(event: Event): void {
		console.error('markAsWatched() - not implemented yet',);
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
		return !!this.movie?.id;
	}

	// private createListItemCommandParams(movie: IMovie): IListItemCommandParams {
	// 	return {
	// 		commune: this.commune,
	// 		list: { dto: this.list, shortId: this.shortListId },
	// 		items: [movie],
	// 	};
	// }
}




