import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-order-segments',
	templateUrl: './order-segments.component.html',
})
export class OrderSegmentsComponent {
	@Input({ required: true }) team?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
}
