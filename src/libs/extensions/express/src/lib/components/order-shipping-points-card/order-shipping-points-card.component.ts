import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IExpressOrderContext } from '../..';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-order-shipping-points-card',
	templateUrl: './order-shipping-points-card.component.html',
})
export class OrderShippingPointsCardComponent {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();
	@Input() readonly = false;

}
