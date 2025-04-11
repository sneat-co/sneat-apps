import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	input,
	computed,
} from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import { IContactusSpaceDbo, IContactWithBrief } from '@sneat/contactus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { MembersCardHeaderComponent } from '../members-card-header/members-card-header.component';
import { MembersListComponent } from '../members-list';

@Component({
	selector: 'sneat-members-short-list',
	template: `
		<ion-card>
			<sneat-members-card-header
				[$space]="$space()"
				[$contactusSpace]="{
					id: $space().id || '',
					dbo: $contactusSpaceDbo() || null,
				}"
			/>
			<sneat-members-list
				[space]="$space()"
				[members]="$spaceContacts()"
			></sneat-members-list>
		</ion-card>
	`,
	imports: [IonCard, MembersListComponent, MembersCardHeaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersShortListCardComponent {
	public readonly $space = input.required<ISpaceContext>();

	public readonly $contactusSpaceDbo = input.required<
		IContactusSpaceDbo | null | undefined
	>();

	protected readonly $spaceContacts = computed(() =>
		zipMapBriefsWithIDs(this.$contactusSpaceDbo()?.contacts),
	);

	@Input() public role?: string;

	private readonly filterMembers = (
		contacts?: readonly IContactWithBrief[],
	): readonly IContactWithBrief[] | undefined => {
		return !this.role
			? contacts
			: contacts?.filter((m) => m.brief?.roles?.some((r) => r === this.role));
	};
}
