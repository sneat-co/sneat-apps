import { Component, Input } from '@angular/core';
import { IMetric } from '../../interfaces';

@Component({
	selector: 'app-metrics',
	templateUrl: './metrics.component.html',
	styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent {
	@Input() public metrics: IMetric[];

	public hasValue = (m: IMetric) => !isNaN(m.value);

	trackById = (_, m: IMetric) => m.id;
}
