import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ISneatUserState } from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { AuthMenuItemComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { zipMapBriefsWithIDs } from '@sneat/team-models';
import { takeUntil } from 'rxjs/operators';
import { SpaceBaseComponent } from '../space-base-component.directive';
import { SpaceComponentBaseParams } from '../space-component-base-params.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
	standalone: true,
	selector: 'sneat-space-menu',
	templateUrl: './space-menu.component.html',
	styleUrls: ['./space-menu.component.scss'],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		AuthMenuItemComponent,
		ContactusServicesModule,
	],
	providers: [SpaceComponentBaseParams],
})
export class SpaceMenuComponent extends SpaceBaseComponent {
	public spaces?: readonly IIdAndBrief<IUserSpaceBrief>[];

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		private readonly menuCtrl: MenuController,
	) {
		super('TeamMenuComponent', route, params);
		params.userService.userState.pipe(takeUntil(this.destroyed$)).subscribe({
			next: this.trackUserState,
			error: this.errorLogger.logErrorHandler('failed to get user stage'),
		});
	}

	protected goOverview(): boolean {
		if (!this.space) {
			this.errorLogger.logError('no team context');
			return false;
		}
		this.spaceParams.spaceNavService.navigateToSpace(this.space).then((v) => {
			if (v) {
				this.closeMenu();
			}
		});
		return false;
	}

	protected goSpacePage(event: Event, p: string): boolean {
		console.log('TeamMenuComponent.goTeamPage()', p, event);
		event.stopPropagation();
		event.preventDefault();
		this.closeMenu();
		return false;
	}

	protected closeMenu(): void {
		this.menuCtrl.close().catch(this.errorLogger.logError);
	}

	override onSpaceDboChanged(): void {
		super.onSpaceDboChanged();
		// console.log('TeamMenuComponent.onTeamDtoChanged()', this.team?.dto);
	}

	protected spaceLabelClicked(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
	}

	protected isCurrentPage(page: string): boolean {
		if (!this.space) {
			return false;
		}
		const { id } = this.space;
		const idp = '/' + id;
		const { pathname } = location;
		if (page === 'overview') {
			return pathname.endsWith(idp);
		}
		return (
			pathname.endsWith(idp + '/' + page) ||
			pathname.indexOf(idp + '/' + page) > 0
		);
	}

	protected onSpaceSelected(event: Event): void {
		const spaceID = (event as CustomEvent).detail.value as string;

		// console.log('TeamMenuComponent.onTeamSelected', teamID);
		if (spaceID === this.space?.id) {
			return;
		}
		const space = this.spaces?.find((t) => t.id === spaceID);
		if (space) {
			this.spaceContext = space;
			this.spaceNav
				.navigateToSpace(space)
				.catch(
					this.errorLogger.logErrorHandler(
						'Failed to navigate to teams page on current team changed from team menu dropdown',
					),
				);
		}
		this.menuCtrl.close().catch(console.error);
		return;
	}

	private trackUserState = (userState: ISneatUserState): void => {
		// console.log('TeamMenuComponent.trackUserState =>', userState);
		if (userState?.record) {
			this.spaces = zipMapBriefsWithIDs(userState.record.spaces) || [];
		} else {
			this.spaces = undefined;
		}
	};
}
