import { Component, Input } from '@angular/core';

@Component({
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
			</ion-card-content>
		</ion-card>
	`,
})
export class ForTeamCardComponent {
	@Input() emptyTitle?: string;
	@Input() title?: string;
	@Input() teamType?: 'family' | 'educator' | 'work';

}
