import {Component, Inject, Input, OnChanges, SimpleChanges} from "@angular/core";
import {allUserStoresAsFlatList, IDatatugStoreBriefWithId, IDatatugUser} from "@sneat/datatug/models";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService} from "@sneat/datatug/services/nav";
import {IDatatugStoreContext} from '@sneat/datatug/nav';
import {parseStoreRef} from '@sneat/core';

@Component({
	selector: 'datatug-menu-store-selector',
	templateUrl: 'menu-store-selector.component.html'
})
export class MenuStoreSelectorComponent implements OnChanges {
	@Input() currentStoreId?: string;
	@Input() datatugUser?: IDatatugUser;

	stores?: IDatatugStoreBriefWithId[];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			this.stores = allUserStoresAsFlatList(this.datatugUser?.datatug?.stores);
		}
	}

	switchStore(event: CustomEvent): void {
		console.log('switchStore', event);
		try {
			const value: string = event.detail.value;
			console.log('value', value);
			if (value) {
				console.log('DatatugMenuComponent.switchRepo()', value);
				const store: IDatatugStoreContext = {
					ref: parseStoreRef(value),
					brief: this.stores?.find(store => store.id === value)
				};
				this.nav.goStore(store);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle store switch');
		}
	}

	trackById(store: IDatatugStoreBriefWithId) {
		return store.id;
	}
}
