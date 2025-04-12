import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { IContactWithBrief } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-components';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	imports: [IonicModule, RouterLink],
})
export class ContactModulesMenuComponent extends WithSpaceInput {
	@Input({ required: true }) public contact?: IContactWithBrief;

	public readonly extensions = defaultFamilyMemberExtensions;

	public constructor() {
		super('ContactModulesMenuComponent');
	}

	goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
