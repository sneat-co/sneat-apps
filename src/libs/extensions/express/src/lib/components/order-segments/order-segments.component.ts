import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto';

@Component({
	selector: 'sneat-order-segments',
	templateUrl: './order-segments.component.html',
})
export class OrderSegmentsComponent {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
}
