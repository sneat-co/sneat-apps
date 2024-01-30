import { Component } from '@angular/core';
import { IMovie } from '../../../../models/movie-models';
import { IListService } from '../../services/interfaces';
import { CommuneBasePage } from '../../../../pages/commune-base-page';
import { CommuneBasePageParams } from '../../../../services/params';
import { TmdbService } from '../../watchlist/tmdb.service';
import { IListItemInfo } from '../../../../models/dto/dto-list';
import { ListusDbService } from '../../services/listus-db.service';
import { BaseListPage } from '../base-list-page';

@Component({
	selector: 'sneat-add-to-watch-page',
	templateUrl: './add-to-watch-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AddToWatchPageComponent
	extends BaseListPage
	implements CommuneBasePage
{
	listItems?: IListItemInfo[];
	searchText = '';
	movies: IMovie[];
	public showWatched = true;

	// public segment: 'list' | 'cards' | 'recipe' | 'settings' = 'list';

	constructor(
		private readonly tmdbService: TmdbService,
		private readonly listusDbService: ListusDbService,
		private readonly ts: TmdbService,
		readonly params: CommuneBasePageParams,
		readonly listService: IListService,
	) {
		super('id', 'lists', params, listService);
	}

	public clickShowWatchedMovies(): void {
		this.showWatched = !this.showWatched;
		console.log(this.showWatched);
	}

	// searchChanged(event: CustomEvent) {
	// 	if (!this.searchText) {
	// 		this.movies = [];
	// 	}
	// 	// this.tmdbService.search(this.searchText);
	// }

	find(): void {
		console.log('yes');
		const result = this.ts.searchMovies(this.searchText);
		result.subscribe((movies) => {
			movies.forEach((movie) => {
				movie.idTmdb = movie.id;
				delete movie.id;
				console.log('add-to-watch-page: film', movie);
			});
			this.movies = movies;
			console.log('movies1', movies);
		});
	}

	addListItem(movie: IMovie): void {
		if (!movie) {
			throw new Error('Missing required parameter item');
		}
		console.log(
			`AddToWatchPage.addListItem(item={id:${movie.id}, title: ${movie.title})`,
			'this.shortListId',
			this.shortListId,
			'this.listDto',
			this.listDto,
		);
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		if (!this.listDto) {
			throw new Error('!this.listDto');
		}
		this.listusDbService
			.addListItem({
				commune: this.commune,
				list: { dto: this.listDto, shortId: this.shortListId },
				items: [movie],
			})
			.subscribe({
				next: (result) => {
					console.log('ListPage.addListItem => result', result);
					// if (result.success) {
					//     (this.newListItem as NewListItem).clear();
					// } else if (result.message) {
					//     this.showToast({color: "danger", message: result.message});
					// }
					// if (!this.communeRealId && result.communeDto) {
					//     this.setPageCommuneIds('materializeVirtualCommune', {
					//         short: this.communeShortId,
					//         real: result.communeDto.id
					//     }, result.communeDto);
					// }
					this.listItems = result.listDto.items;
				},
				error: this.errorLogger.logErrorHandler('Failed to add item to list'),
			});
	}
}
