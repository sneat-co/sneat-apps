import {
	ChangeDetectionStrategy,
	Component,
	input,
	Input,
	OnChanges,
	signal,
	SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItemDivider,
	IonLabel,
} from '@ionic/angular/standalone';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import {
	IContactBrief,
	IContactDbo,
	IContactWithBrief,
	IContactWithCheck,
} from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsListComponent } from '../contacts-list';

@Component({
	selector: 'sneat-contact-locations',
	templateUrl: './contact-locations.component.html',
	imports: [
		ContactsListComponent,
		RouterLink,
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLocationsComponent implements OnChanges {
	public readonly $space = input.required<ISpaceContext>();

	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactDbo
	>;

	protected readonly $contactLocations = signal<readonly IContactWithCheck[]>(
		[],
	);

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contact']) {
			const space = this.$space();
			if (!space) {
				return;
			}
			this.$contactLocations.set(
				this.getContactLocations().map((c) => Object.assign(c, { space })),
			);
		}
	}

	private getContactLocations(): IContactWithBrief[] {
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
