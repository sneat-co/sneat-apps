import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth as AngularFireAuth } from '@angular/fire/auth';
import { IRecord } from '@sneat/data';
import { NavService } from '@sneat/ext-datatug-core';
import { ISpaceDbo } from '@sneat/dto';
import { IScrumDbo } from '@sneat/ext-scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceService } from '@sneat/space-services';
import { ScrumService } from '../services/scrum.service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-scrums-history',
	templateUrl: './scrums-history.page.html',
	styleUrls: ['./scrums-history.page.scss'],
	standalone: false,
})
export class ScrumsHistoryPageComponent {
	public space?: ISpaceContext;
	public scrums?: IRecord<IScrumDbo>[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly spaceService: SpaceService,
		route: ActivatedRoute,
		// private readonly scrumService: ScrumService,
		// private readonly afAuth: AngularFireAuth,
		// private readonly navService: NavService,
	) {
		const space = history.state?.team as IRecord<ISpaceDbo>;
		console.log('space', space);
		if (space?.id) {
			this.space = space;
		} else {
			const id = route.snapshot.queryParamMap.get('space');
			if (id) {
				this.space = { id };
				this.spaceService.watchSpace(this.space.id).subscribe((team) => {
					this.space = team;
				});
			}
		}
		if (this.space?.id) {
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

	goScrum(scrum: IRecord<IScrumDbo>): void {
		console.log('goScrum', scrum);
		// this.navService.navigateToScrum(scrum.id, this.team, scrum);
		throw new Error('not implemented');
	}
}
