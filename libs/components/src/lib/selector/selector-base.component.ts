import { IErrorLogger } from '@sneat/logging';
import { IDismissable } from '../dismissable';

export class SelectorBaseComponent {
	constructor(
		protected readonly errorLogger: IErrorLogger,

		// This expects either ModalController or PopoverController
		protected readonly overlayController: IDismissable,
	) {}

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
