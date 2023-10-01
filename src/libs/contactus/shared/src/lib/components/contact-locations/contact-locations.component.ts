import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IBriefAndID, IContactBrief } from "@sneat/dto";
import { IContactContext, ITeamContext, zipMapBriefsWithIDs } from "@sneat/team/models";
import { ContactsListModule } from "../contacts-list";

@Component({
	selector: "sneat-contact-locations",
	templateUrl: "./contact-locations.component.html",
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		ContactsListModule,
		RouterLink,
	],
})
export class ContactLocationsComponent implements OnChanges {

	@Input({ required: true }) public team?: ITeamContext;
	@Input({ required: true }) public contact?: IContactContext;

	public contactLocations?: IContactContext[];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["contact"]) {
			const team = this.team;
			if (!team) {
				return;
			}
			this.contactLocations = this.getContactLocations().map(c => ({ ...c, team }));
		}
	}

	private getContactLocations(): IBriefAndID<IContactBrief>[] {
		return zipMapBriefsWithIDs(this.contact?.dto?.relatedContacts)
			?.map(c => ({
				id: c.id,
				brief: c.brief,
				team: this.team,
			}))?.filter(c => c.brief?.type === "location") || [];
	}
}
