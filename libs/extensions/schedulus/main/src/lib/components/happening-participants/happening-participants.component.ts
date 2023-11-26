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
	MembersListComponent,
} from '@sneat/contactus-shared';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import { contactContextFromBrief } from '@sneat/contactus-services';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { IContactContext, IContactusTeamDtoAndID } from '@sneat/contactus-core';
import {
	HappeningService,
	IHappeningMemberRequest,
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
			this.happening?.dto?.participants,
		);
		if (changes['happening']) {
			this.checkedContactIDs = Object.keys(
				this.happening?.dto?.participants || {},
			);
		}
	}

	public get membersTabLabel(): string {
		return this.team?.brief?.type === 'family'
			? 'Family member'
			: 'Team members';
	}

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public isToDo = false;
	public checkedContactIDs: string[] = [];
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

	public isMemberCheckChanged(args: {
		event: CustomEvent;
		id: string;
		checked: boolean;
	}): void {
		console.log('isMemberCheckChanged()', args);
		const { id, checked } = args;
		if (!checked) {
			this.checkedContactIDs = this.checkedContactIDs.filter((v) => v !== id);
			return;
		}
		if (!this.checkedContactIDs.some((v) => v === id)) {
			this.checkedContactIDs.push(id);
		}
		this.populateParticipants();
		if (!this.happening?.id) {
			return;
		}
		if (!this.team?.id) {
			return;
		}
		const request: IHappeningMemberRequest = {
			teamID: this.team.id,
			happeningID: this.happening?.id,
			contactID: id,
		};
		if (args.checked) {
			this.happeningService.addParticipant(request).subscribe({
				next: () => console.log('member added'),
			});
		} else {
			this.happeningService.removeParticipant(request).subscribe({
				next: () => console.log('member added'),
			});
		}
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
			...brief,
			participants: {},
		};
		this.checkedContactIDs.forEach((contactID) => {
			if (!happeningBase.participants) {
				happeningBase = { ...happeningBase, participants: { [contactID]: {} } };
			} else {
				happeningBase.participants[this.team?.id + '_' + contactID] = {}; // TODO: Should be readonly
			}
		});
		this.happening = {
			...this.happening,
			brief: {
				...this.happening.brief,
				...happeningBase,
			},
			dto: {
				// TODO: It does not make much sense to update DTO as brief should be enough?
				...this.happening.dto,
				...happeningBase,
			},
		};
		this.emitHappeningChange();
	}

	addContact(): void {
		this.contacts.push(1);
	}
}
