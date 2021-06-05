import {Component, Type} from '@angular/core';
import {AppComponentService} from '@sneat/app';

@Component({
	selector: 'datatug-root',
	templateUrl: 'datatug-app.component.html',
})
export class DatatugAppComponent {

	menu: Promise<Type<any>>;

	constructor(
		readonly appComponentService: AppComponentService,
	) {
		appComponentService.initializeApp();
		this.loadMenu();
	}

	loadMenu(): void {
		if (!this.menu) {
			this.menu = import(`@sneat/datatug/menu`)
				.then(({DatatugMenuComponent}) => DatatugMenuComponent);
		}
	}
}
