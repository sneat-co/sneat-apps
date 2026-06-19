import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { IAssetDocumentContext } from '@sneat/extension-assetus';
import { DocumentsBaseComponent } from '../documents-base.component';

@Component({
  selector: 'sneat-documents-list',
  templateUrl: './documents-list.component.html',
  ...DocumentsBaseComponent.metadata,
  imports: [
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonList,
  ],
})
export class DocumentsListComponent
  extends DocumentsBaseComponent
  implements OnChanges
{
  @Input() public filter = '';
  @Output() public readonly goDoc = new EventEmitter<IAssetDocumentContext>();

  protected filteredDocs?: IAssetDocumentContext[];

  public constructor() {
    super();
  }

  protected readonly trackById = (i: number, record: { id: string }) =>
    record.id;

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('DocumentsListComponent.ngOnChanges', changes, [...this.allDocuments], ''+this.filter);
    if (changes['allDocuments'] || changes['filter']) {
      this.onDocsChanged();
    }
  }

  protected onDocsChanged(): void {
    this.filteredDocs = this.allDocuments;
    const text: string = this.filter;
    this.filteredDocs =
      this.allDocuments?.filter(
        (d) =>
          !text ||
          (d.dbo?.name && d.dbo.name.toLowerCase().includes(text)) ||
          (d.dbo?.type && d.dbo.type.toLowerCase().includes(text)),
      ) || [];
  }
}
