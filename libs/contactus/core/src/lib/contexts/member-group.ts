import {
	DtoGroupTerms,
	IContactGroupBrief,
	IContactGroupDbo,
	IContactGroupDtoCounts,
} from '../dto';
import { IMemberGroupContext } from '.';

export class MemberGroup {
	public readonly id: string;
	public readonly dto?: IContactGroupDbo | null;
	public readonly brief?: IContactGroupBrief | null;

	constructor(memberGroup: IMemberGroupContext) {
		this.id = memberGroup.id;
		this.brief = memberGroup.brief;
		this.dto = memberGroup.dbo;
	}

	public get numberOf(): IContactGroupDtoCounts {
		const n = this.dto?.numberOf || {};
		if (!n.members) {
			n.members = 0;
		}
		return n;
	}

	public get title(): string {
		return this.brief?.title || '';
	}

	public get terms(): DtoGroupTerms {
		return this.dto?.terms || {};
	}
}
