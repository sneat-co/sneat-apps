import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonApp,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenu,
	IonRouterOutlet,
	IonSplitPane,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { BaseAppComponent } from '@sneat/app';

@Component({
	selector: 'sneat-app-root',
	templateUrl: 'sneat-app.component.html',
	imports: [
		IonApp,
		IonSplitPane,
		IonMenu,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonIcon,
		IonText,
		IonContent,
		IonRouterOutlet,
		RouterLink,
	],
})
export class SneatAppComponent extends BaseAppComponent {}
