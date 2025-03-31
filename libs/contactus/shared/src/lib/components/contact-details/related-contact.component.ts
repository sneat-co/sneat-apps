import { JsonPipe } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderIconNamePipe } from '@sneat/components';
import { IContactBrief, IContactWithBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IRelatedItem } from '@sneat/dto';
import { ISpaceContext } from '@sneat/space-models';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-relate-contact',
	templateUrl: './related-contact.component.html',
	imports: [JsonPipe, IonicModule, GenderIconNamePipe],
})
export class RelatedContactComponent implements OnChanges, OnDestroy {
	@Input({ required: true }) public space?: ISpaceContext;
	@Input({ required: true }) public relatedItem?: IIdAndBrief<IRelatedItem>;

	private readonly destroyed = new Subject<void>();

	protected spaceContacts?: IContactWithBrief[];
	protected contactBrief?: IContactBrief;

	constructor(private readonly contactusSpaceService: ContactusSpaceService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['space']) {
			const spaceChanges = changes['space'];
			const prevSpace = spaceChanges.previousValue as ISpaceContext | undefined;
			const newSpace = spaceChanges.currentValue as ISpaceContext | undefined;
			if (newSpace && prevSpace?.id !== newSpace?.id) {
				console.log('Space changed');
				this.contactusSpaceService
					.watchContactBriefs(newSpace.id)
					.pipe(takeUntil(this.destroyed))
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

	public ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
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
