import { Directive, inject, input } from '@angular/core';
import { ErrorLogger } from '@sneat/logging';
import { IDismissable } from '../dismissable';

@Directive()
export abstract class SelectorBaseComponent {
	protected readonly errorLogger = inject(ErrorLogger);

	public readonly selectMode = input<'single' | 'multiple'>();

	constructor(
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
