import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { IUserTeamBrief, TeamType } from '@sneat/auth-models';
import { SneatUserService } from '@sneat/user';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-for-team-card',
	template: `
		<ion-card>
			<ion-card-header>
				<ion-card-title>
					{{emptyTitle}}
				</ion-card-title>
			</ion-card-header>
			<ion-card-content>
				<ng-content></ng-content>
				<ion-button routerLink="/new-family" [color]="buttonColor" style="text-transform: none">{{buttonText}}</ion-button>
			</ion-card-content>
			<ion-list *ngIf="teams?.length">
				<ion-item-divider color="light">{{itemsTitle}}</ion-item-divider>
				<ion-item *ngFor="let team of teams"
									routerLink="/space/{{team.teamType}}/{{team.id}}">
					<ion-label>{{team.title}}</ion-label>
				</ion-item>
			</ion-list>
		</ion-card>
	`,
})
export class ForTeamCardComponent {
	@Input() emptyTitle?: string;
	@Input() itemsTitle?: string;
	@Input() buttonColor?: string;
	@Input() buttonText?: string;
	@Input() teamTypes?: TeamType[];

	teams?: IUserTeamBrief[];

	constructor(
		userService: SneatUserService,
		changeDetectorRef: ChangeDetectorRef,
	) {

		userService.userState.subscribe({
			next: user => {
				this.teams = user.record?.teams?.filter(t => this.teamTypes?.some(tt => tt === t.teamType));
				changeDetectorRef.markForCheck();
			},
		});
	}
}
