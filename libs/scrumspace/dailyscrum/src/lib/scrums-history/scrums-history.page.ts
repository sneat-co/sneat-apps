import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth as AngularFireAuth } from '@angular/fire/auth';
import { IRecord } from '@sneat/data';
import { NavService } from '@sneat/datatug/core';
import { ITeamDto } from '@sneat/dto';
import { IScrumDto } from '@sneat/scrumspace/scrummodels';
import { ITeamContext } from '@sneat/team/models';
import { TeamService } from '@sneat/team/services';
import { ScrumService } from '../services/scrum.service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-scrums-history',
	templateUrl: './scrums-history.page.html',
	styleUrls: ['./scrums-history.page.scss'],
})
export class ScrumsHistoryPageComponent {
	public team?: ITeamContext;
	public scrums?: IRecord<IScrumDto>[];

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
				this.teamService.watchTeam(this.team).subscribe((team) => {
					this.team = team;
				});
			}
		}
		if (this.team?.id) {
			throw new Error('not implemented');
			// this.afAuth.idToken.subscribe((token) => {
			// 	if (token) {
			// 		console.log('token', token);
			// 		setTimeout(() => {
      //       if (!this.team) {
      //         throw new Error('!this.team');
      //       }
			// 			this.scrumService.getScrums(this.team.id).subscribe({
			// 				next: (scrums) => {
			// 					console.log('scrums', scrums);
			// 					this.scrums = scrums;
			// 				},
			// 				error: (err) =>
			// 					this.errorLogger.logError(err, 'Failed to load scrums'),
			// 			});
			// 		}, 1000);
			// 	}
			// });
		}
	}

	goScrum(scrum: IRecord<IScrumDto>): void {
		console.log('goScrum', scrum);
		// this.navService.navigateToScrum(scrum.id, this.team, scrum);
    throw new Error('not implemented')
	}
}
