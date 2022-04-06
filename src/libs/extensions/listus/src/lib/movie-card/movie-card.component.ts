import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IMovie} from '../../../models/movie-models';
import {IMovieDto} from '../../../models/dto/dto-movie';
import {AuthStateService} from '../../../services/auth-state.service';
import {IListDto} from '../../../models/dto/dto-list';
import {IListItemCommandParams, IListusService} from '../services/interfaces';
import {Commune} from '../../../models/ui/ui-models';
import {listItemAnimations} from '../../../animations/list-animations';
import {IMovieService, ITmdbService} from '../watchlist/interfaces';
import {IErrorLogger} from '../../../services/interfaces';

@Component({
	selector: 'sneat-movie-card',
	templateUrl: './movie-card.component.html',
	styleUrls: ['./movie-card.component.scss'],
	animations: [listItemAnimations],
})
export class MovieCardComponent implements OnChanges {

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly movieService: IMovieService,
		private readonly listusDbService: IListusService,
		private readonly authStateService: AuthStateService,
		private readonly tmdbService: ITmdbService,
		private readonly listusService: IListusService,
	) {
	}

	get userId(): string {
		return this.authStateService.authState.currentUserId || '123';
	}

	@Input()
	public movie: IMovie;

	@Input()
	public showWatchedMovies: boolean;

	@Input() public commune: Commune;

	@Input() public shortListId: string;

	@Input() public listDto: IListDto;

	@Output() addToWatchlist = new EventEmitter<IMovie>();

	@Output() goMovie = new EventEmitter<IMovie>();

	@Output() movieChanged = new EventEmitter<IMovieDto>();

	@Output() public readonly listChanged = new EventEmitter<IListDto>();

	ngOnChanges(changes: SimpleChanges): void {
		const mode = changes.mode;
		if (mode && !mode.currentValue) {
			throw new Error('mode is required');
		}
		if (changes.movie && this.movie && this.movie.id) {
			this.movieService.getById(this.movie.id)
				.subscribe(
					movie => {
						console.log('movie-card-movie', movie);

						if (movie) {
							this.movie = movie;
						}
					},
					this.errorLogger.logError,
				);
		}
	}

	public get isWatched(): boolean {
		return this.listusDbService.isWatched(this.movie, this.userId);
	}

	private createListItemCommandParams(movie: IMovie): IListItemCommandParams {
		return {
			commune: this.commune,
			list: {dto: this.listDto, shortId: this.shortListId},
			items: [movie],
		};
	}

	public removeFromWatchlist(movie: IMovie): void {
		console.log('MovieCardComponent.removeFromWatchlist()', movie);
		this.listusService.deleteListItem(this.createListItemCommandParams(movie))
			.subscribe(
				listDto => {
					console.log('MovieCardComponent => movie deleted');
					this.listChanged.emit(listDto);
				},
			);
	}

	public markAsWatched(event: Event): void {
		console.log('userId', this.userId);
		event.preventDefault();
		event.stopPropagation();
		this.listusDbService.setIsWatched(this.movie, this.userId, !this.isWatched)
			.subscribe(
				{
					next: movieDto => {
						this.movie = movieDto;
					},
					error: this.errorLogger.logError,
				},
			);
	}

	public emitGoMovie(movie: IMovie): void {
		console.log('MovieCardComponent.emitGoMovie()', movie);
		this.goMovie.emit(movie);
	}

	public emitAddToWatchlist(): void {
		console.log('MovieCardComponent.addToWatchlist()', this.movie);
		this.addToWatchlist.emit(this.movie);
	}

	public checkMovieId(): boolean {
		return !!this.movie.id;
	}
}




