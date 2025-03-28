import { Directive, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { SneatBaseComponent } from '../components/sneat-base.component';

@Directive()
export abstract class SelectorBaseComponent extends SneatBaseComponent {
	@Input() public selectMode?: 'single' | 'multiple';

	protected constructor(
		className: string,
		protected readonly overlayController: ModalController | PopoverController,
	) {
		super(className);
	}

	protected close(event?: Event): void {
		event?.stopPropagation();
		event?.preventDefault();
		this.overlayController
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to dismiss contact selector modal',
				),
			);
	}
}
