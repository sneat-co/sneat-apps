import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonList,
	IonSegment,
	IonSegmentButton,
	IonSelect,
	IonSelectOption,
	IonText,
} from '@ionic/angular/standalone';
import { IColumn, IForeignKey, ITableFull } from '@sneat/ext-datatug-models';

@Component({
	selector: 'sneat-datatug-table-meta-card',
	templateUrl: './table-meta-card.component.html',
	styleUrls: ['./table-meta-card.component.scss'],
	imports: [
		RouterModule,
		IonCard,
		IonItem,
		IonButtons,
		IonButton,
		IonIcon,
		IonLabel,
		IonSelect,
		IonSelectOption,
		IonSegment,
		IonSegmentButton,
		IonBadge,
		NgIf,
		IonList,
		IonItemGroup,
		IonItemDivider,
		IonText,
		FormsModule,
	],
})
export class TableMetaCardComponent {
	@Input() meta?: ITableFull;

	public tab: 'cols' | 'keys' | 'refs' = 'cols';

	public colFk(c: IColumn): IForeignKey | undefined {
		const fks = this.meta?.foreignKeys?.filter((fk) =>
			fk.columns.includes(c.name),
		);
		return fks?.length === 1 ? fks[0] : undefined;
	}
}
