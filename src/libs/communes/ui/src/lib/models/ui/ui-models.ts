import { DtoTotal, DtoTotals } from "../dto/dto-models";
import { CommuneType, Period } from "../types";
import { IAssetDtoGroup, IAssetDtoGroupCounts } from "../dto/dto-asset";
import { ICommuneCounts, ICommuneDto, newCommuneCounts } from "../dto/dto-commune";
import { IMemberDto, IMemberGroupDto, IMemberGroupDtoCounts } from "../dto/dto-member";
import { DtoGroupTerms } from "../dto/dto-term";
import { ICommuneIds } from "../commune-ids";
import { RxRecordKey } from "@sneat/rxstore";

export class Total {
	constructor(
		public readonly dto?: DtoTotal,
	) {
		if (!dto) {
			this.dto = { count: 0 };
		}
	}

	public get count(): number {
		return this.dto ? this.dto.count : 0;
	}

	public per(period: Period): number {
		switch (period) {
			case "month":
				return this.perMonth();
			case "year":
				return this.perYear();
			case "quarter":
				return this.perQuarter();
			case "week":
				return this.perWeek();
			case "day":
				return this.perDay();
			default:
				throw new Error(`unknown period: ${period}`);
		}
	}

	public perDay(): number {
		if (!this.dto) {
			return 0;
		}
		let result = 0;
		if (this.dto.day !== undefined) {
			result += this.dto.day;
		}
		if (this.dto.week !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.week / 7);
		}
		if (this.dto.month !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.month / 30);
		}
		if (this.dto.quarter !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.quarter / 61);
		}
		if (this.dto.year !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.year / 365);
		}
		return result;
	}

	public perWeek(): number {
		if (!this.dto) {
			return 0;
		}
		let result = 0;
		if (this.dto.week !== undefined) {
			result += this.dto.week;
		}
		if (this.dto.month !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.month / 4.33);
		}
		if (this.dto.day !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.day * 7;
		}
		if (this.dto.quarter !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.quarter / 13);
		}
		if (this.dto.year !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.year / 52);
		}
		return result;
	}

	public perMonth(): number {
		if (!this.dto) {
			return 0;
		}
		let result = 0;
		if (this.dto.month !== undefined) {
			result += this.dto.month;
		}
		if (this.dto.day !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.day * 30;
		}
		if (this.dto.week !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.week * 4.33;
		}
		if (this.dto.year !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.year / 12);
		}
		if (this.dto.quarter !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.quarter / 3);
		}
		return result;
	}

	public perQuarter(): number {
		if (!this.dto) {
			return 0;
		}
		let result = 0;
		if (this.dto.quarter !== undefined) {
			result += this.dto.quarter;
		}
		if (this.dto.day !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.day * 61;
		}
		if (this.dto.week !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.week * 13;
		}
		if (this.dto.month !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.month * 3;
		}
		if (this.dto.year !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += Math.round(this.dto.year / 4);
		}
		return result;
	}

	public perYear(): number {
		if (!this.dto) {
			return 0;
		}
		let result = 0;
		if (this.dto.year !== undefined) {
			result += this.dto.year;
		}
		if (this.dto.day !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.day * 365;
		}
		if (this.dto.week !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.week * 52;
		}
		if (this.dto.month !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.month * 12;
		}
		if (this.dto.quarter !== undefined) {
			// tslint:disable-next-line:no-magic-numbers
			result += this.dto.quarter * 4;
		}
		return result;
	}
}

export class Totals {
	readonly incomes: Total;
	readonly expenses: Total;

	constructor(
		dtoTotals?: DtoTotals,
	) {
		this.incomes = new Total(dtoTotals ? dtoTotals.incomes : undefined);
		this.expenses = new Total(dtoTotals ? dtoTotals.expenses : undefined);
	}

	get count(): number {
		return this.incomes.count + this.expenses.count;
	}

	isPositive(period: Period): boolean {
		return this.per(period, true, true) > 0;
	}

