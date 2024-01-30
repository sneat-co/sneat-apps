import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IMeetingMember } from '@sneat/meeting';
import { IRecord } from '@sneat/data';
import { ITeamDto, MemberRoleEnum } from '@sneat/team-models';
import { IRetrospective } from '@sneat/scrumspace/scrummodels';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

interface IRetroCount {
	title: string;
	count: number;
}

interface IMeetingMemberWithCounts extends IMeetingMember {
	counts?: Record<string, IRetroCount>;
}

@Component({
	selector: 'sneat-retro-members',
	templateUrl: './retro-members.component.html',
})
export class RetroMembersComponent implements OnChanges {
	@Input() team: IRecord<ITeamDto>;
	@Input() retrospective: IRecord<IRetrospective>;

	public membersTab: 'participants' | 'spectators' | 'absent' = 'participants';

	public participants: IMeetingMemberWithCounts[];
	public spectators: IMeetingMemberWithCounts[];
	public absents: IMeetingMember[];

	constructor(@Inject(ErrorLogger) private errorLogger: IErrorLogger) {}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges', this.team, this.retrospective);
		try {
			if (changes.retrospective) {
				const retrospective = this.retrospective?.dto;
				if (retrospective) {
					const members = this.retrospective?.dto?.members;
					if (members) {
						this.participants = members.filter((m) =>
							m.roles?.includes(MemberRoleEnum.contributor),
						);
						this.spectators = members?.filter((m) =>
							m.roles?.includes(MemberRoleEnum.spectator),
						);
					}
				}
			}
			if (changes.team) {
				// Check for this.retrospective?.data?.userIDs is not great
				if (this.team?.dto && !this.retrospective?.dto?.userIDs) {
					const { dto } = this.team;
					this.participants = dto.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.contributor),
					);
					this.spectators = dto.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.spectator),
					);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process ngOnChanges event');
		}
	}
}
