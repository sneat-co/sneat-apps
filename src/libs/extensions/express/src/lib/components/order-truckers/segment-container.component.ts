import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-segment-container',
	templateUrl: './segment-container.component.html',
})
export class SegmentContainerComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() containerID?: string;

	container?: IOrderContainer;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerID'] || changes['order']) {
			this.container = this.order?.dto?.containers?.find(c => c.id === this.containerID);
		}
	}
}
