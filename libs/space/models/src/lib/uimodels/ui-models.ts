import { SpaceType } from '@sneat/core';
import { DtoTotal, DtoTotals, Period } from '@sneat/dto';
import { ISpaceContext } from '../space-context';

export class Total {
	constructor(public readonly dto?: DtoTotal) {
		if (!dto) {
			this.dto = { count: 0 };
		}
	}

	public get count(): number {
		return this.dto ? this.dto.count : 0;
	}

	public per(period: Period): number {
		switch (period) {
			case 'month':
				return this.perMonth();
			case 'year':
				return this.perYear();
			case 'quarter':
				return this.perQuarter();
			case 'week':
				return this.perWeek();
			case 'day':
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
			result += Math.round(this.dto.week / 7);
		}
		if (this.dto.month !== undefined) {
			result += Math.round(this.dto.month / 30);
		}
		if (this.dto.quarter !== undefined) {
			result += Math.round(this.dto.quarter / 61);
		}
		if (this.dto.year !== undefined) {
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
			result += Math.round(this.dto.month / 4.33);
		}
		if (this.dto.day !== undefined) {
			result += this.dto.day * 7;
		}
		if (this.dto.quarter !== undefined) {
			result += Math.round(this.dto.quarter / 13);
		}
		if (this.dto.year !== undefined) {
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
			result += this.dto.day * 30;
		}
		if (this.dto.week !== undefined) {
			result += this.dto.week * 4.33;
		}
		if (this.dto.year !== undefined) {
			result += Math.round(this.dto.year / 12);
		}
		if (this.dto.quarter !== undefined) {
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
			result += this.dto.day * 61;
		}
		if (this.dto.week !== undefined) {
			result += this.dto.week * 13;
		}
		if (this.dto.month !== undefined) {
			result += this.dto.month * 3;
		}
		if (this.dto.year !== undefined) {
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
			result += this.dto.day * 365;
		}
		if (this.dto.week !== undefined) {
			result += this.dto.week * 52;
		}
		if (this.dto.month !== undefined) {
			result += this.dto.month * 12;
		}
		if (this.dto.quarter !== undefined) {
			result += this.dto.quarter * 4;
		}
		return result;
	}
}

export class Totals {
	readonly incomes: Total;
	readonly expenses: Total;

	constructor(dtoTotals?: DtoTotals) {
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

	per(period: Period, incomes = true, expense = true): number {
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

	balance(per: 'month' | 'day'): number {
		switch (per) {
			case 'month':
				return (
					Math.round(
						(this.incomes.perMonth() - this.expenses.perMonth()) * 100,
					) / 100
				);
			case 'day':
				return (
					Math.round((this.incomes.perDay() - this.expenses.perDay()) * 100) /
					100
				);
			default:
				throw new Error(`Unknown parameter value: ${per}`);
		}
	}
}

export class Commune implements ISpaceContext {
	public readonly totals: Totals;

	constructor(
		public readonly space: ISpaceContext,
		public readonly shortId?: string,
	) {
		this.totals = new Totals(space.dbo?.totals);
	}

	public get id(): string {
		return this.space.id;
	}

	public get type(): SpaceType | undefined {
		return this.space.dbo?.type;
	}

	public get title(): string | undefined {
		return this.space.dbo?.title;
	}

	// public get isSupportingMemberGroups(): boolean {
	// 	const t = this.team.type;
	// 	return t === 'educator' || t === 'sport_club' || t === 'cohabit';
	// }

	// public get numberOf(): TeamCounts {
	// 	if (this.team.dto?.numberOf) {
	// 		return this.team.dto.numberOf;
	// 	}
	// 	return newTeamCounts(this.team.dto?.numberOf);
	// }

	private _membersCountByRole?: { role: string; count: number }[];

	public get membersCountByRole(): { role: string; count: number }[] {
		throw new Error('Not implemented yet - disabled');
		// if (!this._membersCountByRole) {
		// 	const byRole = this.numberOf.membersByRole;
		// 	if (!byRole) {
		// 		return [];
		// 	}
		// 	this._membersCountByRole = Object.entries(byRole)
		// 		.map(item => ({ role: item[0], count: item[1] as number }));
		// }
		// return this._membersCountByRole;
	}

	public supports(v: 'staff' | 'pupils'): boolean {
		if (!v) {
			return false;
		}
		switch (v) {
			case 'staff':
				return this.type === 'educator' || this.type === 'realtor';
			case 'pupils':
				return this.type === 'educator';
			default:
				break;
		}
		return false;
	}
}
