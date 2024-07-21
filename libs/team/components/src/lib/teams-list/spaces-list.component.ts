import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService, SpaceService } from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-spaces-list',
	templateUrl: 'spaces-list.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, RouterModule],
})
export class SpacesListComponent {
	// Inputs
	@Input({ required: true }) spaces?: ISpaceContext[];
	@Input() pathPrefix = '/space';
	@Input() iconName = 'people-outline';

	// Outputs
	@Output() readonly beforeNavigateToSpace = new EventEmitter<ISpaceContext>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly spaceService: SpaceService,
		private readonly spaceNavService: SpaceNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
	) {}

	protected goSpace(event: Event, team: ISpaceContext): boolean {
		event.stopPropagation();
		this.beforeNavigateToSpace.emit(team);
		this.spaceNavService
			.navigateToSpace(team)
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to teams overview page from teams menu',
				),
			);
		return false;
	}
}