	isNegative(period: Period): boolean {
		return this.per(period, true, true) < 0;
	}

	per(period: Period, incomes: boolean = true, expense: boolean = true): number {
		if (incomes && expense) {
			return this.incomes.per(period) - this.expenses.per(period);
		}
		if (incomes) {
			return this.incomes.per(period);
		}
		if (expense) {
			return -this.expenses.per(period);
		}
		return 0;
	}

	balance(per: "month" | "day"): number {
		switch (per) {
			case "month":
				// tslint:disable-next-line:no-magic-numbers
				return Math.round((this.incomes.perMonth() - this.expenses.perMonth()) * 100) / 100;
			case "day":
				// tslint:disable-next-line:no-magic-numbers
				return Math.round((this.incomes.perDay() - this.expenses.perDay()) * 100) / 100;
			default:
				throw new Error(`Unknown parameter value: ${per}`);
		}
	}
}

export class Member {
	public readonly totals: Totals;

	constructor(
		public dto: IMemberDto,
		public isChecked: boolean = false,
	) {
		this.totals = new Totals(dto.totals);
	}

	public get id(): RxRecordKey | undefined {
		return this.dto.id;
	}

	public get title(): string | undefined {
		return this.dto.title;
	}

	public get emoji(): string {
		return this.dto.age === "child" ? "🧒" : "🧑";
	}
}


export class AssetGroup {
	public readonly totals: Totals;

	constructor(
		public dto: IAssetDtoGroup,
	) {
		this.totals = new Totals(dto.totals);
	}

	public get numberOf(): IAssetDtoGroupCounts {
		return this.dto.numberOf || {};
	}
}

export interface ICommune {
	readonly dto: ICommuneDto;
	readonly shortId?: string;
}

export class Commune implements ICommune {

	constructor(
		public readonly dto: ICommuneDto,
		public readonly shortId?: string,
	) {
		this.totals = new Totals(dto.totals);
	}

	public get ids(): ICommuneIds {
		return { real: this.dto.id, short: this.shortId };
	}

	public get id(): string | undefined {
		return this.dto.id;
	}

	public get type(): CommuneType {
		return this.dto.type;
	}

	public get title(): string | undefined {
		return this.dto.title;
	}

	public get isSupportingMemberGroups(): boolean {
		const t = this.dto.type;
		return t === "educator" || t === "sportclub" || t === "cohabit";
	}

	public get numberOf(): ICommuneCounts {
		if (this.dto.numberOf) {
			return this.dto.numberOf;
		}
		return newCommuneCounts(this.dto.numberOf);
	}

	public get membersCountByRole(): { role: string; count: number }[] {
		if (!this._membersCountByRole) {
			const byRole = this.numberOf.membersByRole;
			if (!byRole) {
				return [];
			}
			this._membersCountByRole = Object.entries(byRole)
				.map(item => ({ role: item[0], count: item[1] }));

		}
		return this._membersCountByRole;
	}

	public readonly totals: Totals;

	private _membersCountByRole?: { role: string; count: number }[];

	public supports(v: "staff" | "pupils"): boolean {
		if (!v) {
			return false;
		}
		switch (v) {
			case "staff":
				return this.type === "educator" || this.type === "realtor";
			case "pupils":
				return this.type === "educator";
			default:
				break;
		}
		return false;
	}
}

export class MemberGroup {
	constructor(
		public readonly dto: IMemberGroupDto,
	) {
	}

	public get numberOf(): IMemberGroupDtoCounts {
		const n = this.dto.numberOf || {};
		if (!n.members) {
			n.members = 0;
		}
		return n;
	}

	public get communeId(): string | undefined {
		return this.dto.communeId;
	}

	public get id(): string | undefined {
		return this.dto.id;
	}

	public get title(): string {
		return this.dto.title;
	}

	public get terms(): DtoGroupTerms {
		return this.dto.terms || {};
	}
}
