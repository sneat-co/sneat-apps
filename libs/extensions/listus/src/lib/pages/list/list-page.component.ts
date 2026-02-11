import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { SharedWithComponent } from '@sneat/contactus-shared';
import { RandomIdService } from '@sneat/random';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { ListusCoreServicesModule } from '../../services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { IListItemBrief } from '../../dto';
import { IListContext } from '../../contexts';
import { takeUntil } from 'rxjs';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
import {
  IDeleteListItemsRequest,
  IReorderListItemsRequest,
  ISetListItemsIsComplete,
} from '../../services';
import { IListusAppStateService } from '../../services';
import { BaseListPage } from '../base-list-page';
import { ListDialogsService } from '../dialogs/ListDialogs.service';
import { IListItemWithUiState } from './list-item-with-ui-state';
import { ListItemComponent } from './list-item/list-item.component';
import { NewListItemComponent } from './new-list-item/new-list-item.component';

type ListPageSegment = 'list' | 'cards' | 'recipes' | 'settings' | 'discover';
type ListPagePerforming =
  | 'reactivating completed'
  | 'deleting completed'
  | 'clear list';

@Component({
  selector: 'sneat-list',
  templateUrl: './list-page.component.html',
  imports: [
    ListusCoreServicesModule,
    NgOptimizedImage,
    ContactusServicesModule,
    ListItemComponent,
    NewListItemComponent,
    SpaceServiceModule,
    SharedWithComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonSegment,
    IonSegmentButton,
    FormsModule,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonList,
    IonReorderGroup,
    IonCardContent,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonReorder,
    IonSpinner,
    IonFooter,
  ],
  styleUrls: ['./list-page.component.scss'],
  providers: [
    { provide: ClassName, useValue: 'ListPageComponent' },
    SpaceComponentBaseParams,
    ListusComponentBaseParams,
    ListDialogsService,
    RandomIdService,
  ],
})
export class ListPageComponent extends BaseListPage implements AfterViewInit {
  private readonly zone = inject(NgZone);
  private readonly listDialogs = inject(ListDialogsService);
  private readonly listusAppStateService = inject(IListusAppStateService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected isPersisting = false;
  protected isHideWatched = false;
  protected isReordering = false;

  protected listMode: 'reorder' | 'swipe' = 'swipe';
  protected doneFilter?: 'all' | 'active' | 'completed' = undefined;
  protected segment: ListPageSegment = 'list';
  protected allListItems?: IListItemWithUiState[];
  protected listItems?: IListItemWithUiState[];
  @ViewChild('newListItem', { static: false })
  public newListItem?: NewListItemComponent;
  protected addingItems: IListItemWithUiState[] = [];
  protected performing?: ListPagePerforming;

  // protected completedListItems?: IListItemWithUiState[];
  // protected activeListItems?: IListItemWithUiState[];

  constructor() {
    const params = inject(ListusComponentBaseParams);

    super(params);
    const listusAppStateService = this.listusAppStateService;

    console.log('ListPageComponent.constructor(), userId:', this.currentUserId);
    this.preloader.markAsPreloaded('list');
    if (location.pathname.includes('/lists')) {
      // TODO: document why & how it is possible
      return;
    }
    listusAppStateService.changed.subscribe((appState) => {
      this.isHideWatched = !appState.showWatched;
    });
  }

  ngAfterViewInit(): void /* Intentionally not ngOnInit */ {
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
  // 	} else if (pathname.includes('/watch')) {
  // 		this.segment = 'cards';
  // 		this.listType = 'watch';
  // 	}
  // 	this.preloader.preload(['lists']);
  // }

  public onIsDoneFilterChanged(event: Event): void {
    console.log('onIsDoneFilterChanged()', event);
    this.applyFilter();
  }

  protected override setList(list: IListContext): void {
    console.log('setList()', list);
    if (this.isReordering) {
      return;
    }
    super.setList(list);
    this.allListItems =
      list.dbo === undefined
        ? undefined
        : list.dbo?.items
          ? list.dbo.items.map((item) => {
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

  // protected isWatched(movie: IMovie, userId: string): boolean {
  // 	console.log(movie, 'userId', userId);
  // 	console.warn('isWatched is not implemented yet');
  // 	return false;
  // 	//return this.listusDbService.isWatched(movie, userId);
  // }

  protected removeIsWatchedFromWatchlist(): void {
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

  protected itemChanged(changedItem: {
    old: IListItemWithUiState;
    new: IListItemWithUiState;
  }): void {
    if (this.allListItems) {
      const itemIndex = this.allListItems?.findIndex(
        (item) => item === changedItem.old,
      );
      if (itemIndex >= 0) {
        this.allListItems[itemIndex] = changedItem.new;
        this.applyFilter();
      }
    }
  }

  protected goListItem(item: IListItemBrief): void {
    console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
    if (!this.space) {
      return;
    }
    if (item.subListId) {
      const path = item.subListType === 'recipes' ? 'recipe' : 'list';
      this.spaceNav
        .navigateForwardToSpacePage(this.space, path, {
          state: { list: this.list, listItem: item },
        })
        .catch(this.errorLogger.logError);
    }
  }

  protected reorder(e: Event): void {
    const event = e as CustomEvent<{
      from: number;
      to: number;
      complete: (
        list: boolean | IListItemWithUiState[],
      ) => IListItemWithUiState[];
    }>;
    if (this.allListItems) {
      // temp mock
      let movingItem = this.allListItems[event.detail.from];
      movingItem = {
        ...movingItem,
        state: { ...movingItem.state, isReordering: true },
      };
      this.allListItems[event.detail.from] = movingItem;
      event.detail.complete(this.allListItems);
      this.applyFilter();
      if (!this.space || !this.list?.brief) {
        return;
      }
      const request: IReorderListItemsRequest = {
        spaceID: this.space.id,
        listID: this.list.id,
        // listType: this.list.brief?.type,
        itemIDs: [movingItem.brief.id],
        toIndex: event.detail.to,
      };
      this.listService.reorderListItems(request).subscribe({
        complete: () => {
          movingItem = {
            ...movingItem,
            state: { ...movingItem.state, isReordering: true },
          };
          if (this.allListItems) {
            this.allListItems[event.detail.from] = movingItem;
          }
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

  protected newItem(): void {
    if (!this.list) {
      throw new Error('!this.listItems');
    }
    switch (this.list?.brief?.type) {
      case 'buy':
        break;
      case 'cook':
        break;
      case 'do':
        break;
      case 'other':
        break;
      case 'recipes':
        break;
      case 'rsvp':
        break;
      case 'watch':
        this.errorLogger.logError('Not implemented yet');
        // this.teamNav.navigateForwardToSpacePage(
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

  protected focusAddInput(): void {
    (this.newListItem as NewListItemComponent).focus();
  }

  protected openCopyListItemsDialog(
    listItem?: IListItemBrief,
    event?: Event,
  ): void {
    console.log(`openCopyListItemsDialog()`, listItem);
    if (event) {
      event.stopPropagation();
    }

    if (listItem) {
      this.errorLogger.logError('not implemented yet');
    } else if (this.list && this.listItems) {
      this.errorLogger.logError('not implemented yet');
    }
  }

  protected deleteCompleted(): void {
    console.log('deleteCompleted()');
    this.deleteItems(
      this.allListItems?.filter((li) => li.brief.status === 'done'),
    );
  }

  protected deleteAll(): void {
    console.log('deleteAll()');
    this.deleteItems(this.allListItems);
  }

  private deleteItems(items?: IListItemWithUiState[]): void {
    if (!this.space || !this.list?.brief || !items) {
      return;
    }
    let deletingItems: IListItemWithUiState[] = [];
    items.forEach((li) => {
      li = { ...li, state: { ...li.state, isDeleting: true } };
      deletingItems.push(li);
    });
    if (!items.length) {
      alert('Nothing to delete');
      return;
    }
    const request: IDeleteListItemsRequest = {
      spaceID: this.space.id,
      listID: this.list.id,
      // listType: this.list.brief.type,
      itemIDs: deletingItems.map((li) => li.brief.id),
    };
    this.changeDetectorRef.markForCheck();
    this.listService.deleteListItems(request).subscribe({
      error: this.errorLogger.logErrorHandler('failed to delete list items'),
      complete: () => {
        deletingItems = deletingItems.map((li) =>
          Object.assign(li, { state: { ...li.state, isDeleting: false } }),
        );
      },
    });
  }

  protected reactivateCompleted(): void {
    console.log('reactivateCompleted()');
    if (!this.list?.brief || !this.space || !this.allListItems) {
      return;
    }
    const request: ISetListItemsIsComplete = {
      spaceID: this.space.id,
      listID: this.list.id,
      // listType: this.list.brief.type,
      isDone: false,
      itemIDs: this.allListItems
        .filter((li) => li.brief.status === 'done')
        .map((li) => li.brief.id),
    };
    if (!request.itemIDs.length) {
      alert('You have no completed items');
      return;
    }
    this.performing = 'reactivating completed';
    this.listService
      .setListItemsIsCompleted(request)
      .pipe(takeUntil(this.destroyed$))
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

  protected goGroceries(): void {
    if (!this.space.id) {
      this.errorLogger.logError('no space context');
      return;
    }
    this.errorLogger.logError('not implemented yet');
    // this.spaceNav.navigateForwardToSpacePage(this.team,
    // 	`list/${this.list?.id}`, {
    // 		state: { list: this.list },
    // 	});
  }

  private applyFilter(): void {
    const doneFilter = this.doneFilter;
    if (!doneFilter) {
      if (
        !this.allListItems?.length ||
        this.allListItems?.some((li) => li.brief.status !== 'done')
      ) {
        this.doneFilter = 'active';
      } else {
        this.doneFilter = 'all';
      }
    }
    this.listItems =
      this.allListItems?.filter(
        (li) =>
          doneFilter === 'all' ||
          (doneFilter === 'completed' && li.brief.status === 'done') ||
          (doneFilter === 'active' && li.brief.status !== 'done'),
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
