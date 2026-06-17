import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  viewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  ToastController,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { RandomIdService } from '@sneat/random';
import { ISpaceContext } from '@sneat/space-models';
import { IListContext } from '../../../contexts';
import {
  EmojisLoaderService,
  ICreateListItemRequest,
  ListService,
} from '../../../services';
import { IListItemWithUiState } from '../list-item-with-ui-state';

@Component({
  selector: 'sneat-new-list-item',
  imports: [FormsModule, IonItem, IonIcon, IonInput, IonButton],
  templateUrl: './new-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewListItemComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly randomService = inject(RandomIdService);
  private readonly toastCtrl = inject(ToastController);
  private readonly listService = inject(ListService);
  private readonly emojisLoader = inject(EmojisLoaderService);

  protected readonly isFocused = signal(false);

  public readonly isAdding = signal(false);

  readonly isDone = input(false);
  readonly disabled = input(false);
  readonly space = input.required<ISpaceContext | undefined>();
  readonly list = input.required<IListContext | undefined>();

  readonly newItemInput = viewChild<IonInput>('newItemInput');

  readonly adding = output<IListItemWithUiState>();
  readonly added = output<IListItemWithUiState>();
  readonly failedToAdd = output<string>();

  public readonly title = signal('');

  protected focused(): void {
    this.isFocused.set(true);
  }

  protected add(): void {
    if (!this.title().trim()) {
      return;
    }
    let id = '';
    for (let i = 0; i < 100; i++) {
      id = this.randomService.newRandomId({ len: 3 });
      if (!this.list()?.dbo?.items?.some((item) => item.id === id)) {
        break;
      }
    }
    let item: ICreateListItemRequest = {
      id,
      title: this.title(),
    };

    // Async emoji detection
    this.emojisLoader
      .detectEmoji(item.title)
      .then((emoji) => {
        if (emoji) {
          item = { ...item, emoji };
        }
      })
      .catch((err) => {
        this.errorLogger.logError(err, 'Failed to detect emoji');
        // Continue without emoji
      })
      .finally(() => {
        // Always apply isDone and create the item
        if (this.isDone()) {
          item = { ...item, isDone: true };
        }
        this.createListItem(item);
      });
  }

  protected clear(): void {
    this.title.set('');
  }

  // Is intentionally public to be called from wrapping component.
  public focus(): void {
    const newItemInput = this.newItemInput();
    if (!newItemInput) {
      this.errorLogger.logError('!this.newItemInput');
      return;
    }
    newItemInput.setFocus().catch(this.errorLogger.logError);
  }

  protected createListItem(listItemBrief: ICreateListItemRequest): void {
    const space = this.space();
    const list = this.list();
    console.log('ListPage.createListItem', listItemBrief, list, space);
    if (!listItemBrief) {
      throw new Error('movie is a required parameter');
    }
    if (!space) {
      throw new Error('no team context');
    }
    this.isAdding.set(true);
    if (!list) {
      throw new Error('no list context');
    }
    this.title.set('');
    this.adding.emit({ brief: listItemBrief, state: { isAdding: true } });
    this.listService
      .createListItems({
        space: space,
        list: list,
        items: [listItemBrief],
      })
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.clear();
            this.focus();
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
          this.isAdding.set(false);
          this.added.emit({ brief: listItemBrief, state: {} });
          setTimeout(() => {
            this.focus();
          }, 100);
        },
        error: (err) => {
          this.errorLogger.logError(err, 'Failed to add item to list');
          this.isAdding.set(false);
          this.failedToAdd.emit(listItemBrief.id);
          this.focus();
        },
      });
  }

  protected showToast(opts: {
    message: string;
    duration?: number;
    color?: string;
  }): void {
    const worker = async () => {
      const toast = await this.toastCtrl.create({
        ...opts,
        duration: opts.duration || 2000,
        buttons: [{ role: 'cancel', text: 'OK' }],
      });
      await toast.present();
    };
    worker().catch((err) => {
      this.errorLogger.logError(err, 'Failed to display toast');
    });
  }
}
