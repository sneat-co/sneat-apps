import { Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ISelectItem, SelectorBaseComponent } from '..';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-basic-selector',
	templateUrl: './basic-selector.component.html',
})
export class BasicSelectorComponent extends SelectorBaseComponent implements OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();

	@Input() public items?: Observable<ISelectItem[]>;

	protected allItems?: ISelectItem[];
	protected selectedItem?: ISelectItem;

	private subscription?: Subscription;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(errorLogger, modalController);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['items']) {
			this.subscription?.unsubscribe();
			this.subscription = this.items
				?.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: items => {
						this.allItems = items;
						this.applyFilter();
					},
				});
		}
	}

	private applyFilter(): void {
	}

}
