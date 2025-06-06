import { Component, Input, inject } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonSpinner,
	IonText,
	NavController,
} from '@ionic/angular/standalone';
import { IBoolMetricVal, ISpaceDbo, ISpaceMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRecord } from '@sneat/data';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

@Component({
	selector: 'sneat-metrics',
	templateUrl: './metrics.component.html',
	imports: [
		IonList,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonSpinner,
		IonCardContent,
		IonCard,
		IonText,
	],
})
export class MetricsComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly spaceService = inject(SpaceService);
	private readonly navController = inject(NavController);
	readonly navService = inject(SpaceNavService);

	@Input() public space?: IRecord<ISpaceDbo>;

	public deletingMetrics: string[] = [];

	private readonly demoMetrics = ['cc', 'bb', 'wfh'];

	public get isDemoMetricsOnly(): boolean {
		const metrics = this.space?.dbo?.metrics;
		if (!metrics || metrics.length !== this.demoMetrics.length) {
			return false;
		}
		return !metrics.find((m, i) => m.id !== this.demoMetrics[i]);
	}

	public deleteDemoMetrics(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.space) {
			throw 'no team';
		}
		this.deletingMetrics.push(...this.demoMetrics);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => !this.demoMetrics.includes(v),
			));
		this.spaceService.deleteMetrics(this.space.id, this.demoMetrics).subscribe({
			complete,
			error: (err) => {
				complete();
				this.errorLogger.logError(err, 'Failed to delete demo metrics');
			},
		});
	}

	public isDeletingMetric(metric: ISpaceMetric): boolean {
		return !!metric.id && this.deletingMetrics.includes(metric.id);
	}

	public deleteMetric(metric: ISpaceMetric): void {
		if (!metric.id) {
			throw 'metric has no id';
		}
		if (!this.space) {
			throw 'no team';
		}
		this.deletingMetrics.push(metric.id);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => v !== metric.id,
			));
		this.spaceService.deleteMetrics(this.space.id, [metric.id]).subscribe({
			error: (err) => {
				complete();
				this.errorLogger.logError(err, 'Failed to delete metric');
			},
			complete,
		});
	}

	goAddMetric(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (!this.space) {
			throw 'no team';
		}
		this.navService.navigateToAddMetric(this.navController, this.space);
	}

	metricColor(v?: IBoolMetricVal): string {
		// Stupid workaround
		return v?.color || '';
	}

	metricLabel(v?: IBoolMetricVal): string {
		// Stupid workaround
		return v?.label || '';
	}
}
