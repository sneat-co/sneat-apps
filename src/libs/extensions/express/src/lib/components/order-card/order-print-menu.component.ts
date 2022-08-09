import { Component, Inject, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../';

@Component({
	selector: 'sneat-express-order-print-menu',
	templateUrl: './order-print-menu.component.html',
})
export class OrderPrintMenuComponent {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
	) {
	}

	print(event: Event, path: string): void { // TODO: can we dismiss popover declaratively?
		// console.log('print()', path);
		event.stopPropagation();
		this.popoverController.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss popover controller'));
	}
}
