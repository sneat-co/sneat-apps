import {Component} from '@angular/core';
import {AppComponentService} from '@sneat/app';

@Component({
	selector: 'datatug-root', // TODO: for some reason was failing when changed to datatug-root
	templateUrl: 'datatug-app.component.html',
})
export class DatatugAppComponent {
	constructor(
		readonly appComponentService: AppComponentService,
	) {
		appComponentService.initializeApp();
	}
}
