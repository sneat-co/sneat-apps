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
import { ClassName } from '@sneat/ui';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	imports: [RouterLink, IonItem, IonLabel, IonButtons, IonButton, IonIcon],
	providers: [{ provide: ClassName, useValue: 'ContactModulesMenuComponent' }],
})
export class ContactModulesMenuComponent extends WithSpaceInput {
	@Input({ required: true }) public contact?: IContactWithBrief;

	public readonly extensions = defaultFamilyMemberExtensions;

	protected goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	protected goNew(event: Event, ext: ISneatExtension): void {
		console.warn('not implemented goNew()', ext);
	}
}
