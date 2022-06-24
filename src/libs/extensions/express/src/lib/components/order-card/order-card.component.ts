import { Component, Input, OnInit } from '@angular/core';
import { ContactRoleExpress } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto/order';

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
}
