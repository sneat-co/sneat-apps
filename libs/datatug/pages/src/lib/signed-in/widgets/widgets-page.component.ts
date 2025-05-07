import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-datatug-widgets',
	templateUrl: './widgets-page.component.html',
	imports: [FormsModule, IonHeader, IonToolbar, IonContent, IonTitle],
})
export class WidgetsPageComponent {}
