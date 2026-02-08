import { Component, Input, inject } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonText,
	NavController,
} from '@ionic/angular/standalone';
import { ISpaceDbo } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceNavService } from '@sneat/space-services';
import { RetroItemType } from '@sneat/ext-scrumspace-scrummodels';

@Component({
	selector: 'sneat-retrospectives',
	templateUrl: './retrospectives.component.html',
	imports: [
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonItem,
		IonText,
	],
})
export class RetrospectivesComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly userService = inject(SneatUserService);
	private readonly navController = inject(NavController);
	readonly navService = inject(SpaceNavService);

	@Input() public space?: IRecord<ISpaceDbo>;

	navigateToCurrentRetro(): void {
		console.log('navigateToCurrentRetro()');
		if (!this.space) {
			this.errorLogger.logError(
				'Can not navigate to retro without having team context',
			);
			return;
		}
		throw new Error('Not implemented');
		// const activeRetroId = this.team?.dto?.active?.retrospective?.id;
		// try {
		// 	this.navService.navigateToRetrospective(
		// 		this.navController,
		// 		this.team,
		// 		activeRetroId || 'upcoming',
		// 	);
		// } catch (e) {
		// 	this.errorLogger.logError(e, 'Failed to navigate to retrospective page');
		// }
	}

	retroCount(itemType: RetroItemType): number {
		const userID = this.userService.currentUserID;
		return (
			(userID
				? this.space?.dbo?.upcomingRetro?.itemsByUserAndType?.[userID]?.[
						itemType
					]
				: 0) || 0
		);
	}
}
