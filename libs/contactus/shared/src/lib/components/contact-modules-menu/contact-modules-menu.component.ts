import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { IContactWithBrief } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	imports: [RouterLink, IonItem, IonLabel, IonButtons, IonButton, IonIcon],
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
