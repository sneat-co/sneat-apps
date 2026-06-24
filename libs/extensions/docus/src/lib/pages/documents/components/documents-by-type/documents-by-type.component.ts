import { NgClass } from '@angular/common';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { listItemAnimations } from '@sneat/core';
import { eq } from '@sneat/core';
import { IAssetDocumentContext } from '@sneat/extension-assetus-contract';
import { DocumentsBaseComponent } from '../documents-base.component';
import { docTypeListItems } from '../../doc-type-presentation';
import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

interface IDocumentType {
  id: string;
  title: string;
  emoji?: string;
  documents?: IAssetDocumentContext[];
  expanded?: boolean;
}

@Component({
  selector: 'sneat-documents-by-type',
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    IonButtons,
    IonItemSliding,
    NgClass,
    IonItemOption,
    IonItemOptions,
    IonButton,
  ],
  templateUrl: './documents-by-type.component.html',
  styleUrls: ['./documents-by-type.component.scss'],
  animations: [listItemAnimations],
  ...DocumentsBaseComponent.metadata,
})
export class DocumentsByTypeComponent
  extends DocumentsBaseComponent
  implements OnChanges
{
  docTypes: IDocumentType[] = docTypeListItems.map((v) => ({ ...v }));

  @Output() goNewDoc = new EventEmitter<string>();
  @Output() goDocType = new EventEmitter<string>();
  @Output() goDoc = new EventEmitter<IAssetDocumentContext>();

  selectDocType(docType: IDocumentType): void {
    this.docTypes.some((v) => {
      if (eq(v.id, docType.id) && !(v.documents && v.documents.length)) {
        this.newDoc(docType);
        return true;
      }
      v.expanded = eq(v.id, docType.id) && !v.expanded;
      return false;
    });
  }

  newDoc(docType: IDocumentType, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.goNewDoc.emit(docType.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'DocumentsListComponent.ngOnChanges',
      changes,
      this.allDocuments && [...this.allDocuments],
    );
    if (changes['allDocuments'] && this.allDocuments) {
      this.onDocsChanged();
    }
  }

  protected onDocsChanged(): void {
    this.docTypes.forEach((dt) => (dt.documents = []));
    // The catch-all 'other' bucket is selected by id (in the live
    // standardDocTypesByID it is no longer guaranteed to be the last entry).
    const other =
      this.docTypes.find((dt) => eq(dt.id, 'other')) ??
      this.docTypes[this.docTypes.length - 1];
    this.allDocuments?.forEach((d) => {
      const docType = this.docTypes.find((dt) => eq(dt.id, d.dbo?.type));
      if (docType) {
        if (!docType.documents) {
          docType.documents = [];
        }
        docType.documents.push(d);
      } else {
        if (!other.documents) {
          other.documents = [];
        }
        other.documents.push(d);
      }
    });
  }
}
