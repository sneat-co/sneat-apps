import {Component} from '@angular/core';
import {AppComponentService} from '@sneat/app';
import {DatatugMenuComponent} from "@sneat/datatug/menu";

@Component({
	selector: 'datatug-root',
	templateUrl: 'datatug-app.component.html',
})
export class DatatugAppComponent {

	menu: Promise<typeof DatatugMenuComponent>;

	constructor(
		readonly appComponentService: AppComponentService,
	) {
		appComponentService.initializeApp();
		// this.loadMenu();
	}

	// loadMenu(): void {
	// 	if (!this.menu) {
	// 		this.menu = import(`@sneat/datatug/menu`)
	// 			.then(({ DatatugMenuComponent }) => DatatugMenuComponent);
	// 	}
	// }
}
