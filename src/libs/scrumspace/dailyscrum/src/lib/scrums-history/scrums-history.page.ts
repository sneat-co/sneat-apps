import {Component, Inject, OnInit} from '@angular/core';
import {IRecord, IScrum, ITeam} from '../../models/interfaces';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../services/team.service';
import {ScrumService} from '../../services/scrum.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavService} from '../../services/nav.service';

@Component({
	selector: 'sneat-scrums-history',
	templateUrl: './scrums-history.page.html',
	styleUrls: ['./scrums-history.page.scss'],
})
export class ScrumsHistoryPage implements OnInit {

	public team: IRecord<ITeam>;
	public scrums: IRecord<IScrum>[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly teamService: TeamService,
		private readonly scrumService: ScrumService,
		private readonly afAuth: AngularFireAuth,
		private readonly navService: NavService,
	) {
		const team = history.state?.team as IRecord<ITeam>;
		console.log('team', team);
		if (team?.id) {
			this.team = team;
		} else {
			const id = route.snapshot.queryParamMap.get('team');
			if (id) {
				this.team = {id};
				this.teamService.watchTeam(id).subscribe(teamData => {
					this.team.data = teamData;
				});
			}
		}
		if (this.team?.id) {
			this.afAuth.idToken.subscribe(token => {
				if (token) {
					console.log('token', token);
					setTimeout(() => {
						this.scrumService
							.getScrums(this.team.id)
							.subscribe({
								next: scrums => {
									console.log('scrums', scrums);
									this.scrums = scrums;
								},
								error: err => this.errorLogger.logError(err, 'Failed to load scrums'),
							});
					}, 1000);
				}
			});
		}
	}

	ngOnInit() {
	}

	goScrum(scrum: IRecord<IScrum>): void {
		this.navService.navigateToScrum(scrum.id, this.team, scrum);
	}
}
