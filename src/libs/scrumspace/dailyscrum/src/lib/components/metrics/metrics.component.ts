import { Component, Input } from '@angular/core';
import { IMetric } from '../../interfaces';

@Component({
	selector: 'sneat-metrics',
	templateUrl: './metrics.component.html',
})
export class MetricsComponent {
	@Input() public metrics?: IMetric[];

	public hasValue = (m?: IMetric) => !isNaN(m?.value as unknown as number);

	trackById = (_: number, m: IMetric) => m.id;
}
