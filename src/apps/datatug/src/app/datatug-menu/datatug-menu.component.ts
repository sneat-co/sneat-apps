import {Component, Inject} from '@angular/core';
import {AuthStates, SneatAuthStateService} from "@sneat/auth";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

@Component({
	selector: 'datatug-menu',
	templateUrl: './datatug-menu.component.html',
})
export class DatatugMenuComponent {

	public authState: AuthStates;

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly sneatAuthStateService: SneatAuthStateService,
	) {
		sneatAuthStateService.authState.subscribe({
			next: authState => this.authState = authState,
			error: this.errorLogger.logErrorHandler('failed to get auth stage'),
		})
	}

}
