import { Component, Inject, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ContactRoleExpress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto/order';
import { OrderPrintMenuComponent } from './order-print-menu.component';

@Component({
	selector: 'sneat-express-order-card',
	templateUrl: './order-card.component.html',
	styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	readonly roles: ContactRoleExpress[] = ['buyer', 'consignee', 'agent', 'carrier', 'shipper'];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
	) {
	}

	protected copyNumberToClipboard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const text = this.order?.id;
		if (text) {
			navigator.clipboard.writeText(text)
				.then(() => alert('Order number copied to clipboard: ' + text))
				.catch(err => alert('Error copying order number to clipboard: ' + err));
		}
	}

	protected async showPrintMenu(event: Event): Promise<void> {
		event.stopPropagation();
		event.preventDefault();
		const popover = await this.popoverController.create({
			component: OrderPrintMenuComponent,
			componentProps: {
				team: this.team,
				order: this.order,
			},
		});
		await popover.present(event as MouseEvent);
	}
}
