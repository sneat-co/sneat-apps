import { JsonPipe } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { IContactBrief } from '@sneat/contactus-core';
import { ContactusTeamService } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IRelatedItem } from '@sneat/dto';
import { ITeamContext } from '@sneat/team-models';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-relate-contact',
	templateUrl: './related-contact.component.html',
	standalone: true,
	imports: [JsonPipe, IonicModule, SneatPipesModule],
})
export class RelatedContactComponent implements OnChanges, OnDestroy {
	@Input({ required: true }) public team?: ITeamContext;
	@Input({ required: true }) public relatedItem?: IIdAndBrief<IRelatedItem>;

	private readonly destroyed = new Subject<void>();

	protected teamContacts?: IIdAndBrief<IContactBrief>[];
	protected contactBrief?: IContactBrief;

	constructor(private readonly contactusTeamService: ContactusTeamService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			const prevTeam = changes['team'].previousValue as
				| ITeamContext
				| undefined;
			const newTeam = changes['team'].currentValue as ITeamContext | undefined;
			if (newTeam && prevTeam?.id !== newTeam?.id) {
				console.log('Team changed');
				this.contactusTeamService
					.watchContactBriefs(newTeam)
					.pipe(takeUntil(this.destroyed))
					.subscribe((briefs) => {
						this.teamContacts = briefs;
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
			this.contactBrief = this.teamContacts?.find(
				(c) => c.id === relatedItemID,
			)?.brief;
		}
	}

	protected goContact(): void {
		console.log('goContact', this.relatedItem);
	}
}
