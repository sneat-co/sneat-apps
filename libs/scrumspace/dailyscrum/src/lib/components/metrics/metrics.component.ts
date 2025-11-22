import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonInput,
	IonItem,
	IonLabel,
	IonRange,
	IonText,
	IonToggle,
} from '@ionic/angular/standalone';
import { IMetric } from '../../interfaces';

@Component({
	selector: 'sneat-metrics',
	templateUrl: './metrics.component.html',
	imports: [
		IonLabel,
		IonText,
		FormsModule,
		IonRange,
		IonInput,
		IonItem,
		IonToggle,
	],
})
export class MetricsComponent {
	@Input() public metrics?: IMetric[];

	public hasValue = (m?: IMetric) => !isNaN(m?.value as unknown as number);

	trackById = (_: number, m: IMetric) => m.id;
}
