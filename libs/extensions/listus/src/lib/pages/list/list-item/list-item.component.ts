import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
  inject,
} from '@angular/core';
import {
  ToastController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonReorder,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { ToastOptions } from '@ionic/core/dist/types/components/toast/toast-interface';
import { listItemAnimations } from '@sneat/core';
import { IListItemBrief } from '../../../dto';
import { IListContext } from '../../../contexts';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import {
  IListItemIDsRequest,
  ISetListItemsIsComplete,
} from '../../../services';
import { ListService } from '../../../services';
import { ListDialogsService } from '../../dialogs/ListDialogs.service';
import { IListItemWithUiState } from '../list-item-with-ui-state';

@Component({
  selector: 'sneat-list-item',
  imports: [
    IonItemSliding,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonText,
    IonBadge,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonReorder,
    IonItemOptions,
    IonItemOption,
  ],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  animations: [listItemAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  private readonly params = inject(ListusComponentBaseParams);
  private readonly listDialogs = inject(ListDialogsService);
  private readonly toastCtrl = inject(ToastController);

  @Input()
  public showDoneCheckbox = false;

  public readonly $doneFilter = input.required<
    'all' | 'active' | 'completed'
  >();

  public readonly $listMode = input.required<'reorder' | 'swipe'>();
  protected readonly $isReorderMode = computed(
    () => this.$listMode() === 'reorder',
  );

  readonly $listItemWithUiState = input.required<IListItemWithUiState>();
  public readonly $list = input.required<IListContext | undefined>();

  protected readonly $isSettingIsDone = signal(false);

  @Output()
  public readonly itemClicked = new EventEmitter<IListItemBrief>();

  @Output()
  public readonly itemChanged = new EventEmitter<{
    old: IListItemWithUiState;
    new: IListItemWithUiState;
  }>();

  @Output()
  public readonly listChanged = new EventEmitter<IListContext>();

  protected readonly $listItem = computed(
    () => this.$listItemWithUiState().brief,
  );

  private get listService(): ListService {
    return this.params.listService;
  }

  private get errorLogger() {
    return this.params.spaceParams.errorLogger;
  }

  protected isSpinning(): boolean {
    if (!this.$listItemWithUiState) {
      return false;
    }
    const { state } = this.$listItemWithUiState();
    return (
      !!state.isReordering || !!state.isDeleting || !!state.isChangingIsDone
    );
  }

  protected goListItem(): void {
    const listItem = this.$listItem();
    console.log(
      `goListItem(${listItem?.id}), subListId=${listItem?.subListId}`,
    );
    this.itemClicked.emit(listItem);
  }

  protected $isDone = computed(
    () => !!this.$listItemWithUiState().brief.isDone,
  );

  protected isDone(item?: IListItemWithUiState): boolean {
    return !!item?.brief.isDone;
  }

  protected onIsDoneCheckboxChanged(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.$listItemWithUiState) {
      return;
    }
    const { checked } = (event as CustomEvent).detail;
    if (checked === undefined) {
      return;
    }
    console.log('onIsDoneCheckboxChanged()', checked, this.$doneFilter());
    const isDone = !!checked;
    this.setIsDone(isDone);
  }

  protected setIsDone(isDone?: boolean, ionSliding?: IonItemSliding): void {
    const item = this.$listItemWithUiState();
    if (isDone === undefined) {
      isDone = !this.$isDone();
    }
    const newItem: IListItemWithUiState = {
      brief: { ...item.brief, status: isDone ? 'done' : undefined },
      state: { ...item.state, isChangingIsDone: true },
    };
    const performSetIsDone = (): void => {
      this.itemChanged.emit({
        old: item,
        new: newItem,
      });

      this.$isSettingIsDone.set(true);

      const list = this.$list();
      if (!list?.brief) {
        return;
      }

      const request: ISetListItemsIsComplete = {
        spaceID: list.space.id,
        listID: list.id,
        itemIDs: [item.brief.id],
        isDone: isDone,
      };
      this.listService.setListItemsIsCompleted(request).subscribe({
        next: () => {
          this.itemChanged.emit({
            old: newItem,
            new: {
              brief: newItem.brief,
              state: { ...newItem.state, isChangingIsDone: false },
            },
          });
          const toastOptions: ToastOptions = {
            message: isDone
              ? `${item.brief.title} marked as completed`
              : `${item.brief.title} marked as active`,
            duration: 1000,
            color: 'light',
            buttons: [{ icon: 'close', role: 'cancel' }],
            keyboardClose: true,
          };
          this.toastCtrl
            .create(toastOptions)
            .then((toast) =>
              toast
                .present()
                .catch(
                  this.errorLogger.logErrorHandler(
                    'Failed to present a toast message about list item isCompleted set to ' +
                      isDone,
                  ),
                ),
            )
            .catch(
              this.errorLogger.logErrorHandler(
                'Failed to present a toast message about list item isCompleted set to ' +
                  isDone,
              ),
            );
        },
        error: this.errorLogger.logErrorHandler(
          'failed to mark list item as completed',
        ),
        complete: () => {
          this.$isSettingIsDone.set(false);
        },
      });
    };
    if (ionSliding) {
      (ionSliding as IonItemSliding)
        .close()
        .then(performSetIsDone)
        .catch(this.errorLogger.logErrorHandler('Failed to set completed'));
    } else {
      performSetIsDone();
      // setTimeout(() => performSetIsDone(), 0);
    }
  }

  protected deleteFromList(
    item: IListItemBrief,
    ionSliding?: IonItemSliding | HTMLElement,
  ): void {
    console.log('ListItemComponent.deleteFromList()', item);
    if (!item.id) {
      return;
    }
    const list = this.$list();
    if (!list?.id || !list?.brief) {
      return;
    }
    const request: IListItemIDsRequest = {
      spaceID: list.space.id,
      listID: list.id,
      // listType: this.list?.brief?.type,
      itemIDs: [item.id],
    };
    this.listService.deleteListItems(request).subscribe({
      next: () => {
        console.log('ListItemComponent => item deleted');
        // this.listChanged.emit(listDto);
      },
      error: this.errorLogger.logError,
      complete: () => {
        if (ionSliding) {
          (ionSliding as IonItemSliding)
            ?.closeOpened()
            .catch(this.errorLogger.logError);
        }
      },
    });
  }

  protected openCopyListItemDialog(
    listItem: IListItemBrief,
    event: Event,
  ): void {
    console.log(`openCopyListItemDialog()`, listItem);
    event.stopPropagation();

    this.listDialogs
      .copyListItems([listItem], {
        type: listItem.subListType || 'other',
        id: listItem.subListId,
        title: listItem.title,
      })
      .catch(this.errorLogger.logError);
  }
}
