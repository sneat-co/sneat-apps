import { Component, computed, effect, input, signal } from '@angular/core';
import { IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import { IContactWithBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IRelatedItem, IRelatedItemsByModule } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { Subscription } from 'rxjs';
import { RelatedContactComponent } from './related-contact.component';

@Component({
	selector: 'sneat-related-contacts',
	templateUrl: './related-contacts.component.html',
	imports: [IonCard, IonItem, IonLabel, RelatedContactComponent],
})
export class RelatedContactsComponent extends WithSpaceInput {
	public readonly $related = input.required<
		IRelatedItemsByModule | undefined
	>();

	protected readonly $spaceContacts = signal<IContactWithBrief[] | undefined>(
		undefined,
	);

	protected readonly $relatedContacts = computed<
		readonly IRelatedItem[] | undefined
	>(() => {
		const related = this.$related() || {};
		const contactus = related['contactus'];
		return (contactus && contactus['contacts']) || [];
	});

	private subscription?: Subscription;

	constructor(private readonly contactusSpaceService: ContactusSpaceService) {
		super('RelatedContactsComponent');
		let prevSpaceID: string;
		effect(() => {
			const spaceID = this.$spaceID();
			if (spaceID !== prevSpaceID) {
				this.subscription?.unsubscribe();
				prevSpaceID = spaceID;
			}
			if (!spaceID) {
				return;
			}
			this.subscription = this.contactusSpaceService
				.watchContactBriefs(spaceID)
				.pipe(this.takeUntilDestroyed())
				.subscribe((briefs) => {
					this.$spaceContacts.set(briefs);
				});
		});
	}
}
