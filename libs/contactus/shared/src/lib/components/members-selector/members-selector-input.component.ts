import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief, IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { contactContextFromBrief } from '@sneat/contactus-services';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { ISelectMembersOptions } from './members-selector.options';
import { MembersSelectorService } from './members-selector.service';

@Component({
	selector: 'sneat-members-selector-input',
	templateUrl: 'members-selector-input.component.html',
	standalone: false,
})
export class MembersSelectorInputComponent {
	protected contactusSpace?: IContactusSpaceDboAndID;

	@Input({ required: true }) space?: ISpaceContext;
	@Input() members?: readonly IIdAndBrief<IContactBrief>[];

	@Input() max?: number;

	@Input() selectedMembers?: readonly IIdAndBrief<IContactBrief>[];
	@Output() readonly selectedMembersChange = new EventEmitter<
		readonly IIdAndBrief<IContactBrief>[]
	>();

	@Output() readonly removeMember = new EventEmitter<
		IIdAndBrief<IContactBrief>
	>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly membersSelectorService: MembersSelectorService,
	) {}

	get selectedMemberID(): string | undefined {
		return (this.selectedMembers && this.selectedMembers[0].id) || undefined;
	}

	selectMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const space = this.space;
		const contactusTeam = this.contactusSpace;
		if (!contactusTeam || !space) {
			return;
		}
		const options: ISelectMembersOptions = {
			selectedMembers: this.selectedMembers,
			members: zipMapBriefsWithIDs(contactusTeam.dbo?.contacts)?.map((m) =>
				contactContextFromBrief(m, space),
			),
			max: this.max,
		};
		this.membersSelectorService
			.selectMembersInModal(options)
			.then((selectedMembers) => {
				this.selectedMembers = selectedMembers;
				this.selectedMembersChange.emit(selectedMembers);
			})
			.catch(
				this.errorLogger.logErrorHandler('Failed to select members in modal'),
			);
	}

	onRemoveMember(member: IIdAndBrief<IContactBrief>): void {
		this.removeMember.emit(member);
	}

	onSelectedMembersChanged(
		members: readonly IIdAndBrief<IContactBrief>[],
	): void {
		console.log('onSelectedMembersChanged()', members);
		this.selectedMembersChange.emit(members);
	}

	clear(): void {
		this.selectedMembers = [];
		this.selectedMembersChange.emit(this.selectedMembers);
	}
}
