import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-order-segments',
	templateUrl: './order-segments.component.html',
	standalone: false,
})
export class OrderSegmentsComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
}
