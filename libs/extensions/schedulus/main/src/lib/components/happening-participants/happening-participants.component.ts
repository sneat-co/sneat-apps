import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	ContactsChecklistComponent,
	ICheckChangedArgs,
	MembersListComponent,
} from '@sneat/contactus-shared';
import { addRelatedItem, getRelatedItemIDs } from '@sneat/dto';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import { contactContextFromBrief } from '@sneat/contactus-services';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { IContactContext, IContactusTeamDtoAndID } from '@sneat/contactus-core';
import {
	HappeningService,
	IHappeningContactRequest,
} from '@sneat/team-services';

@Component({
	selector: 'sneat-happening-participants',
	templateUrl: 'happening-participants.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		MembersListComponent,
		ContactsChecklistComponent,
		FormsModule,
	],
})
export class HappeningParticipantsComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext; // TODO: Can we get rid of this?
	@Input({ required: true }) contactusTeam?: IContactusTeamDtoAndID;
	@Input({ required: true }) happening?: IHappeningContext;

	constructor(private readonly happeningService: HappeningService) {}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(
			'HappeningParticipantsComponent.ngOnChanges()',
			changes,
			this.happening?.dto?.related,
		);
		if (changes['happening']) {
			this.checkedContactIDs = getRelatedItemIDs(
				this.happening?.dto?.related || this.happening?.brief?.related,
				this.team?.id || '',
				'contactus',
				'contacts',
			);
			console.log('checkedContactIDs', this.checkedContactIDs, this.happening);
		}
	}

	public get membersTabLabel(): string {
		return this.team?.brief?.type === 'family'
			? 'Family members'
			: 'Team members';
	}

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public isToDo = false;
	public checkedContactIDs: readonly string[] = [];
	public contacts: number[] = [];
	public tab: 'members' | 'others' = 'members';

	public get members(): readonly IContactContext[] | undefined {
		const contactusTeam = this.contactusTeam,
			team = this.team;

		if (!team || !contactusTeam) {
			return;
		}
		return zipMapBriefsWithIDs(contactusTeam?.dto?.contacts).map((m) =>
			contactContextFromBrief(m, team),
		);
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public isMemberCheckChanged(args: ICheckChangedArgs): void {
		console.log('isMemberCheckChanged()', args);
		this.populateParticipants();
		if (!this.happening?.id || !this.team?.id) {
			return;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID: this.happening?.id,
			contact: { id: args.id },
		};
		const apiCall = args.checked
			? this.happeningService.addParticipant
			: this.happeningService.removeParticipant;
		apiCall.bind(this.happeningService)(request).subscribe({
			next: args.resolve,
			error: args.reject,
		});
	}

	private readonly emitHappeningChange = () =>
		this.happeningChange.emit(this.happening);

	private populateParticipants(): void {
		if (!this.happening) {
			return;
		}
		const { brief, dto } = this.happening;
		if (!brief || !dto) {
			return;
		}
		let happeningBase: IHappeningBase = {
			...(dto || brief),
		};
		this.checkedContactIDs.forEach((contactID) => {
			happeningBase = {
				...happeningBase,
				related: addRelatedItem(
					happeningBase.related,
					this.team?.id || '',
					'contactus',
					'contacts',
					contactID,
				),
			};
		});
		this.happening = {
			...this.happening,
			brief: {
				...(this.happening.brief || {}),
				...happeningBase,
			},
			dto: {
				// TODO: It does not make much sense to update DTO as brief should be enough?
				...(this.happening.dto || {}),
				...happeningBase,
			},
		};
		this.emitHappeningChange();
	}

	addContact(): void {
		this.contacts.push(1);
	}
}
