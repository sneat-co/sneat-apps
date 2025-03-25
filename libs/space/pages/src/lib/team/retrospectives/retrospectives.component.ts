import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ISpaceDbo } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRecord } from '@sneat/data';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceNavService } from '@sneat/space-services';
import { RetroItemType } from '@sneat/scrumspace-scrummodels';

@Component({
	selector: 'sneat-retrospectives',
	templateUrl: './retrospectives.component.html',
	imports: [CommonModule, IonicModule],
})
export class RetrospectivesComponent {
	@Input() public space?: IRecord<ISpaceDbo>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		// private readonly spaceService: SpaceService,
		private readonly userService: SneatUserService, // TODO: replace with user context service
		private readonly navController: NavController,
		public readonly navService: SpaceNavService,
	) {}

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
