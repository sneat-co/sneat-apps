import {Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import {allUserStoresAsFlatList, IDatatugStoreBriefWithId, IDatatugUser} from "@sneat/datatug/models";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService} from "@sneat/datatug/services/nav";
import {IDatatugStoreContext} from '@sneat/datatug/nav';
import {parseStoreRef} from '@sneat/core';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
	selector: 'datatug-menu-store-selector',
	templateUrl: 'menu-store-selector.component.html'
})
export class MenuStoreSelectorComponent implements OnDestroy, OnChanges {
	@Input() datatugUser?: IDatatugUser;

	currentStoreId?: string;

	stores?: IDatatugStoreBriefWithId[];

	private readonly destroyed = new Subject<void>();

	private externalChange = false;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly nav: DatatugNavService,
		readonly datatugNavContextService: DatatugNavContextService,
	) {
		datatugNavContextService.currentStoreId
			.pipe(
				takeUntil(this.destroyed),
				filter(id => id !== this.currentStoreId && !(id === null && !this.currentStoreId)),
			)
			.subscribe(storeId => {
				console.log('MenuStoreSelectorComponent => external store change:', storeId)
				this.externalChange = true;
				this.currentStoreId = storeId;
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			this.stores = allUserStoresAsFlatList(this.datatugUser?.datatug?.stores);
		}
	}

	switchStore(event: CustomEvent): void {
		console.log('MenuStoreSelectorComponent.switchStore()', this.externalChange, event);
		if (this.externalChange) {
			this.externalChange = false;
			return;
		}
		try {
			const value: string = event.detail.value;
			console.log('value', value);
			if (value) {
				console.log('MenuStoreSelectorComponent.switchStore()', value);
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
