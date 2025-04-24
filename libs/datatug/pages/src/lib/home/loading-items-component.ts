import { Component, Input } from '@angular/core';
import { IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AuthStatus } from '@sneat/auth-core';

@Component({
	selector: 'sneat-datatug-loading-items',
	templateUrl: 'loading-items-component.html',
	imports: [IonItem, IonIcon, IonLabel],
})
export class LoadingItemsComponent {
	@Input({ required: true }) public authStatus?: AuthStatus;
	@Input({ required: true }) public title?: string;
}
