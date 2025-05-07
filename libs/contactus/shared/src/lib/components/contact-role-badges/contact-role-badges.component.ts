import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonBadge } from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-contact-role-badges',
	styles: [
		`
			ion-badge {
				font-weight: normal;
				opacity: 0.5;
			}
		`,
	],
	template: `
		@for (r of _roles; track r) {
			<ion-badge color="medium" class="ion-margin-start">{{ r }}</ion-badge>
		}
	`,
	imports: [IonBadge],
})
export class ContactRoleBadgesComponent implements OnChanges {
	private readonly alwaysHide: readonly string[] = [
		'--',
		'creator',
		'contributor',
		'owner',
	];

	@Input({ required: true }) roles?: readonly string[];
	@Input() hideRoles: readonly string[] = this.alwaysHide;

	private hiddenRoles = new Set<string>();
	protected _roles: readonly string[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['hideRoles']) {
			this.hiddenRoles = new Set([...this.hideRoles, ...this.alwaysHide]);
		}
		if (changes['roles'] || changes['hideRoles']) {
			this._roles = this.roles?.filter((r) => !this.hiddenRoles.has(r)) || [];
		}
	}
}
