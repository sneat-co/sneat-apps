import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  viewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IRetroItem, RetroItemType } from '@sneat/ext-scrumspace-scrummodels';
import {
  IAddRetroItemRequest,
  IRetroItemRequest,
  RetrospectiveService,
} from '../../retrospective.service';

@Component({
  selector: 'sneat-retro-my-items',
  templateUrl: './retro-my-items.component.html',
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    ReactiveFormsModule,
    IonInput,
    IonIcon,
    IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroMyItemsComponent {
  private readonly retrospectiveService = inject(RetrospectiveService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  readonly titleInput = viewChild(IonInput); // TODO: strong typing : IonInput;

  readonly question = input<RetroItemType>();
  readonly spaceID = input<string>();
  readonly retroId = input<string>();

  public titleControl = new FormControl<string>('', [Validators.required]);

  public addRetroItemForm = new UntypedFormGroup({
    titleControl: this.titleControl,
  });

  public readonly items = signal<IRetroItem[] | undefined>(undefined);

  public trackById = (i: number, item: IRetroItem) => item.ID;

  public delete(item: IRetroItem): void {
    const spaceID = this.spaceID();
    const retroId = this.retroId();
    if (!spaceID || !retroId || !item.type) {
      return;
    }
    const request: IRetroItemRequest = {
      spaceID,
      meeting: retroId,
      item: item.ID,
      type: item.type,
    };
    this.retrospectiveService.deleteRetroItem(request).subscribe({
      // next: v => console.log('items after deletion:', v),
      error: (err) =>
        this.errorLogger.logError(err, 'Failed to delete scrum item'),
    });
  }

  public add(): void {
    const spaceID = this.spaceID();
    const question = this.question();
    const retroId = this.retroId();
    if (!spaceID || !question || !retroId) {
      this.errorLogger.logError(
        'addFailed',
        'RetroMyItemsComponent is not properly initialized',
        { feedback: false },
      );
      return;
    }
    try {
      this.titleControl.setValue((this.titleControl.value as string).trim());
      if (!this.titleControl.valid) {
        return;
      }
      const title = this.titleControl.value as string;
      const request: IAddRetroItemRequest = {
        spaceID,
        meeting: retroId,
        type: question,
        title,
      };
      if (!this.items()) {
        this.items.set([]);
      }

      this.items.set([...(this.items() || []), { ID: '', title }]);
      this.titleControl.setValue('');
      this.retrospectiveService.addRetroItem(request).subscribe(
        () => {
          // console.log(response);
          // const item: IRetroItem = {id: response.id, title: request.title};
          // const items = this.itemsByType[type];
          // if (items) {
          // 	items.push(item);
          // } else {
          // 	this.itemsByType[type] = [item]
          // }
        },
        (err) => {
          this.items.set(
            this.items()?.filter((item) => item.ID || item.title !== title),
          );
          const titleInput = this.titleInput();
          if (titleInput && !titleInput?.value) {
            titleInput.value = title;
          }
          this.errorLogger.logError(err, 'Failed to add a retrospective item');
          if (titleInput) {
            titleInput.ionFocus.emit();
          }
        },
      );
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to add a retrospective item');
    }
  }
}
