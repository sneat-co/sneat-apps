import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { IContactContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactModulesMenuComponent {
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) public contact?: IContactContext;

	public readonly extensions = defaultFamilyMemberExtensions;

	goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
