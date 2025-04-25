import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCard, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-order-segments',
	templateUrl: './order-segments.component.html',
	imports: [IonCard, IonItemDivider, IonLabel, NgIf],
})
export class OrderSegmentsComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
}
