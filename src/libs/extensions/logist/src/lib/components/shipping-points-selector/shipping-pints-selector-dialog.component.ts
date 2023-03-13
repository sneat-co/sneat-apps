import { Component, Input } from '@angular/core';
import { ILogistOrderContext, IOrderContainer } from '../../dto';

@Component({
	selector: 'sneat-shipping-pints-selector-dialog',
	templateUrl: './shipping-pints-selector-dialog.component.html',
})
export class ShippingPintsSelectorDialogComponent {
	@Input() title = 'Select shipping points for container';
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	protected submit(): void {
		//
	}
}
