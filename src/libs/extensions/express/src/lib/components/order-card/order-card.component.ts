import { Component, Input, OnInit } from '@angular/core';
import { IExpressOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-freight-card',
	templateUrl: './order-card.component.html',
	styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
	@Input() freight?: IExpressOrderContext;
}
