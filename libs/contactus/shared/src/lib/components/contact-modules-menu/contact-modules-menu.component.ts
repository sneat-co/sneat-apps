import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	defaultFamilyMemberExtensions,
	IIdAndBrief,
	ISneatExtension,
} from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	imports: [CommonModule, IonicModule],
})
export class ContactModulesMenuComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) public contact?: IIdAndBrief<IContactBrief>;

	public readonly extensions = defaultFamilyMemberExtensions;

	goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
