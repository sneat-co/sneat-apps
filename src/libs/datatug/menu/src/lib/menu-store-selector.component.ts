import {Component, Inject, Input} from "@angular/core";
import {IDatatugUser} from "@sneat/datatug/models";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService} from "@sneat/datatug/services/nav";

@Component({
	selector: 'datatug-menu-store-selector',
	templateUrl: 'menu-store-selector.component.html'
})
export class MenuStoreSelectorComponent {
	@Input() currentStoreId?: string;
	@Input() datatugUser?: IDatatugUser;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	switchStore(event: CustomEvent): void {
		try {
			const {value} = event.detail;
			if (value && !this.currentStoreId) {
				console.log('DatatugMenuComponent.switchRepo()', value);
				this.nav.goStore(value);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle store switch');
		}
	}
}
