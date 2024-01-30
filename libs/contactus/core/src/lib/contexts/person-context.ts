import {
	IContactGroupBrief,
	IContactGroupDto,
	IMemberBrief,
	IMemberDto,
} from '../dto';
import {
	ITeamItemNavContext,
	ITeamItemWithBriefAndDto,
	Totals,
} from '@sneat/team-models';
import { IPerson, IPersonBrief } from '../dto';

export type IMemberContext = ITeamItemNavContext<IMemberBrief, IMemberDto>;
export type IPersonContext = ITeamItemWithBriefAndDto<IPersonBrief, IPerson>;

export type IMemberGroupContext = ITeamItemNavContext<
	IContactGroupBrief,
	IContactGroupDto
>;

export class Member {
	// TODO - document usage or remove
	public readonly totals: Totals;

	constructor(
		public member: IMemberContext,
		public isChecked = false,
	) {
		this.totals = new Totals(member.dto?.totals);
	}

	public get id(): string {
		return this.member.id;
	}

	public get title(): string {
		return this.member.brief?.title || this.member.id;
	}

	public get emoji(): string {
		return this.member.dto?.ageGroup === 'child' ? '🧒' : '🧑';
	}
}
