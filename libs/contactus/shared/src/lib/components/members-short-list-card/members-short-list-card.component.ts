import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import { IContactBrief, IContactusSpaceDbo } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { MembersCardHeaderComponent } from '../members-card-header/members-card-header.component';
import { MembersListComponent } from '../members-list';

@Component({
	selector: 'sneat-members-short-list',
	template: `
		<ion-card>
			<sneat-members-card-header
				[space]="space"
				[contactusSpace]="{
					id: space?.id || '',
					dbo: contactusSpaceDbo || null,
				}"
			/>
			<sneat-members-list
				[space]="space"
				[members]="spaceContacts"
			></sneat-members-list>
		</ion-card>
	`,
	imports: [IonCard, MembersListComponent, MembersCardHeaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersShortListCardComponent implements OnChanges {
	@Input({ required: true }) public space?: ISpaceContext;

	@Input({ required: true })
	public contactusSpaceDbo?: IContactusSpaceDbo | null;

	@Input() public role?: string;

	protected spaceContacts?: readonly IIdAndBrief<IContactBrief>[];

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactusSpaceDbo'] || changes['role']) {
			this.spaceContacts = zipMapBriefsWithIDs(
				this.contactusSpaceDbo?.contacts,
			);
		}
	}

	private readonly filterMembers = (
		contacts?: readonly IIdAndBrief<IContactBrief>[],
	): readonly IIdAndBrief<IContactBrief>[] | undefined => {
		return !this.role
			? contacts
			: contacts?.filter((m) => m.brief?.roles?.some((r) => r === this.role));
	};
}
