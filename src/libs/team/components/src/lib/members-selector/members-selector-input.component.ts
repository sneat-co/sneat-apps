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
	@Input() members?: IMemberContext[];

	@Input() max?: number;

	@Input()selectedMembers?: readonly IMemberContext[];
	@Output() readonly selectedMembersChange = new EventEmitter<readonly IMemberContext[]>();

	@Output() readonly removeMember = new EventEmitter<IMemberContext>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly membersSelectorService: MembersSelectorService,
	) {
	}

	get selectedMemberID(): string |undefined {
		return this.selectedMembers && this.selectedMembers[0].id || undefined;
	}

	selectMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (!team) {
			return;
		}
		const options: ISelectMembersOptions = {
			selectedMembers: this.selectedMembers,
			members: team.dto?.members?.map(m => memberContextFromBrief(m, team)),
				max: this.max,
		};
		this.membersSelectorService
			.selectMembersInModal(options)
			.then(selectedMembers => {
				this.selectedMembers = selectedMembers;
				this.selectedMembersChange.emit(selectedMembers);

			})
			.catch(this.errorLogger.logErrorHandler('Failed to select members in modal'));
	}

	onRemoveMember(member: IMemberContext): void {
		this.removeMember.emit(member);
	}

	onSelectedMembersChanged(members: readonly IMemberContext[]): void {
		console.log('onSelectedMembersChanged()', members);
		this.selectedMembersChange.emit(members);
	}

	clear(): void {
		this.selectedMembers = [];
	}
}
