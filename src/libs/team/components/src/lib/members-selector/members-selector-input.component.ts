import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MembersSelectorService } from '@sneat/team/components';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';
import { ISelectMembersOptions } from './member-selector.options';

@Component({
	selector: 'sneat-members-selector-input',
	templateUrl: 'members-selector-input.component.html',
})
export class MembersSelectorInputComponent {

	@Input() team?: ITeamContext;

	@Input() max?: number;

	@Input() selectedMemberIDs?: readonly string[];
	@Output() readonly selectedMemberIDsChange = new EventEmitter<readonly string[]>();

	@Output() readonly removeMember = new EventEmitter<IMemberContext>();

	selectedMembers?: readonly IMemberContext[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly membersSelectorService: MembersSelectorService,
	) {
	}

	selectMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		if (!this.team) {
			return;
		}
		const options: ISelectMembersOptions = {
			team: this.team,
			selectedMemberIDs: this.selectedMemberIDs,
			members: this.team.dto?.members?.map(memberContextFromBrief),
			max: this.max,
		};
		this.membersSelectorService
			.selectMembersInModal(options)
			.then(selectedMembers => {
				this.selectedMembers = selectedMembers;
				this.selectedMemberIDs = selectedMembers.map(m => m.id);
				this.selectedMemberIDsChange.emit(this.selectedMemberIDs);

			})
			.catch(this.errorLogger.logErrorHandler('Failed to select members in modal'));
	}

	onRemoveMember(member: IMemberContext): void {
		this.removeMember.emit(member);
	}
}
