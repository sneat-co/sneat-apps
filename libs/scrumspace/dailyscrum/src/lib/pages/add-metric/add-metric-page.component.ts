import { Component, Inject } from '@angular/core';
import {
	IRecord,
	ITeam,
	ITeamMetric,
	MetricColor,
} from '../../models/interfaces';
import { TeamService } from '../../services/team.service';
import { NavController, ToastController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat-team/ui-core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'sneat-add-metric',
	templateUrl: './add-metric-page.component.html',
})
export class AddMetricPageComponent {
	public team: ITeam;
	public teamId: string;

	public title = '';
	public type: 'bool' | 'int' | 'options' = 'bool';
	public mode: 'personal' | 'team' = 'personal';
	public trueLabel = 'Yes';
	public trueColor: MetricColor = 'danger';
	public falseColor: MetricColor = 'success';
	public falseLabel = 'No';
	public min?: number;
	public max?: number;

	constructor(
		readonly route: ActivatedRoute,
		private readonly navController: NavController,
		private readonly teamService: TeamService,
		private readonly toastController: ToastController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		this.min = 0;
		const team = window?.history?.state?.team as IRecord<ITeam>;
		if (team) {
			this.teamId = team.id;
			this.team = team.data;
		} else {
			this.teamId = route.snapshot.queryParamMap.get('team');
			this.teamService.getTeam(this.teamId).subscribe({
				next: (teamData) => {
					this.team = teamData;
				},
			});
		}
	}

	public submit(): void {
		if (this.title.trim() === '') {
			this.alert('Title is required');
			return;
		}
		const metric: ITeamMetric = {
			title: this.title,
			mode: this.mode,
			type: this.type,
		};
		switch (metric.type) {
			case 'bool':
				metric.bool = {
					true: {
						label: this.trueLabel,
						color: this.trueColor,
					},
					false: {
						label: this.falseLabel,
						color: this.falseColor,
					},
				};
				break;
			case 'int':
				if (this.min !== undefined) {
					metric.min = this.min;
				}
				if (this.max !== undefined) {
					metric.max = this.max;
				}
				break;
		}
		this.teamService.addMetric(this.teamId, metric).subscribe({
			next: () => {
				this.navController.back();
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to add metric'),
		});
	}

	private alert(message: string): void {
		this.toastController
			.create({
				position: 'middle',
				color: 'tertiary',
				message,
				keyboardClose: true,
				buttons: [{ role: 'cancel', text: 'OK' }],
			})
			.then((toast) => toast.present());
	}
}
