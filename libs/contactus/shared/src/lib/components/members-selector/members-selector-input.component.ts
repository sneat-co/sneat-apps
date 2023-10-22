import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	IContactBrief,
	IContactDto,
	IIdAndOptionalBriefAndOptionalDto,
} from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { contactContextFromBrief } from '@sneat/contactus-services';
import {
	IContactContext,
	IContactusTeamDtoAndID,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import { ISelectMembersOptions } from './members-selector.options';
import { MembersSelectorService } from './members-selector.service';

@Component({
	selector: 'sneat-members-selector-input',
	templateUrl: 'members-selector-input.component.html',
})
export class MembersSelectorInputComponent {
	protected contactusTeam?: IContactusTeamDtoAndID;

	@Input({ required: true }) team?: ITeamContext;
	@Input() members?: readonly IContactContext[];

	@Input() max?: number;

	@Input() selectedMembers?: readonly IContactContext[];
	@Output() readonly selectedMembersChange = new EventEmitter<
		readonly IContactContext[]
	>();

	@Output() readonly removeMember = new EventEmitter<IContactContext>();

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
		const team = this.team;
		const contactusTeam = this.contactusTeam;
		if (!contactusTeam || !team) {
			return;
		}
		const options: ISelectMembersOptions = {
			selectedMembers: this.selectedMembers,
			members: zipMapBriefsWithIDs(contactusTeam.dto?.contacts)?.map((m) =>
				contactContextFromBrief(m, team),
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

	onRemoveMember(member: IContactContext): void {
		this.removeMember.emit(member);

		const a: IContactContext = undefined as unknown as IContactContext;
		const b: IIdAndOptionalBriefAndOptionalDto<IContactBrief, IContactDto> = a;
		console.log(b);
	}

	onSelectedMembersChanged(members: readonly IContactContext[]): void {
		console.log('onSelectedMembersChanged()', members);
		this.selectedMembersChange.emit(members);
	}

	clear(): void {
		this.selectedMembers = [];
		this.selectedMembersChange.emit(this.selectedMembers);
	}
}
