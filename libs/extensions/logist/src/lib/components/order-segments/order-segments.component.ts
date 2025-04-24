import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-order-segments',
	templateUrl: './order-segments.component.html',
})
export class OrderSegmentsComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
}
