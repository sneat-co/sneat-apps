import { AfterViewInit, Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class ListPageComponent extends BaseListPage implements AfterViewInit {

	public isPersisting = false;
	public doneFilter: 'all' | 'active' | 'completed' = 'all';
	public segment: 'list' | 'cards' | 'recipes' | 'settings' | 'discover' = 'list';
	public reordering = false;
	public allListItems?: IListItemBrief[];
	public filteredListItems?: IListItemBrief[];
	public listType?: ListType;
	public isHideWatched = false;
	// tslint:disable-next-line:no-any
	@ViewChild('newListItem', { static: false }) newListItem?: NewListItemComponent;
	itemId = ListItemInfoModel.trackBy;
	addingItems: IListItemBrief[] = [];

	constructor(
		route: ActivatedRoute,
		params: ListusComponentBaseParams,
		private readonly zone: NgZone,
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

	ngAfterViewInit(): void {
		if (this.newListItem) {
			this.newListItem?.adding.subscribe({
				next: (item: IListItemBrief) => {
					this.addingItems.push(item);
					this.allListItems?.push();
					this.applyFilter();
				},
				error: this.errorLogger.logError,
			});
			this.newListItem.added.subscribe({
				next: (item: IListItemBrief) => {
					console.log('added', item);
					this.addingItems = this.addingItems.filter(v => v.id !== item.id);
				},
				error: this.errorLogger.logError,
			});
			this.newListItem.failedToAdd.subscribe({
				next: (id: string): void => {
					console.log('failed to add:', id);
					this.addingItems = this.addingItems.filter(v => v.id !== id);
				},
				error: this.errorLogger.logError,
			});
		} else {
			this.errorLogger.logError('newListItem component is not initialized');
		}
	}

	public clickShowWatchedMovies(): void {
		this.listusAppStateService.setShowWatched(this.isHideWatched);
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

	public onIsDoneFilterChanged(event: Event): void {
		this.applyFilter();
	}

	public override setList(list: IListContext): void {
		if (this.reordering) {
			return;
		}
		super.setList(list);
		this.allListItems = list.dto === undefined ? undefined
			: list.dto?.items ? [...list.dto.items] : [];
		if (this.allListItems && this.addingItems.length) {
			this.addingItems = this.addingItems.filter(v => !this.filteredListItems?.some(li => li.id === v.id));
			if (this.addingItems.length) {
				this.allListItems = [...this.allListItems, ...this.addingItems];
			}
		}
		this.applyFilter();
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
		if (this.filteredListItems) { // temp mock
			event.detail.complete(this.filteredListItems);
		}
		console.log(`ListPage.reorder(from=${event.detail.from}, to=${event.detail.to})`);
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
		} else if (this.list && this.filteredListItems) {
			// list = ...;
			listItems = this.filteredListItems as IListItemBrief[];
			this.errorLogger.logError('not implemented yet');
			return;
		}
		if (list) {
			this.listDialogs.copyListItems(listItems, list)
				.catch(this.errorLogger.logError);
		}
	}

	public deleteCompleted(): void {

	}

	public deleteAll(): void {

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

	private applyFilter(): void {
		const doneFilter = this.doneFilter;
		this.filteredListItems = this.allListItems?.filter(li => doneFilter === 'all'
			|| doneFilter === 'completed' && li.isDone
			|| doneFilter === 'active' && !li.isDone);
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


