import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IRecord } from '@sneat/data';
import { ITeamDto, TeamService } from '@sneat/team/models';
import { IScrumDto } from '@sneat/scrumspace/scrummodels';
import { ScrumService } from '@sneat/scrumspace/dailyscrum';
import { NavService } from '@sneat/datatug/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-scrums-history',
	templateUrl: './scrums-history.page.html',
	styleUrls: ['./scrums-history.page.scss'],
})
export class ScrumsHistoryPageComponent {
	public team: IRecord<ITeamDto>;
	public scrums: IRecord<IScrumDto>[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly teamService: TeamService,
		private readonly scrumService: ScrumService,
		private readonly afAuth: AngularFireAuth,
		private readonly navService: NavService,
	) {
		const team = history.state?.team as IRecord<ITeamDto>;
		console.log('team', team);
		if (team?.id) {
			this.team = team;
		} else {
			const id = route.snapshot.queryParamMap.get('team');
			if (id) {
				this.team = { id };
				this.teamService.watchTeam(id).subscribe((teamData) => {
					this.team.dto = teamData;
				});
			}
		}
		if (this.team?.id) {
			this.afAuth.idToken.subscribe((token) => {
				if (token) {
					console.log('token', token);
					setTimeout(() => {
						this.scrumService.getScrums(this.team.id).subscribe({
							next: (scrums) => {
								console.log('scrums', scrums);
								this.scrums = scrums;
							},
							error: (err) =>
								this.errorLogger.logError(err, 'Failed to load scrums'),
						});
					}, 1000);
				}
			});
		}
	}

	goScrum(scrum: IRecord<IScrumDto>): void {
		this.navService.navigateToScrum(scrum.id, this.team, scrum);
	}
}
