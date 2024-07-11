import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief, IIdAndBriefAndOptionalDto } from '@sneat/core';
import { IContactBrief, IContactDto } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/team-models';
import { ContactsListModule } from '../contacts-list';

@Component({
	selector: 'sneat-contact-locations',
	templateUrl: './contact-locations.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ContactsListModule, RouterLink],
})
export class ContactLocationsComponent implements OnChanges {
	@Input({ required: true }) public team?: ISpaceContext;
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDto<
		IContactBrief,
		IContactDto
	>;

	public contactLocations?: IIdAndBrief<IContactBrief>[];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contact']) {
			const team = this.team;
			if (!team) {
				return;
			}
			this.contactLocations = this.getContactLocations().map((c) => ({
				...c,
				team,
			}));
		}
	}

	private getContactLocations(): IIdAndBrief<IContactBrief>[] {
		return [];
		// return (
		// 	zipMapBriefsWithIDs<IContactRelationships>(this.contact?.dto?.relatedContacts)
		// 		?.map((c) => ({
		// 			id: c.id,
		// 			brief: c.brief,
		// 			team: this.team,
		// 		}))
		// 		?.filter((c) => c.brief?.type === 'location')
		// 	|| []
		// );
	}
}
