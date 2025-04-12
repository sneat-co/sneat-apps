import { JsonPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderIconNamePipe } from '@sneat/components';
import { IContactBrief, IContactWithBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IRelatedItem } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-relate-contact',
	templateUrl: './related-contact.component.html',
	imports: [JsonPipe, IonicModule, GenderIconNamePipe],
})
export class RelatedContactComponent
	extends WithSpaceInput
	implements OnChanges
{
	@Input({ required: true }) public relatedItem?: IIdAndBrief<IRelatedItem>;

	protected spaceContacts?: IContactWithBrief[];
	protected contactBrief?: IContactBrief;

	constructor(private readonly contactusSpaceService: ContactusSpaceService) {
		super('RelatedContactComponent');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		const spaceChanges = changes['$space'];
		if (spaceChanges) {
			const prevSpace = spaceChanges.previousValue as ISpaceContext | undefined;
			const newSpace = spaceChanges.currentValue as ISpaceContext | undefined;
			if (newSpace && prevSpace?.id !== newSpace?.id) {
				console.log('Space changed');
				this.contactusSpaceService
					.watchContactBriefs(newSpace.id)
					.pipe(this.takeUntilDestroyed())
					.subscribe((briefs) => {
						this.spaceContacts = briefs;
						this.setContactBrief();
					});
			}
		}

		if (changes['relatedItem']) {
			this.setContactBrief();
		}
	}

	private setContactBrief(): void {
		const relatedItemID = this.relatedItem?.id;
		if (relatedItemID) {
			this.contactBrief = this.spaceContacts?.find(
				(c) => c.id === relatedItemID,
			)?.brief;
		}
	}

	protected goContact(): void {
		console.log('goContact', this.relatedItem);
	}
}
