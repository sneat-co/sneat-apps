import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { IBoolMetricVal, ITeamDto, ITeamMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRecord } from '@sneat/data';
import { TeamNavService, TeamService } from '@sneat/team-services';

@Component({
	selector: 'sneat-team-metrics',
	templateUrl: './metrics.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class MetricsComponent {
	@Input() public team?: IRecord<ITeamDto>;

	public deletingMetrics: string[] = [];

	private readonly demoMetrics = ['cc', 'bb', 'wfh'];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly navController: NavController,
		public readonly navService: TeamNavService,
	) {}

	public get isDemoMetricsOnly(): boolean {
		const metrics = this.team?.dto?.metrics;
		if (!metrics || metrics.length !== this.demoMetrics.length) {
			return false;
		}
		return !metrics.find((m, i) => m.id !== this.demoMetrics[i]);
	}

	public deleteDemoMetrics(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.team) {
			throw 'no team';
		}
		this.deletingMetrics.push(...this.demoMetrics);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => !this.demoMetrics.includes(v),
			));
		this.teamService.deleteMetrics(this.team.id, this.demoMetrics).subscribe({
			complete,
			error: (err) => {
				complete();
				this.errorLogger.logError(err, 'Failed to delete demo metrics');
			},
		});
	}

	public isDeletingMetric(metric: ITeamMetric): boolean {
		return !!metric.id && this.deletingMetrics.includes(metric.id);
	}

	public deleteMetric(metric: ITeamMetric): void {
		if (!metric.id) {
			throw 'metric has no id';
		}
		if (!this.team) {
			throw 'no team';
		}
		this.deletingMetrics.push(metric.id);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => v !== metric.id,
			));
		this.teamService.deleteMetrics(this.team.id, [metric.id]).subscribe({
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
		if (!this.team) {
			throw 'no team';
		}
		this.navService.navigateToAddMetric(this.navController, this.team);
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
