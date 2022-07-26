import { Component, Input } from '@angular/core';
import { IExpressOrderContext } from '../..';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-order-truckers',
	templateUrl: './order-truckers.component.html',
})
export class OrderTruckersComponent {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
}
