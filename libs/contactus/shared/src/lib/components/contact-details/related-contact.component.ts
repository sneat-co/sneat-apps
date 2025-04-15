import { Component, computed, effect, input, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { GenderIconNamePipe } from '@sneat/components';
import { IContactBrief, IContactWithBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IRelatedItem } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-related-contact',
	templateUrl: './related-contact.component.html',
	imports: [GenderIconNamePipe, IonItem, IonIcon, IonLabel],
})
export class RelatedContactComponent extends WithSpaceInput {
	public $relatedItem = input.required<IRelatedItem | undefined>();

	private subscription?: Subscription;

	protected readonly $spaceContacts = signal<IContactWithBrief[] | undefined>(
		undefined,
	);

	constructor(private readonly contactusSpaceService: ContactusSpaceService) {
		super('RelatedContactComponent');
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

	protected readonly $contactBrief = computed<IContactBrief | undefined>(() => {
		const relatedItem = this.$relatedItem();
		const relatedItemID = relatedItem?.keys[0]?.itemID;
		if (relatedItemID) {
			return this.$spaceContacts()?.find((c) => c.id === relatedItemID)?.brief;
		}
		return undefined;
	});

	protected goContact(): void {
		console.log('goContact', this.$relatedItem);
	}
}
