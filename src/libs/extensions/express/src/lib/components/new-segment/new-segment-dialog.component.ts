import { Component, Input } from '@angular/core';
import { IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-new-segment-dialog',
	templateUrl: 'new-segment-dialog.component.html'
})
export class NewSegmentDialogComponent {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;
}
