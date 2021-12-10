import { Component, Inject, Input } from '@angular/core';
import { TeamService } from '../../../../../services/src/lib/team.service';
import { NavController } from '@ionic/angular';
import { TeamNavService } from '../../../../../services/src/lib/team-nav.service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeam, ITeamMetric } from '@sneat/team/models';
import { IRecord } from '@sneat/data';

@Component({
	selector: 'app-team-metrics',
	templateUrl: './metrics.component.html',
	styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent {
	@Input() public team: IRecord<ITeam>;

	public deletingMetrics: string[] = [];

	private readonly demoMetrics = ['cc', 'bb', 'wfh'];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly navController: NavController,
		public readonly navService: TeamNavService
	) {}

	public get isDemoMetricsOnly(): boolean {
		const metrics = this.team?.data?.metrics;
		if (!metrics || metrics.length !== this.demoMetrics.length) {
			return false;
		}
		return !metrics.find((m, i) => m.id !== this.demoMetrics[i]);
	}

	public deleteDemoMetrics(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.deletingMetrics.push(...this.demoMetrics);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => this.demoMetrics.indexOf(v) < 0
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
		return this.deletingMetrics.indexOf(metric.id) >= 0;
	}

	public deleteMetric(metric: ITeamMetric): void {
		this.deletingMetrics.push(metric.id);
		const complete = () =>
			(this.deletingMetrics = this.deletingMetrics.filter(
				(v) => v !== metric.id
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
		this.navService.navigateToAddMetric(this.navController, this.team);
	}
}
