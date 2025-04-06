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
		// we can not inject ModalController in parent as parent takes either modal or popup, use this.overlayController
		super(className, inject(ModalController));
	}

	protected readonly modalController = this
		.overlayController as ModalController;
}
