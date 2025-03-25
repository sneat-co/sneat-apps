import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserRequiredFieldsService } from '@sneat/auth-ui';
import { SpaceType } from '@sneat/core';
import { ICreateSpaceRequest, ISpaceContext } from '@sneat/space-models';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { SneatBaseComponent } from '@sneat/ui';
import { first } from 'rxjs';

@Component({
	selector: 'sneat-spaces-list',
	templateUrl: 'spaces-list.component.html',
	imports: [
		IonicModule, // TODO: import standalone Ionic components
		RouterLink,
		TitleCasePipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacesListComponent extends SneatBaseComponent {
	// Inputs
	@Input({ required: true }) userID?: string;
	@Input({ required: true }) spaces?: ISpaceContext[];
	@Input() pathPrefix = '/space';

	// Outputs
	@Output() readonly beforeNavigateToSpace = new EventEmitter<ISpaceContext>();

	constructor(
		readonly userService: SneatUserService,
		private readonly spaceNavService: SpaceNavService,
		private readonly spaceService: SpaceService,
		private readonly userRequiredFieldsService: UserRequiredFieldsService,
	) {
		super('SpacesListComponent');
	}

	protected goSpace(event: Event, space: ISpaceContext): boolean {
		event.stopPropagation();
		event.preventDefault();
		if (space.id) {
			this.navigateToSpace(space);
		} else if (space.type) {
			this.createNewSpace(space.type);
		}
		return false;
	}

	private navigateToSpace(space: ISpaceContext): void {
		this.beforeNavigateToSpace.emit(space);
		this.spaceNavService
			.navigateToSpace(space)
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to teams overview page from teams menu',
				),
			);
	}

	protected createNewSpace(type: SpaceType): boolean {
		const request: ICreateSpaceRequest = {
			type,
		};

		this.userService.userState
			.pipe(first(), this.takeUntilDestroyed())
			.subscribe({
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
		// this.closeMenu();
		return false;
	}

	private createSpace(request: ICreateSpaceRequest): void {
		this.spaceService
			.createSpace(request)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (value) => {
					console.log('Space created:', value);
					this.navigateToSpace(value);
				},
				error: this.errorLogger.logErrorHandler(
					'failed to create a new family team',
				),
			});
	}
}
