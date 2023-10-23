//tslint:disable:no-unsafe-any
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Period } from '@sneat/dto';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import { AssetGroup, Member, Totals } from '@sneat/team-models';

type LiabilitiesMode = 'incomes' | 'expenses' | 'balance';

@Component({
	selector: 'sneat-budget-page',
	templateUrl: './budget-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class BudgetPageComponent extends TeamBaseComponent {
	public total?: number;
	public liabilitiesMode: LiabilitiesMode = 'balance';
	// public showIncomes: boolean = true;
	// public showExpenses: boolean = true;

	public assetGroups: AssetGroup[] | undefined;
	public period: Period;
	public members: Member[] | undefined;

	public get totals(): Totals | undefined {
		return undefined;
	}

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly assetGroupsService: IAssetGroupService,
		// private readonly memberService: IMemberService,
	) {
		super('BudgetPageComponent', route, params);
		route.queryParamMap.subscribe((qp) => {
			const tab = qp.get('tab');
			if (tab === 'incomes' || tab === 'expenses') {
				this.liabilitiesMode = tab as LiabilitiesMode;
			}
		});
		this.period = 'month';
	}

	public showIncomes(): boolean {
		return (
			this.liabilitiesMode === 'incomes' || this.liabilitiesMode === 'balance'
		);
	}

	public showExpenses(): boolean {
		return (
			this.liabilitiesMode === 'expenses' || this.liabilitiesMode === 'balance'
		);
	}

	public calcTotal(): void {
		if (!this.assetGroups) {
			return;
		}
		const membersTotal: number = !this.members
			? 0
			: this.members.reduce(
					(s, m) =>
						// tslint:disable-next-line:align
						s +
						m.totals.per(this.period, this.showIncomes(), this.showExpenses()),
					0,
			  );
		this.total =
			this.assetGroups.reduce(
				(s, g) =>
					s +
					g.totals.per(this.period, this.showIncomes(), this.showExpenses()),
				0,
			) + membersTotal;
	}

	public memberBalance(m: Member): number {
		return m.totals.per(this.period, this.showIncomes(), this.showExpenses());
	}

	public goAssetGroup(assetGroup: AssetGroup): void {
		if (!this.team) {
			this.errorLogger.logError(
				'can not navigate to asset group without team context',
			);
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, 'assets-group/' + assetGroup.id, {
				state: { assetGroup: assetGroup.context },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to assets group page',
				),
			);
	}

	liabilitiesModeChanged(ev: Event): void {
		this.liabilitiesMode = (ev as CustomEvent).detail.value;
		history.replaceState(
			undefined,
			document.title,
			location.href.indexOf('tab=') > 0
				? location.href.replace(/tab=\w+/, `tab=${this.liabilitiesMode}`)
				: `${location.href}&tab=${this.liabilitiesMode}`,
		);
		this.calcTotal();
	}

	// periodChanged(period: Period) {
	//     this.period = period;
	//     this.calcTotal();
	// }

	public goNew(): void {
		if (!this.team) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.teamParams.teamNavService.navigateForwardToTeamPage(
			this.team,
			'new-liability',
		);
	}

	readonly trackById = (i: number, item: { id: string } | undefined) =>
		item?.id;

	// private subscribeForAssetGroups(): void {
	// 	console.log('subscribeForAssetGroups', communeId);
	// 	if (!this.team?.id) {
	// 		return;
	// 	}
	// 	this.subscriptions.push(
	// 		this.assetGroupsService.watchByCommuneId(this.team.id)
	// 			.subscribe((assetGroups) => {
	// 				assetGroups.sort((g1, g2) => g1.order - g2.order);
	// 				console.log(`assetGroups(communeId=${communeId}):`, assetGroups);
	// 				this.assetGroups = assetGroups.map(g => new AssetGroup(g));
	// 				if (this.members) {
	// 					this.calcTotal();
	// 				}
	// 			}),
	// 	);
	// 	this.subscriptions.push(
	// 		this.memberService.watchByCommuneId()
	// 			.subscribe(members => {
	// 				this.members = members
	// 					.filter(m => m.totals && (m.totals.incomes && m.totals.incomes.count || m.totals.expenses && m.totals.expenses.count))
	// 					.map(dto => new Member(dto));
	// 				if (this.assetGroups) {
	// 					this.calcTotal();
	// 				}
	// 			}),
	// 	);
	// }
}
