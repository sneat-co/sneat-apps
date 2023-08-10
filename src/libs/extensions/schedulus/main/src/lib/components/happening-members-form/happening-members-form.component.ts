import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlotParticipant } from '@sneat/dto';
import { contactContextFromBrief } from '@sneat/contactus-services';
import {
	IContactContext,
	IContactusTeamDtoWithID,
	IHappeningContext,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';

@Component({
	selector: 'sneat-happening-members-form',
	templateUrl: 'happening-members-form.component.html',
})
export class HappeningMembersFormComponent {

	@Input() team?: ITeamContext; // TODO: Can we get rid of this?
	@Input() contactusTeam?: IContactusTeamDtoWithID;
	@Input() happening?: IHappeningContext;

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public isToDo = false;
	public checkedMemberIDs: string[] = [];
	public contacts: number[] = [];
	public participantsTab: 'members' | 'others' = 'members';

	public get members(): readonly IContactContext[] | undefined {
		const
			contactusTeam = this.contactusTeam,
			team = this.team;

		if (!team || !contactusTeam) {
			return;
		}
		return zipMapBriefsWithIDs(contactusTeam?.dto?.contacts)
			.map(m => contactContextFromBrief(m, team));
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public isMemberChecked(member: IContactContext): boolean {
		const { id } = member;
		return this.checkedMemberIDs.some(v => v === id);
	}

	public isMemberCheckChanged(member: IContactContext, event: Event): void {
		const ce = event as CustomEvent;
		console.log('isMemberCheckChanged()', ce);
		const checked = ce.detail.value === 'on';
		const { id } = member;
		if (!checked) {
			this.checkedMemberIDs = this.checkedMemberIDs.filter(v => v !== id);
			return;
		}
		if (!this.checkedMemberIDs.some(v => v === id)) {
			this.checkedMemberIDs.push(id);
		}
		this.populateParticipants();
	}

	private readonly emitHappeningChange = () => this.happeningChange.emit(this.happening);

	private populateParticipants(): void {
		if (!this.happening) {
			return;
		}
		const { brief, dto } = this.happening;
		if (!brief || !dto) {
			return;
		}
		const selectedMembers = this.members?.filter(m => this.checkedMemberIDs.some(v => v === m.id)) || [];
		this.happening = {
			...this.happening,
			brief: {
				...brief,
				memberIDs: selectedMembers.map(m => m.id).filter(v => !!v) as string[],
			},
			dto: {
				...dto,
				participants: selectedMembers.map(m => {
					const s: ISlotParticipant = { type: 'member', id: m.id, title: m.brief?.title || m.id };
					return s;
				}),
			},
		};
		this.emitHappeningChange();
	}

	addContact(): void {
		this.contacts.push(1);
	}
}
