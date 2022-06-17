import { Component, Input, OnInit } from '@angular/core';
import { IFreightContext } from '../../dto/freight';

@Component({
	selector: 'sneat-freight-card',
	templateUrl: './freight-card.component.html',
	styleUrls: ['./freight-card.component.scss'],
})
export class FreightCardComponent {
	@Input() freight?: IFreightContext;
}
