import { Component, Inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	PopoverController,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-logist-order-print-menu',
	templateUrl: './order-print-menu.component.html',
	imports: [IonItemDivider, IonIcon, IonLabel, IonItem, RouterLink],
})
export class OrderPrintMenuComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
	) {}

	print(event: Event, path: string): void {
		// TODO: can we dismiss popover declaratively?
		console.log('print()', path);
		event.stopPropagation();
		this.popoverController
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to dismiss popover controller',
				),
			);
	}
}
