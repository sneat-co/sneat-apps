import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-contact-role-badges',
	styles: [`
       .sneat-team-member-role {
           font-weight: normal;
           opacity: 0.7;
       }
	`],
	template: `
		<ion-badge *ngFor="let role of displayRoles"
					  class="ion-margin-start sneat-team-member-role"
					  [color]="role === 'contributor' ? 'primary' : 'medium'"
		>
			{{ role }}
		</ion-badge>
	`,
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
	],
})
export class ContactRoleBadgesComponent implements OnChanges {

	private readonly alwaysHide: readonly string[] = ['--', 'creator', 'contributor', 'owner'];

	@Input({ required: true }) roles?: readonly string[];
	@Input() hideRoles: readonly string[] = this.alwaysHide;

	protected hiddenRoles: readonly string[] = [];
	protected displayRoles: readonly string[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['hideRoles']) {
			this.hiddenRoles = [...new Set([...this.hideRoles, ...this.alwaysHide])];
		}
		if (changes['roles'] || changes['hideRoles']) {
			this.displayRoles = this.roles?.filter(r => !this.hiddenRoles.includes(r)) || [];
		}
	}

}
