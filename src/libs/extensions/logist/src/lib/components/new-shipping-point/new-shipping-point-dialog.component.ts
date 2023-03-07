import { Component, Input } from '@angular/core';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-new-shipping-point',
	templateUrl: './new-shipping-point-dialog.component.html',
})
export class NewShippingPointDialogComponent {
	@Input() order?: ILogistOrderContext;
}
