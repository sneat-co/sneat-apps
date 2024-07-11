import { NgForOf, NgIf } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { IContactBrief, IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusTeamContextService,
	ContactusTeamService,
} from '@sneat/contactus-services';
import { ContactusModuleBaseComponent } from '@sneat/contactus-shared';
import { IIdAndBrief, IIdAndOptionalDbo } from '@sneat/core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { zipMapBriefsWithIDs } from '@sneat/team-models';

@Component({
	selector: 'sneat-contacts-filter',
	templateUrl: 'contacts-filter.component.html',
	standalone: true,
	imports: [IonicModule, NgForOf, NgIf, SneatPipesModule, FormsModule],
})
export class ContactsFilterComponent
	extends ContactusModuleBaseComponent
	implements OnChanges
{
	// @Input({ required: true }) space?: ITeamContext;

	@Output() readonly contactIDsChange = new EventEmitter<readonly string[]>();

	@Input({ required: true }) contactIDs: readonly string[] = [];

	contactID = '';
	selectedContacts: IIdAndBrief<IContactBrief>[] = [];
	members?: IIdAndBrief<IContactBrief>[];

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		protected contactusTeamService: ContactusTeamService,
	) {
		super('ContactsFilterComponent', route, teamParams, contactusTeamService);
		const contactusTeamContextService = new ContactusTeamContextService(
			teamParams.errorLogger,
			this.destroyed$,
			this.teamIDChanged$,
			contactusTeamService,
		);
		contactusTeamContextService.contactusTeamContext$
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: this.onContactusTeamChanged,
			});
	}

	private onContactusTeamChanged(
		contactusTeam: IIdAndOptionalDbo<IContactusSpaceDbo>,
	): void {
		const contactBriefs = zipMapBriefsWithIDs(
			contactusTeam?.dbo?.contacts,
		)?.map((m) => ({
			...m,
			team: this.space || { id: '' },
		}));
		this.members = contactBriefs.filter((c) =>
			c.brief.roles?.includes('member'),
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsFilterComponent.ngOnChanges()', changes);
		if (changes['contactIDs']) {
			this.setSelectedMembers();
		}
	}

	protected clearMembers(): void {
		this.contactIDs = [];
		this.contactIDsChange.emit(this.contactIDs);
	}

	protected onContactCheckChanged(event: Event): void {
		console.log('ContactsFilterComponent.onContactCheckChanged()', event);
		event.stopPropagation();
		const cs = event as CustomEvent;
		const { checked, value } = cs.detail;
		if (checked === undefined) {
			// a dropdown
			this.contactIDs = this.contactID ? [this.contactID] : [];
		} else if (checked === true) {
			this.contactIDs = [...this.contactIDs, value];
		} else if (checked === false) {
			this.contactIDs = this.contactIDs.filter((id) => id !== value);
		}
		this.setSelectedMembers();
		this.contactIDsChange.emit(this.contactIDs);
	}

	private setSelectedMembers(): void {
		const members = this.members || [];
		this.selectedContacts = this.contactIDs.map(
			(mID) => members.find((m) => m.id == mID) as IIdAndBrief<IContactBrief>,
		);
	}
}
