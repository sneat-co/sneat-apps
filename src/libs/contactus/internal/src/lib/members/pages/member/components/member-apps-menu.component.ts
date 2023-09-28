import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-member-apps-menu',
	templateUrl: 'member-apps-menu.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
	],
})
export class MemberAppsMenuComponent {
	@Input({ required: true }) team?: ITeamContext;

	public readonly extensions = defaultFamilyMemberExtensions;

	goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
