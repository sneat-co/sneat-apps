import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { IMeetingMember } from "@sneat/meeting";
import { IRecord } from "@sneat/data";
import { ITeam, MemberRoleEnum } from "@sneat/team/models";
import { IRetrospective } from "@sneat/scrumspace/scrummodels";
import { ErrorLogger, IErrorLogger } from "@sneat/logging";

interface IRetroCount {
	title: string;
	count: number;
}

interface IMeetingMemberWithCounts extends IMeetingMember {
	counts?: { [id: string]: IRetroCount };
}

@Component({
	selector: "sneat-retro-members",
	templateUrl: "./retro-members.component.html",
	styleUrls: ["./retro-members.component.scss"],
})
export class RetroMembersComponent implements OnChanges {
	@Input() team: IRecord<ITeam>;
	@Input() retrospective: IRecord<IRetrospective>;

	public membersTab: "participants" | "spectators" | "absent" = "participants";

	public participants: IMeetingMemberWithCounts[];
	public spectators: IMeetingMemberWithCounts[];
	public absents: IMeetingMember[];

	constructor(
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
	) {
	}

	public id = (_: number, member: IMeetingMember) => member.id;

	public ngOnChanges(changes: SimpleChanges): void {
		console.log("ngOnChanges", this.team, this.retrospective);
		try {
			if (changes.retrospective) {
				const retrospective = this.retrospective?.data;
				if (retrospective) {
					const members = this.retrospective?.data?.members;
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
				// Check for this.retrospective?.data?.userIds is not great
				if (this.team?.data && !this.retrospective?.data?.userIds) {
					const { data } = this.team;
					this.participants = data.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.contributor),
					);
					this.spectators = data.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.spectator),
					);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, "Failed to process ngOnChanges event");
		}
	}
}
