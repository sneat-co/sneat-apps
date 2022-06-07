import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlotParticipant } from '@sneat/dto';
import { IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';

@Component({
	selector: 'sneat-happening-members-form',
	templateUrl: 'happening-members-form.component.html',
})
export class HappeningMembersFormComponent {

	@Input() team?: ITeamContext;
	@Input() happening?: IHappeningContext;

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public isToDo = false;
	public checkedMemberIDs: string[] = [];
	public contacts: number[] = [];
	public participantsTab: 'members' | 'others' = 'members';

	public get members(): IMemberContext[] | undefined {
		const team = this.team;
		if (!team) {
			return;
		}
		const members = team.dto?.members;
		if (!members) {
			return undefined;
		}
		return members.map(m => memberContextFromBrief(m, team));
	}

	public readonly id = (i: number, v: { id: string }) => v.id;

	public isMemberChecked(member: IMemberContext): boolean {
		const { id } = member;
		return this.checkedMemberIDs.some(v => v === id);
	}

	public isMemberCheckChanged(member: IMemberContext, event: Event): void {
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
