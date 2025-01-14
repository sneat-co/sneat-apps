import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import { IIdAndOptionalDbo } from '@sneat/core';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService } from '@sneat/team-services';

@Component({
	selector: 'sneat-members-card-header',
	templateUrl: './members-card-header.component.html',
	imports: [IonicModule, RouterLink],
})
export class MembersCardHeaderComponent {
	@Input({ required: true }) public space?: ISpaceContext;
	@Input({ required: true })
	public contactusSpace?: IIdAndOptionalDbo<IContactusSpaceDbo>;

	constructor(protected readonly spaceNavService: SpaceNavService) {}

	protected goMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		if (this.space) {
			this.spaceNavService
				.navigateForwardToSpacePage(this.space, 'members', {
					state: {
						contactusSpace: this.contactusSpace,
					},
				})
				.catch(console.error);
		}
	}
}
