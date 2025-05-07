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
import { IRecordsetColumn } from '@sneat/ext-datatug-dto';
import { IForeignKey } from '@sneat/ext-datatug-models';

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
