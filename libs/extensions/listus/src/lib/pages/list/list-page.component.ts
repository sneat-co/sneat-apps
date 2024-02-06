import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	NgZone,
	ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IListInfo, IListItemBrief, IMovie, ListType } from '../../dto';
import { IListContext } from '../../contexts';
import { takeUntil } from 'rxjs';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
import {
	IDeleteListItemsRequest,
	IReorderListItemsRequest,
	ISetListItemsIsComplete,
} from '../../services/interfaces';
import { ListService } from '../../services/list.service';
import { IListusAppStateService } from '../../services/listus-app-state.service';
import { BaseListPage } from '../base-list-page';
import { ListDialogsService } from '../dialogs/ListDialogs.service';
import { IListItemWithUiState } from './list-item-with-ui-state';
import { NewListItemComponent } from './new-list-item.component';

@Component({
	selector: 'sneat-list',
	templateUrl: './list-page.component.html',
	styleUrls: ['./list-page.component.scss'],
	providers: [ListusComponentBaseParams],
})
export class ListPageComponent extends BaseListPage implements AfterViewInit {
	public isPersisting = false;
	public listMode: 'reorder' | 'swipe' = 'swipe';
	public doneFilter: 'all' | 'active' | 'completed' = 'all';
	public segment: 'list' | 'cards' | 'recipes' | 'settings' | 'discover' =
		'list';
	public isReordering = false;
	public allListItems?: IListItemWithUiState[];
	public completedListItems?: IListItemWithUiState[];
	public activeListItems?: IListItemWithUiState[];
	public listItems?: IListItemWithUiState[];
	public listType?: ListType;
	public isHideWatched = false;
	@ViewChild('newListItem', { static: false })
	newListItem?: NewListItemComponent;
	addingItems: IListItemWithUiState[] = [];
	public performing?:
		| 'reactivating completed'
		| 'deleting completed'
		| 'clear list';

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
		private readonly changeDetectorRef: ChangeDetectorRef, // private readonly listusDbService: IListusService,
	) {
		super('ListPage', route, params);
		console.log('ListPage.constructor(), userId:', this.currentUserId);
		this.preloader.markAsPreloaded('list');
		if (location.pathname.includes('/lists')) {
			// TODO: document why & how it is possible
			return;
		}
		listusAppStateService.changed.subscribe((appState) => {
			this.isHideWatched = !appState.showWatched;
		});
	}

	public readonly itemId = (i: number, li: IListItemWithUiState) => li.brief.id;

	ngAfterViewInit(): void {
		if (this.newListItem) {
			this.newListItem?.adding.subscribe({
				next: (item: IListItemWithUiState) => {
					console.log('newListItem?.adding => item:', item);
					this.addingItems.push(item);
					this.applyFilter();
				},
				error: this.errorLogger.logError,
			});
			this.newListItem.added.subscribe({
				next: (item: IListItemBrief) => {
					console.log('added', item);
					this.addingItems = this.addingItems.filter(
						(v) => v.brief.id !== item.id,
					);
					this.applyFilter();
				},
				error: this.errorLogger.logError,
			});

			this.newListItem.failedToAdd.subscribe({
				next: (id: string): void => {
					console.log('failed to add:', id);
					this.addingItems = this.addingItems.filter((v) => v.brief.id !== id);
				},
				error: this.errorLogger.logError,
			});
		} else {
			this.errorLogger.logError('newListItem component is not initialized');
		}
	}

	public setEditMode(e: Event, v: 'reorder' | 'swipe'): boolean {
		e.preventDefault();
		e.stopPropagation();
		this.listMode = v;
		return false;
	}

	public clickShowWatchedMovies(): void {
		this.listusAppStateService.setShowWatched(this.isHideWatched);
	}

	// ngOnInit(): void {
	// 	super.ngOnInit();
	// 	const { pathname } = location;
	// 	if (pathname.includes('/lists')) {
	// 		return;
	// 	}
	// 	if (pathname.includes('/recipes')) {
	// 		this.segment = 'cards';
	// 		this.listType = 'recipe';
	// 	} else if (pathname.includes('/to-watch')) {
	// 		this.segment = 'cards';
	// 		this.listType = 'watch';
	// 	}
	// 	this.preloader.preload(['lists']);
	// }

	public onIsDoneFilterChanged(event: Event): void {
		console.log('onIsDoneFilterChanged()', event);
		this.applyFilter();
	}

	public override setList(list: IListContext): void {
		if (this.isReordering) {
			return;
		}
		super.setList(list);
		this.allListItems =
			list.dto === undefined
				? undefined
				: list.dto?.items
					? list.dto.items.map((item) => {
							return { brief: item, state: {} };
						})
					: [];
		if (this.allListItems && this.addingItems.length) {
			this.addingItems = this.addingItems.filter(
				(v) => !this.listItems?.some((li) => li.brief.id === v.brief.id),
			);
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

	public removeIsWatchedFromWatchlist(): void {
		this.errorLogger.logError(
			'removeIsWatchedFromWatchlist is not implemented yet',
		);
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
			this.teamNav
				.navigateForwardToTeamPage(this.team, path, {
					state: { list: this.list, listItem: item },
				})
				.catch(this.errorLogger.logError);
		}
	}

	reorder(e: Event): void {
		const event = e as CustomEvent<{
			from: number;
			to: number;
			complete: (
				list: boolean | IListItemWithUiState[],
			) => IListItemWithUiState[];
		}>;
		if (this.allListItems) {
			// temp mock
			const movingItem = this.allListItems[event.detail.from];
			movingItem.state.isReordering = true;
			event.detail.complete(this.allListItems);
			this.applyFilter();
			if (!this.team || !this.list?.brief) {
				return;
			}
			const request: IReorderListItemsRequest = {
				teamID: this.team.id,
				listID: this.list.id,
				listType: this.list.brief?.type,
				itemIDs: [movingItem.brief.id],
				toIndex: event.detail.to,
			};
			this.listService.reorderListItems(request).subscribe({
				complete: () => {
					movingItem.state.isReordering = false;
					this.isReordering = false;
				},
				error: this.errorLogger.logErrorHandler('failed to reorder list items'),
			});
			setTimeout(() => {
				if (!this.allListItems) {
					return;
				}
			}, 1000);
		}
		console.log(
			`ListPage.reorder(from=${event.detail.from}, to=${event.detail.to})`,
		);

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

	public openCopyListItemsDialog(
		listItem?: IListItemBrief,
		event?: Event,
	): void {
		console.log(`openCopyListItemsDialog()`, listItem);
		if (event) {
			event.stopPropagation();
		}

		let list: IListInfo | undefined;
		// let listItems: IListItemWithUiState[] = [];

		if (listItem) {
			this.errorLogger.logError('not implemented yet');
			// list = {
			// 	type: listItem.subListType || 'other',
			// 	id: listItem.subListId || '',
			// 	title: listItem.title || 'no title - to be fixed',
			// };
		} else if (this.list && this.listItems) {
			// list = ...;
			// listItems = this.filteredListItems as IListItemWithUiState[];
			this.errorLogger.logError('not implemented yet');
			return;
		}
		if (list) {
			// this.listDialogs.copyListItems(listItems, list)
			// 	.catch(this.errorLogger.logError);
		}
	}

	public deleteCompleted(): void {
		console.log('deleteCompleted()');
		this.deleteItems(this.allListItems?.filter((li) => li.brief.isDone));
	}

	public deleteAll(): void {
		console.log('deleteAll()');
		this.deleteItems(this.allListItems);
	}

	private deleteItems(items?: IListItemWithUiState[]): void {
		if (!this.team || !this.list?.brief || !items) {
			return;
		}
		const deletingItems: IListItemWithUiState[] = [];
		items.forEach((li) => {
			deletingItems.push(li);
			li.state.isDeleting = true;
		});
		if (!items.length) {
			alert('Nothing to delete');
			return;
		}
		const request: IDeleteListItemsRequest = {
			teamID: this.team.id,
			listID: this.list.id,
			listType: this.list.brief.type,
			itemIDs: deletingItems.map((li) => li.brief.id),
		};
		this.changeDetectorRef.markForCheck();
		this.listService.deleteListItems(request).subscribe({
			error: this.errorLogger.logErrorHandler('failed to delete list items'),
			complete: () => {
				deletingItems.forEach((li) => {
					li.state.isDeleting = false;
				});
			},
		});
	}

	public reactivateCompleted(): void {
		console.log('reactivateCompleted()');
		if (!this.list?.brief || !this.team || !this.allListItems) {
			return;
		}
		const request: ISetListItemsIsComplete = {
			teamID: this.team.id,
			listID: this.list.id,
			listType: this.list.brief.type,
			isDone: false,
			itemIDs: this.allListItems
				.filter((li) => li.brief.isDone)
				.map((li) => li.brief.id),
		};
		if (!request.itemIDs.length) {
			alert('You have no completed items');
			return;
		}
		this.performing = 'reactivating completed';
		this.listService
			.setListItemsIsCompleted(request)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => {
					console.log('reactivated all previously completed items');
					this.performing = undefined;
				},
				error: (err) => {
					this.performing = undefined;
					this.errorLogger.logError(
						err,
						'failed to reactivate all completed items',
					);
				},
			});
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
		this.listItems =
			this.allListItems?.filter(
				(li) =>
					doneFilter === 'all' ||
					(doneFilter === 'completed' && li.brief.isDone) ||
					(doneFilter === 'active' && !li.brief.isDone),
			) || [];
		this.listItems = [...this.listItems, ...this.addingItems];
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
