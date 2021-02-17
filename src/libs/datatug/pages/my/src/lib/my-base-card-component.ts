import {NavController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {Component, Inject} from '@angular/core';

@Component({
	selector: 'datatug-my-base-card',
	template: '',
})
export class MyBaseCardComponent {

	constructor(
		public readonly navController: NavController,
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
	) {
	}
}
