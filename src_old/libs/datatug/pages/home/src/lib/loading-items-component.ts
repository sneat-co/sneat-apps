import { Component, Input } from '@angular/core';
import { AuthStatus } from '@sneat/auth-core';

@Component({
	selector: 'datatug-loading-items',
	templateUrl: 'loading-items-component.html',
})
export class LoadingItemsComponent {
	@Input() public authStatus: AuthStatus;
	@Input() public title: string;
}
