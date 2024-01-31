import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
	TeamComponentBaseParams,
	TeamPageBaseComponent,
} from '@sneat/team-components';
import { IListItemBrief, IMovie } from '../../dto';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
// import { IMovie } from '../../../../models/movie-models';
// import { CommuneBasePageParams } from '../../../../services/params';
// import { CommuneBasePage } from '../../../../pages/commune-base-page';
// import { BaseListItemPage } from '../base-list-item-page';
// import { IListItemInfo } from '../../../../models/dto/dto-list';
import {
	IListItemsCommandParams,
	ListService,
	// ListusService,
} from '../../services';
import { ITmdbService } from '../../watchlist';
import { BaseListItemPage } from '../base-list-item-page';

@Component({
	selector: 'sneat-movie-info',
	templateUrl: './movie-info-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class MovieInfoPageComponent
	extends BaseListItemPage
	implements TeamPageBaseComponent
{
	movie: IMovie | undefined;

	// listDto: IListDto;

	constructor(
		params: ListusComponentBaseParams,
		listService: ListService,
		route: ActivatedRoute,
		public navCtrl: NavController,
		private readonly tmdbService: ITmdbService,
		// private readonly listusDbService: ListusService,
		// private readonly listusService: ListusService,
		// public authStateService: AuthStateService,
	) {
		super('MovieInfoPageComponent', route, params);
	}

	get userId(): string {
		throw new Error('not implemented');
		// return this.authStateService.authState.currentUserId || '123';
	}

	protected override onQueryParamsChanged(queryParams: ParamMap): void {
		super.onQueryParamsChanged(queryParams);
		if (!this.itemId) {
			const movieIdTmdb = queryParams.get('idTmdb');
			if (movieIdTmdb) {
				this.tmdbService
					.loadMovieInfoById(movieIdTmdb)
					.subscribe((movieTmdb) => {
						this.onListItemInfoChanged(movieTmdb);
						console.log(movieTmdb);
					}, this.errorLogger.logError);
			}
		}
		console.log('movie', this.movie, 'id', this.movie && this.movie.id);
	}

	// protected onListInfoChanged(): void {
	// 	super.onListInfoChanged();
	// 	if (!this.listInfo) {
	// 		return;
	// 	}
	// 	const { id } = this.listInfo;
	// 	if (id && (!this.listDto || this.listDto.id !== id)) {
	// 		this.subscribeForListChanges(id);
	// 	}
	// }

	private createListItemCommandParams(): IListItemsCommandParams {
		if (!this.team) {
			throw new Error('!this.team');
		}
		if (!this.list?.dto) {
			throw new Error('!this.list.dto');
		}
		if (!this.movie) {
			throw new Error('!this.movie');
		}
		return {
			team: this.team,
			list: this.list,
			items: [this.movie],
		};
	}

	public isInWatchlist(): boolean {
		throw new Error('not implemented');
		// return !!this.listDto && !!this.movie && !!this.movie.id;
	}

	public removeFromWatchlist(): void {
		console.log('MovieCardComponent.removeFromWatchlist()', this.movie);
		/*
		this.listusService
			.deleteListItem(this.createListItemCommandParams())
			.subscribe((listDto) => {
				console.log('MovieCardComponent => movie deleted');
				this.setList(listDto);
			}, this.errorLogger.logError);
		 */
	}

	protected override onListItemInfoChanged(
		listItemInfo?: IListItemBrief,
	): void {
		super.onListItemInfoChanged(listItemInfo);
		console.log('MovieInfoPageComponent.onListItemInfoChanged', listItemInfo);
		this.movie = listItemInfo as IMovie;
	}

	public get isWatched(): boolean {
		throw new Error('not implemented');
		// return (
		// 	!!this.movie && this.listusDbService.isWatched(this.movie, this.userId)
		// );
	}

	public toggleIsWatched(): void {
		const { movie } = this;
		if (!movie) {
			throw new Error('!movie');
		}
		/*
		this.listusDbService
			.setIsWatched(movie, this.userId, !this.isWatched)
			.subscribe({
				next: (movieDto) => (this.movie = movieDto),
				error: (err) => {
					console.error(err);
				},
			});
		 */
	}

	addToWatchlist(movie: IMovie): void {
		if (!movie) {
			throw new Error('Missing required parameter movie');
		}
		/*
		if (!this.listDto) {
			throw new Error('!this.listDto');
		}
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		console.log(
			`AddToWatchPage.addListItem(item={id:${movie.id}, title: ${movie.title})`,
			'this.shortListId',
			this.shortListId,
			'this.listDto',
			this.listDto,
			'this.listInfo',
			this.listInfo,
		);
		this.listusDbService
			.addListItem({
				commune: this.commune,
				list: { dto: this.listDto, shortId: this.shortListId },
				items: [movie],
			})
			.subscribe({
				next: (result) => {
					console.log('ListPage.addListItem', result);
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to add item to list');
				},
			});
		 */
	}

	// private goToWatchList() {
	//   this.navCtrl.navigateForward('/movies');
	// }

	// deleteMovies(movie: IMovie) {
	//   this.moviesService.deleteMovie(movie);
	//   alert('movie deleted!');
	// }

	// public isInWatchlist(movie: IMovie): boolean {
	//   return this.moviesService.isInWatchlist(movie);
	// }

	// private getMovie(): IMovie {
	// 	this.route.queryParamMap.subscribe(param => {
	// 		const movieIdTmdb = Number(param.get('id-tmdb'));
	// 		const movieIdBase = Number(param.get('idBase'));
	// 		console.log(movieIdBase);
	// 		console.log(movieIdTmdb);
	// if (movieIdTmdb) {
	// this.tmdbService.loadMovieInfoById(movieIdTmdb).subscribe(movieTmdb => {
	// 		console.log(movieTmdb);
	// 		console.log(this.movie.idBase);
	// 		console.log(this.movie.idTmdb);
	// 		return movieTmdb;
	// 	});
	// } else {
	// this.movie = this.moviesService.getMovieById(movieIdBase);
	// console.log(this.movie);
	// console.log(this.movie.idBase);
	// console.log(this.movie.idTmdb);
	// 	return this.movie;
	// }
	// 	});
	// }

	// ngOnInit(): void {
	// 	this.route.queryParamMap.subscribe(param => {
	// 		const movieIdTmdb = Number(param.get('id-tmdb'));
	// 		const movieIdBase = Number(param.get('idBase'));
	// 		console.log(movieIdBase);
	// 		console.log(movieIdTmdb);
	// 		if (movieIdTmdb) {
	// 			this.tmdbService.loadMovieInfoById(movieIdTmdb).subscribe(movieTmdb => {
	// 				console.log(movieTmdb);
	// 				this.movie = movieTmdb;
	// 				this.movie.idTmdb = movieIdTmdb;
	// 				console.log(this.movie.idBase);
	// 				console.log(this.movie.idTmdb);
	// 				this.addListItem(this.movie);
	// 			});
	// 		} else {
	// 			// this.movie = this.moviesService.getMovieById(movieIdBase);
	// 			// console.log(this.movie);
	// 			// console.log(this.movie.idBase);
	// 			// console.log(this.movie.idTmdb);
	// 		}
	// 		// if (film.id === undefined) {
	// 		//     film = this.moviesService.getMoviesById(Number(param.get('idTmdb')));
	// 		// }
	// 	});
	// }
}
