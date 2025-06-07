import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonSpinner,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { IRecord } from '@sneat/data';
import { ISpaceDbo } from '@sneat/dto';
import { IScrumDbo } from '@sneat/ext-scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceService } from '@sneat/space-services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-scrums-history',
	templateUrl: './scrums-history.page.html',
	styleUrls: ['./scrums-history.page.scss'],
	imports: [
		IonToolbar,
		IonHeader,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonItem,
		IonSpinner,
		IonLabel,
		IonIcon,
		IonButton,
		NgIf,
	],
})
export class ScrumsHistoryPageComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly spaceService = inject(SpaceService);

	public space?: ISpaceContext;
	public scrums?: IRecord<IScrumDbo>[];

	constructor() {
		const route = inject(ActivatedRoute);

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
