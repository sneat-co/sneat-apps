import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthStatus } from '@sneat/auth-core';

@Component({
	selector: 'sneat-datatug-loading-items',
	templateUrl: 'loading-items-component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class LoadingItemsComponent {
	@Input({ required: true }) public authStatus?: AuthStatus;
	@Input({ required: true }) public title?: string;
}
