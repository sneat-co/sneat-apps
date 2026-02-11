import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonBadge,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/angular/standalone';

// TODO: Local minimal copies to avoid dependency on @sneat/datatug-main and break circular build deps
interface IRecordsetColumn {
  name: string;
  title?: string;
  dbType: string; // Using string here to avoid coupling to DbType type from datatug-main
}

interface ITableRef {
  name: string;
  schema: string;
  catalog?: string;
}

interface IForeignKey {
  name: string;
  columns: string[];
  refTable: ITableRef;
}

@Component({
  selector: 'sneat-datatug-cell-popover',
  templateUrl: './cell-popover.component.html',
  imports: [
    RouterModule,
    FormsModule,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonBadge,
    IonText,
  ],
})
export class CellPopoverComponent {
  @Input() column?: IRecordsetColumn;
  @Input() value: unknown;
  @Input() fk?: IForeignKey;

  public tab: 'rec' | 'cols' | 'refs' = 'rec';
}
