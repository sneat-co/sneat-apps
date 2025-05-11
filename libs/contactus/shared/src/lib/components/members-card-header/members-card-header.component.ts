import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import { IIdAndOptionalDbo } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';

@Component({
	imports: [RouterLink, IonIcon, IonLabel, IonButtons, IonButton, IonItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-members-card-header',
	templateUrl: './members-card-header.component.html',
})
export class MembersCardHeaderComponent {
	public readonly $space = input.required<ISpaceContext>();

	public readonly $contactusSpace =
		input.required<IIdAndOptionalDbo<IContactusSpaceDbo>>();

	constructor(protected readonly spaceNavService: SpaceNavService) {}

	protected goMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const space = this.$space();
		if (space) {
			this.spaceNavService
				.navigateForwardToSpacePage(space, 'members', {
					state: {
						contactusSpace: this.$contactusSpace(),
					},
				})
				.catch(console.error);
		}
	}
}
