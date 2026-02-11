import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { IRecord } from '@sneat/data';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Observable } from 'rxjs';

export interface ICardTab {
  id: string;
  title: string;
}

interface IOptionallyTitled {
  id?: string;
  title?: string;
}

@Component({
  selector: 'sneat-card-list',
  templateUrl: './sneat-card-list.component.html',
  imports: [
    RouterModule,
    IonCard,
    IonItem,
    IonIcon,
    IonLabel,
    IonInput,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
    FormsModule,
    IonCardContent,
    IonSkeletonText,
    IonList,
  ],
})
export class SneatCardListComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  @Input() title?: string;
  @Input() isFilterable?: boolean;
  @Input() isLoading?: boolean;
  @Input() items?: { id?: unknown; title?: string }[];
  @Input() create?: (name: string) => Observable<IRecord<IOptionallyTitled>>;
  @Input() itemIcon?: string;
  @Input() tab?: string;
  @Input() tabs?: ICardTab[];
  @Input() noItemsText?: string;
  @Input() getRouterLink: (item: unknown) => string = () =>
    undefined as unknown as string;

  @Output() readonly cardTitleClick = new EventEmitter<void>();
  @Output() readonly itemClick = new EventEmitter<unknown>();
  @Output() readonly tabChanged = new EventEmitter<string>();

  @ViewChild(IonInput, { static: false }) addInput?: IonInput;

  filter = '';

  protected mode: 'list' | 'add' = 'list';
  protected name = '';
  protected isAdding?: boolean;

  protected click(event: Event, item: unknown): void {
    event.preventDefault();
    event.stopPropagation();
    this.itemClick.emit(item);
  }

  protected showAddForm(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.mode = 'add';
    setTimeout(() => {
      console.log(this.addInput);
      if (this.addInput) {
        this.addInput
          ?.setFocus()
          .catch((err) =>
            this.errorLogger.logError(err, 'Failed to set focus'),
          );
      }
    }, 200);
  }

  protected tryCreate(): void {
    this.isAdding = true;
    if (this.create) {
      this.create(this.name.trim()).subscribe({
        next: (item) => {
          this.items?.push(item);
          this.isAdding = false;
          this.mode = 'list';
          this.name = '';
        },
        error: (err) => {
          this.errorLogger.logError(err, 'Failed to create new item');
          this.isAdding = false;
        },
      });
    }
  }
}
