import {Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {IonInput, ToastController} from '@ionic/angular';
import { APP_INFO, IAppInfo } from '@sneat/core';
import { TeamComponentBaseParams } from '@sneat/team/components';
import {ListDialogsService} from '../dialogs/ListDialogs.service';
import {IListItemCommandParams, IListItemService, IListService, IListusService} from '../../services/interfaces';
import {Observable} from 'rxjs';
import {BaseListPage} from '../base-list-page';
import {IListusAppStateService} from '../../services/listus-app-state.service';

@Component({
	selector: 'sneat-list',
	templateUrl: './list.page.html',
	styleUrls: ['./list.page.scss'],
	providers: [TeamComponentBaseParams],
})
export class ListPageComponent extends BaseListPage implements OnInit {

	constructor(
		params: TeamComponentBaseParams,
		private readonly zone: NgZone,
		private readonly toastCtrl: ToastController,
		private readonly listusService: IListusService,
		listService: IListService,
		private readonly listItemService: IListItemService,
		private readonly listDialogs: ListDialogsService,
		// private readonly shelfService: ShelfService,
		private readonly listusAppStateService: IListusAppStateService,
		private readonly listusDbService: IListusService,
	) {
		super('id', 'lists', params, listService);
		console.log('ListPage.constructor(), userId:', this.userId);
		this.preloaderService.markAsPreloaded('list');
		if (location.pathname.indexOf('/lists') >= 0) { // TODO: document why & how it is possible
			return;
		}
		listusAppStateService.changed.subscribe(appState => {
			this.isHideWatched = !appState.showWatched;
		});
	}

	get userId(): string {
		return this.authStateService.authState.currentUserId || '123';
	}

	public isPersisting = false;
	public segment: 'list' | 'cards' | 'recipe' | 'settings' | 'discover' = 'list';
	reordering: boolean;
	public listItems?: (IListItemInfo | undefined)[];
	public listType: ListType;
	public isHideWatched: boolean;

	// tslint:disable-next-line:no-any
	@ViewChild('newListItem', {static: false}) newListItem: any;

	trackById = ListItemInfoModel.trackBy;

	ngOnInit(): void {
		super.ngOnInit();
		const {pathname} = location;
		if (pathname.indexOf('/lists') >= 0) {
			return;
		}
		if (pathname.indexOf('/recipes') >= 0) {
			this.segment = 'cards';
			this.listType = 'recipe';
		} else if (pathname.indexOf('/to-watch') >= 0) {
			this.segment = 'cards';
			this.listType = 'watch';
		}
		this.preloaderService.preload(['lists']);
	}

	protected onListInfoChanged(): void {
		super.onListInfoChanged();
		if (this.listInfo) {
			if (this.listInfo.id) {
				if (!this.listItems && this.listInfo.itemsCount) {
					this.listItems = [];
					for (let i = 0; i < this.listInfo.itemsCount; i += 1) {
						this.listItems.push(undefined);
					}
				}
				const list$ = this.shelfService.pop('list$') as Observable<IListDto>;
				console.log('list$:', list$);
				if (list$) {
					this.processList$(this.listInfo.id, list$);
				} else {
					this.loadList(this.listInfo.id);
				}
			} else {
				this.shortListId = this.listInfo.shortId;
				if (this.shortCommuneInfo && !this.listInfo.id) {
					this.createVirtualListItems(this.shortCommuneInfo);
				}
			}
		}
	}

	protected setListInfo(listInfo: IListInfo): void {
		super.setListInfo(listInfo);
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		this.createVirtualListItems(
			createShortCommuneInfoFromDto(
				this.commune.dto,
				this.communeShortId || this.commune.shortId || this.shortCommuneInfo && this.shortCommuneInfo.shortId));
	}

	private createVirtualListItems(communeShortInfo: IShortCommuneInfo): void {
		console.log('ListPage.createVirtualListItems()', communeShortInfo);
		if (!this.shortListId) {
			throw new Error('!this.shortListId');
		}
		const listDto = this.virtualRecords.createVirtualListDto(this.shortListId, communeShortInfo);
		this.setListDto(listDto);
	}

	public clickShowWatchedMovies(): void {
		this.listusAppStateService.setShowWatched(this.isHideWatched);
	}

	public setListDto(iListDto: IListDto): void {
		if (this.reordering) {
			return;
		}
		super.setListDto(iListDto);
		this.listItems = iListDto.items ? [...iListDto.items] : [];
	}

	public isWatched(movie: IMovie, userId: string): boolean {
		console.log(movie, 'userId', userId);
		return this.listusDbService.isWatched(movie, userId);
	}

	public removeIsWatchedFromWatchlist(movies: IMovie[]): void {
		console.log('remove');
		movies.forEach(movie => {
			console.log(movie.watchedByUserIds);
			if (this.isWatched(movie, this.userId)) {
				console.log('remove movie');
				this.listusService.deleteListItem(this.createListItemCommandParams(movie))
					.subscribe(
						listDto => {
							this.setListDto(listDto);
						},
						this.errorLogger.logError,
					);
			}
		});
	}

	goListItem(item: IListItemInfo): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		if (item.subListId) {
			const path = item.subListType === 'recipe' ? 'recipe' : 'list';
			this.navigateForward(path, {id: item.subListId}, undefined, {excludeCommuneId: true});
		}
	}

	private createListItemCommandParams(item?: IListItemInfo): IListItemCommandParams {
		if (!this.listDto) {
			throw new Error(`Page have no list DTO object, shortId=${this.shortListId}`);
		}
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		return {
			commune: this.commune,
			list: {dto: this.listDto, shortId: this.shortListId},
			items: item ? [item] : [],
		};
	}

	reorder(event: CustomEvent<{ from: number; to: number; complete: (list: boolean | IListItemInfo[]) => IListItemInfo[] }>): void {
		console.log(`ListPage.reorder(from=${event.detail.from}, to=${event.detail.to})`);
		this.listusService.reorderListItems(
			this.createListItemCommandParams(undefined),
			listDto => {
				console.log('ListPage.reorder() => event.detail.complete()');
				if (!listDto.items) {
					throw new Error('!listDto.items');
				}
				event.detail.complete(listDto.items);
			},
		)
			.subscribe({
				next: listDto => {
					this.listDto = listDto;
					this.listInfo = createListInfoFromDto(listDto, this.shortListId);
					if (!listDto.items) {
						throw new Error('!listDto.items');
					}
					this.listItems = listDto.items;
					console.log('ListPage.reorder() => completed');
				},
				error: err => {
					event.detail.complete(false);
					this.errorLogger.logError(err);
				},
			});
	}

	newItem(): void {
		// noinspection JSRedundantSwitchStatement
		if (!this.listInfo) {
			throw new Error('!this.listItems');
		}
		switch (this.listInfo.type) {
			case 'buy':
				break;
			case 'cook':
				break;
			case 'do':
				break;
			case 'other':
				break;
			case 'recipe':
				break;
			case 'rsvp':
				break;
			case 'watch':
				this.navigateForward(
					'add-to-watch',
					{
						list: this.listId,
					},
					{
						listInfo: this.listInfo,
						listDto: this.listDto,
					},
					{
						excludeCommuneId: true,
					},
				);
				break;
			default:
				this.focusAddInput();
				break;
		}
	}

	focusAddInput(): void {
		(this.newListItem as NewListItemComponent).focus();
	}

	protected showToast(opts: { message: string; duration?: number; color?: string }): void {
		const worker = async () => {
			const toast = await this.toastCtrl.create({
				...opts,
				// tslint:disable-next-line:no-magic-numbers
				duration: opts.duration || 2000,
				buttons: [{role: 'cancel', text: 'OK'}],
			});
			await toast.present();
		};
		worker()
			.catch(err => {
					this.errorLogger.logError(err, 'Failed to display toast');
				},
			);
	}

	protected setDefaultBackUrl(page?: DefaultBackPage, params?: { member?: string }): void {
		if (this.appService.appId === 'listus') {
			this.defaultBackUrl = CommuneTopPage.lists;
		} else {
			super.setDefaultBackUrl(page, params);
		}
	}

	addMovieToWatchlist(movie: IMovie): void {
		console.log('ListPage.addMovieToWatchlist', movie);
		if (!movie) {
			throw new Error('movie is a required parameter');
		}
		if (!this.commune) {
			throw new Error('this.commune has no value');
		}
		const item: IListItemInfo = movie;
		this.isPersisting = true;
		if (!this.listDto) {
			throw new Error('!this.listDto');
		}
		this.listusService.addListItem({
			commune: this.commune,
			list: {dto: this.listDto, shortId: this.shortListId},
			items: [item],
		})
			.subscribe({
				next: result => {
					console.log('ListPage.addListItem', result);
					if (result.success) {
						(this.newListItem as NewListItemComponent).clear();
					} else if (result.message) {
						this.showToast({color: 'danger', message: result.message});
					}
					if (!this.communeRealId && result.communeDto) {
						this.setPageCommuneIds(
							'addMovieToWatchlist',
							{
								short: this.communeShortId,
								real: result.communeDto.id
							},
							result.communeDto,
						);
					}
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

	public openCopyListItemsDialog(listItem?: IListItemInfo, event?: Event): void {
		console.log(`openCopyListItemsDialog()`, listItem);
		if (event) {
			event.stopPropagation();
		}

		let listInfo: IListInfo | undefined;
		let listItems: IListItemInfo[] = [];

		if (listItem) {
			listInfo = {
				type: listItem.subListType || 'other',
				id: listItem.subListId,
				title: listItem.title,
			};
		} else if (this.listInfo && this.listItems) {
			listInfo = this.listInfo;
			listItems = this.listItems as IListItemInfo[];
		}
		if (listInfo) {
			this.listDialogs.copyListItems(listItems, listInfo)
				.catch(this.errorLogger.logError);
		}
	}

	public goGroceries(): void {
		this.navigateForward('to-buy', {list: 'family-groceries'}, undefined, {excludeCommuneId: true});
	}
}


@Component({
	selector: 'sneat-new-list-item',
	template: `
		<form (ngSubmit)="add()">
			<ion-item>
				<!--suppress AngularUndefinedBinding -->
				<ion-input [disabled]="disabled" #newItemInput autofocus="true" [(ngModel)]="title" name="title"
							  placeholder="New item"
							  (ionFocus)="focused()"
				></ion-input>
				<ion-button fill="outline" size="small" (click)="add()" slot="end" *ngIf="isFocused && title.trim()">
					Add
				</ion-button>
			</ion-item>
		</form>
	`,
})
export class NewListItemComponent {
	isFocused: boolean;

	@Input() disabled: boolean;

	@ViewChild('newItemInput', {static: false}) newItemInput: IonInput;

	@Output() added = new EventEmitter<IListItemInfo>();

	public title = '';

	constructor(
		private readonly errorLogger: IErrorLogger,
	) {
	}


	focused(): void {
		console.log('focused');
		this.isFocused = true;
	}

	add(): void {
		console.log('add()');
		if (!this.title.trim()) {
			return;
		}
		const item: IListItemInfo = {title: this.title};
		this.added.emit(item);
		this.isFocused = false;
	}

	clear(): void {
		console.log('NewListItem.clear()');
		this.title = '';
	}

	focus(): void {
		console.log('NewListItem.focus()');
		this.newItemInput.setFocus()
			.catch(this.errorLogger.logError);
	}
}
