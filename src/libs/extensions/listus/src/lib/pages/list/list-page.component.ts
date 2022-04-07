import { Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IListInfo, IListItemBrief, IMovie, ListItemInfoModel, ListType } from '@sneat/dto';
import { IListContext } from '@sneat/team/models';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
import { ListService } from '../../services/list.service';
import { IListusAppStateService } from '../../services/listus-app-state.service';
import { BaseListPage } from '../base-list-page';
import { ListDialogsService } from '../dialogs/ListDialogs.service';
import { NewListItemComponent } from './new-list-item.component';

@Component({
	selector: 'sneat-list',
	templateUrl: './list-page.component.html',
	styleUrls: ['./list-page.component.scss'],
	providers: [ListusComponentBaseParams],
})
export class ListPageComponent extends BaseListPage {

	public isPersisting = false;
	public segment: 'list' | 'cards' | 'recipes' | 'settings' | 'discover' = 'list';
	public reordering = false;
	public listItems?: IListItemBrief[];
	public listType?: ListType;
	public isHideWatched = false;
	// tslint:disable-next-line:no-any
	@ViewChild('newListItem', { static: false }) newListItem: any;
	trackById = ListItemInfoModel.trackBy;

	constructor(
		route: ActivatedRoute,
		params: ListusComponentBaseParams,
		private readonly zone: NgZone,
		private readonly toastCtrl: ToastController,
		// private readonly listusService: IListusService,
		listService: ListService,
		// private readonly listItemService: IListItemService,
		private readonly listDialogs: ListDialogsService,
		// private readonly shelfService: ShelfService,
		private readonly listusAppStateService: IListusAppStateService,
		// private readonly listusDbService: IListusService,
	) {
		super('ListPage', route, params);
		console.log('ListPage.constructor(), userId:', this.currentUserId);
		this.preloader.markAsPreloaded('list');
		if (location.pathname.indexOf('/lists') >= 0) { // TODO: document why & how it is possible
			return;
		}
		listusAppStateService.changed.subscribe(appState => {
			this.isHideWatched = !appState.showWatched;
		});
	}

	// ngOnInit(): void {
	// 	super.ngOnInit();
	// 	const { pathname } = location;
	// 	if (pathname.indexOf('/lists') >= 0) {
	// 		return;
	// 	}
	// 	if (pathname.indexOf('/recipes') >= 0) {
	// 		this.segment = 'cards';
	// 		this.listType = 'recipe';
	// 	} else if (pathname.indexOf('/to-watch') >= 0) {
	// 		this.segment = 'cards';
	// 		this.listType = 'watch';
	// 	}
	// 	this.preloader.preload(['lists']);
	// }

	public clickShowWatchedMovies(): void {
		this.listusAppStateService.setShowWatched(this.isHideWatched);
	}

	public override setList(list: IListContext): void {
		if (this.reordering) {
			return;
		}
		super.setList(list);
		this.listItems = list.dto === undefined ? undefined
			: list.dto?.items ? [...list.dto.items] : [];
	}

	public isWatched(movie: IMovie, userId: string): boolean {
		console.log(movie, 'userId', userId);
		console.warn('isWatched is not implemented yet');
		return false;
		//return this.listusDbService.isWatched(movie, userId);
	}


	public removeIsWatchedFromWatchlist(movies?: IListItemBrief[]): void {
		this.errorLogger.logError('removeIsWatchedFromWatchlist is not implemented yet');
		// 	console.log('remove');
		// 	movies.forEach(movie => {
		// 		// console.log(movie.watchedByUserIds);
		// 		if (this.isWatched(movie, this.userId)) {
		// 			console.log('remove movie');
		// 			this.listusService.deleteListItem(this.createListItemCommandParams(movie))
		// 				.subscribe(
		// 					listDto => {
		// 						this.setList(listDto);
		// 					},
		// 					this.errorLogger.logError,
		// 				);
		// 		}
		// 	});
	}

