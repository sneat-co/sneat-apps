import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { formNexInAnimation } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceRelatedFormComponent } from '../space-related-form.component';

interface Role {
	checked?: boolean;
	id: string;
	title: string;
	icon: string;
}

@Component({
	selector: 'sneat-roles-form',
	templateUrl: 'roles-form.component.html',
	animations: [formNexInAnimation],
	imports: [CommonModule, IonicModule, FormsModule],
})
export class RolesFormComponent extends SpaceRelatedFormComponent {
	@Input() isActive = false;
	@Input() disabled = false;
	@Input({ required: true }) space?: ISpaceContext;
	roles?: Role[];

	@Output() readonly rolesChange = new EventEmitter<string[]>();

	override onSpaceTypeChanged(team?: ISpaceContext): void {
		switch (team?.type) {
			case 'educator':
				if (location.pathname.includes('staff')) {
					this.roles = [
						{ id: 'teacher', title: 'Teacher', icon: 'person' },
						{ id: 'administrator', title: 'Administrator', icon: 'robot' },
					];
				}
				break;
			default:
				break;
		}
	}

	roleChecked(event: Event): void {
		event.stopPropagation();
		const roles = this.roles
			?.filter((role) => role.checked)
			.map((role) => role.id);
		this.rolesChange.emit(roles);
	}
}
