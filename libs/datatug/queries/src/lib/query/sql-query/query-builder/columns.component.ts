import { Component } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCheckbox,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonText,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-datatug-qe-columns',
	templateUrl: 'columns.component.html',
	imports: [
		IonItem,
		IonCheckbox,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonText,
		IonList,
		IonCard,
		IonItemDivider,
	],
})
export class ColumnsComponent {
	expanded?: string;
}