	goListItem(item: IListItemBrief): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		if (!this.team) {
			return;
		}
		if (item.subListId) {
			const path = item.subListType === 'recipes' ? 'recipe' : 'list';
			this.teamNav.navigateForwardToTeamPage(this.team, path, {
				state: { list: this.list, listItem: item },
			}).catch(this.errorLogger.logError);
		}
	}

	reorder(e: Event): void {
		const event = e as CustomEvent<{ from: number; to: number; complete: (list: boolean | IListItemBrief[]) => IListItemBrief[] }>;
		if (this.list?.dto?.items) { // temp mock
			event.detail.complete(this.list?.dto?.items);
		}
		console.error(`ListPage.reorder(from=${event.detail.from}, to=${event.detail.to})`);
		// this.listService.reorderListItems(
		// 	this.createListItemCommandParams(undefined),
		// 	listDto => {
		// 		console.log('ListPage.reorder() => event.detail.complete()');
		// 		if (!listDto.items) {
		// 			throw new Error('!listDto.items');
		// 		}
		// 		event.detail.complete(listDto.items);
		// 	},
		// )
		// 	.subscribe({
		// 		next: listDto => {
		// 			this.listDto = listDto;
		// 			this.listInfo = createListInfoFromDto(listDto, this.shortListId);
		// 			if (!listDto.items) {
		// 				throw new Error('!listDto.items');
		// 			}
		// 			this.listItems = listDto.items;
		// 			console.log('ListPage.reorder() => completed');
		// 		},
		// 		error: err => {
		// 			event.detail.complete(false);
		// 			this.errorLogger.logError(err);
		// 		},
		// 	});
	}

	newItem(): void {
		if (!this.list) {
			throw new Error('!this.listItems');
		}
		switch (this.list?.brief?.type) {
			case 'to-buy':
				break;
			case 'to-cook':
				break;
			case 'to-do':
				break;
			case 'other':
				break;
			case 'recipes':
				break;
			case 'rsvp':
				break;
			case 'to-watch':
				this.errorLogger.logError('Not implemented yet');
				// this.teamNav.navigateForwardToTeamPage(
				// 	'list/add-to-watch',
				// 	{
				// 		list: this.listId,
				// 	},
				// 	{
				// 		listInfo: this.listInfo,
				// 		listDto: this.listDto,
				// 	},
				// 	{
				// 		excludeCommuneId: true,
				// 	},
				// );
				break;
			default:
				this.focusAddInput();
				break;
		}
	}

	focusAddInput(): void {
		(this.newListItem as NewListItemComponent).focus();
	}

	addMovieToWatchlist(movie: IMovie): void {
		console.log('ListPage.addMovieToWatchlist', movie, this.list, this.team);
		if (!movie) {
			throw new Error('movie is a required parameter');
		}
		if (!this.team) {
			throw new Error('no team context');
		}
		const item: IListItemBrief = movie;
		this.isPersisting = true;
		if (!this.list) {
			throw new Error('no list context');
		}
		this.listService.createListItems({
			team: this.team,
			list: this.list,
			items: [item],
		})
			.subscribe({
				next: result => {
					console.log('ListPage.addListItem', result);
					if (result.success) {
						(this.newListItem as NewListItemComponent).clear();
					} else if (result.message) {
						this.showToast({ color: 'danger', message: result.message });
					}

					// if (!this.communeRealId && result.communeDto) {
					// 	this.setPageCommuneIds(
					// 		'addMovieToWatchlist',
					// 		{
					// 			short: this.communeShortId,
					// 			real: result.communeDto.id,
					// 		},
					// 		result.communeDto,
					// 	);
					// }
					this.listItems = result.listDto.items;
					this.isPersisting = false;
					setTimeout(
						() => {
							this.focusAddInput();
						},
						// tslint:disable-next-line:no-magic-numbers
						100);
				},
				error: err => {
					this.errorLogger.logError(err, 'Failed to add item to list');
					this.isPersisting = false;
				},
			});
	}

	public openCopyListItemsDialog(listItem?: IListItemBrief, event?: Event): void {
		console.log(`openCopyListItemsDialog()`, listItem);
		if (event) {
			event.stopPropagation();
		}

		let list: IListInfo | undefined;
		let listItems: IListItemBrief[] = [];

		if (listItem) {
			this.errorLogger.logError('not implemented yet');
			// list = {
			// 	type: listItem.subListType || 'other',
			// 	id: listItem.subListId || '',
			// 	title: listItem.title || 'no title - to be fixed',
			// };
		} else if (this.list && this.listItems) {
			// list = ...;
			listItems = this.listItems as IListItemBrief[];
			this.errorLogger.logError('not implemented yet');
			return;
		}
		if (list) {
			this.listDialogs.copyListItems(listItems, list)
				.catch(this.errorLogger.logError);
		}
	}

	public goGroceries(): void {
		if (!this.team) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.errorLogger.logError('not implemented yet');
		// this.teamNav.navigateForwardToTeamPage(this.team,
		// 	`list/${this.list?.id}`, {
		// 		state: { list: this.list },
		// 	});
	}

	// protected onListInfoChanged(): void {
	// 	super.onListInfoChanged();
	// 	if (this.listInfo) {
	// 		if (this.listInfo.id) {
	// 			if (!this.listItems && this.listInfo.itemsCount) {
	// 				this.listItems = [];
	// 				for (let i = 0; i < this.listInfo.itemsCount; i += 1) {
	// 					this.listItems.push(undefined);
	// 				}
	// 			}
	// 			const list$ = this.shelfService.pop('list$') as Observable<IListDto>;
	// 			console.log('list$:', list$);
	// 			if (list$) {
	// 				this.processList$(this.listInfo.id, list$);
	// 			} else {
	// 				this.subscribeForListChanges(this.listInfo.id);
	// 			}
	// 		} else {
	// 			this.shortListId = this.listInfo.shortId;
	// 			if (this.shortCommuneInfo && !this.listInfo.id) {
	// 				this.createVirtualListItems(this.shortCommuneInfo);
	// 			}
	// 		}
	// 	}
	// }

	protected showToast(opts: { message: string; duration?: number; color?: string }): void {
		const worker = async () => {
			const toast = await this.toastCtrl.create({
				...opts,
				// tslint:disable-next-line:no-magic-numbers
				duration: opts.duration || 2000,
				buttons: [{ role: 'cancel', text: 'OK' }],
			});
			await toast.present();
		};
		worker()
			.catch(err => {
					this.errorLogger.logError(err, 'Failed to display toast');
				},
			);
	}

	// protected setDefaultBackUrl(page?: DefaultBackPage, params?: { member?: string }): void {
	// 	if (this.appService.appId === 'listus') {
	// 		this.defaultBackUrl = CommuneTopPage.lists;
	// 	} else {
	// 		super.setDefaultBackUrl(page, params);
	// 	}
	// }

	// private createVirtualListItems(communeShortInfo: IShortCommuneInfo): void {
	// 	console.log('ListPage.createVirtualListItems()', communeShortInfo);
	// 	if (!this.shortListId) {
	// 		throw new Error('!this.shortListId');
	// 	}
	// 	const listDto = this.virtualRecords.createVirtualListDto(this.shortListId, communeShortInfo);
	// 	this.setList(listDto);
	// }

	// private createListItemCommandParams(item?: IListItemInfo): IListItemsCommandParams {
	// 	if (!this.listDto) {
	// 		throw new Error(`Page have no list DTO object, shortId=${this.shortListId}`);
	// 	}
	// 	if (!this.commune) {
	// 		throw new Error('!this.commune');
	// 	}
	// 	return {
	// 		commune: this.commune,
	// 		list: { dto: this.listDto, shortId: this.shortListId },
	// 		items: item ? [item] : [],
	// 	};
	// }
}


