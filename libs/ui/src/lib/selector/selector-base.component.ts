import {
	Directive,
	inject,
	InjectionToken,
	Input,
	signal,
} from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { SneatBaseComponent } from '../components/sneat-base.component';

export const OverlayController = new InjectionToken<
	ModalController | PopoverController
>('OverlayController');

@Directive()
export abstract class SelectorBaseComponent<T> extends SneatBaseComponent {
	@Input() public selectMode?: 'single' | 'multiple';

	protected readonly overlayController = inject(OverlayController);

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
	protected get modalController() {
		return this.overlayController as ModalController;
	}
}
