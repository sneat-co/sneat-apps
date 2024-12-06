import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { UserRequiredFieldsService } from '@sneat/auth-ui';
import { SpaceType } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateSpaceRequest,
	ISpaceContext,
	spaceContextFromBrief,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
import { SpaceNavService, SpaceService } from '@sneat/team-services';
import { first } from 'rxjs';
import { SpacesListComponent } from '../teams-list';

@Component({
	selector: 'sneat-spaces-menu',
	templateUrl: './spaces-menu.component.html',
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		SpacesListComponent,
	],
	providers: [UserRequiredFieldsService],
})
export class SpacesMenuComponent {
	@Input() spacesLabel = 'Spaces';
	@Input() spaceType?: SpaceType;
	@Input() pathPrefix = '/space';

	protected spaces?: ISpaceContext[];
	protected familySpaces?: ISpaceContext[];
	protected familySpace?: ISpaceContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly spaceService: SpaceService,
		private readonly spaceNavService: SpaceNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
		private readonly userRequiredFieldsService: UserRequiredFieldsService,
	) {
		userService.userState.subscribe({
			next: this.onUserStateChanged,
		});
	}

	public newFamily(event: Event): boolean {
		event.stopPropagation();
		event.preventDefault();

		const request: ICreateSpaceRequest = {
			type: 'family',
			// roles: [TeamMemberType.creator],
		};

		this.userService.userState.pipe(first()).subscribe({
			next: (userState) => {
				if (userState.record) {
					this.createSpace(request);
				} else {
					this.userRequiredFieldsService
						.open()
						.then((modalResult) => {
							if (modalResult) {
								this.createSpace(request);
							}
						})
						.catch(
							this.errorLogger.logErrorHandler(
								'Failed to open user required fields modal',
							),
						);
				}
			},
		});
		this.closeMenu();
		return false;
	}

	private createSpace(request: ICreateSpaceRequest): void {
		this.spaceService.createSpace(request).subscribe({
			next: (value) => {
				console.log('Space created:', value);
				this.navController
					.navigateForward('/space/family/' + value.id)
					.catch(
						this.errorLogger.logErrorHandler(
							'failed to navigate to newly created family team',
						),
					);
			},
			error: this.errorLogger.logErrorHandler(
				'failed to create a new family team',
			),
		});
	}

	public newSpace(): void {
		alert('Creation of a new space is not implemented yet');
	}

	private onUserStateChanged = (user: ISneatUserState): void => {
		console.log('onUserStateChanged', user);
		if (!user?.record) {
			this.spaces = undefined;
			this.familySpaces = undefined;
			this.familySpace = undefined;
			return;
		}

		this.spaces = user?.record?.spaces
			? zipMapBriefsWithIDs(user?.record?.spaces)
					.filter((t) => !this.spaceType || t.brief.type === this.spaceType)
					.map((t) => spaceContextFromBrief(t.id, t.brief))
			: [];

		this.familySpaces = this.spaces?.filter((t) => t.type === 'family') || [];
		this.familySpace =
			this.familySpaces.length === 1 ? this.familySpaces[0] : undefined;

		if (this.familySpace) {
			this.spaces = this.spaces?.filter((t) => t.type !== 'family');
		}
	};

	public closeMenu(): void {
		this.menuController
			.close()
			.catch(this.errorLogger.logErrorHandler('Failed to close teams menu'));
	}
}
