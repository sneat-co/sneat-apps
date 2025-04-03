import { Directive, inject, Input, signal } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { SneatBaseComponent } from '../components/sneat-base.component';

@Directive()
export abstract class SelectorBaseComponent<T> extends SneatBaseComponent {
	@Input() public selectMode?: 'single' | 'multiple';

	protected constructor(
		className: string,
		protected readonly overlayController: ModalController | PopoverController,
	) {
		super(className);
	}

	protected $selectedItems = signal<readonly T[]>([]);

	protected close(event?: Event): void {
		event?.stopPropagation();
		event?.preventDefault();
		this.overlayController
			.dismiss({ selectedItems: this.$selectedItems() })
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to dismiss contact selector modal',
				),
			);
	}
}

@Directive()
export abstract class SelectorModalComponent<
	T,
> extends SelectorBaseComponent<T> {
	protected constructor(className: string) {
		super(className, inject(ModalController));
	}
}
