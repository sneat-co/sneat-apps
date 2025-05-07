import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-home',
	templateUrl: 'home-page.component.html',
	imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePageComponent
{
}
