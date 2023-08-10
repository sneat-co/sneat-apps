import { Component, Input } from '@angular/core';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-member-apps-menu',
	templateUrl: 'member-apps-menu.component.html',
})
export class MemberAppsMenuComponent {
	@Input() team?: ITeamContext;

	public readonly extensions = defaultFamilyMemberExtensions;

	goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
