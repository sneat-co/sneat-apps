import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Member } from '@sneat/contactus-core';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	CalendariumServicesModule,
	CalendariumSpaceService,
} from '@sneat/extensions/schedulus/main';
import { AssetGroup } from '@sneat/mod-assetus-core';
import { ICalendariumSpaceDbo, RepeatPeriod } from '@sneat/mod-schedulus-core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { Totals } from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import { LiabilitiesMode } from './budget-component-types';
import { BudgetPeriodsComponent } from './budget-periods.component';

@Component({
	selector: 'sneat-budget-page',
	templateUrl: './budget-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ContactusServicesModule,
		BudgetPeriodsComponent,
		CalendariumServicesModule,
	],
	providers: [SpaceComponentBaseParams],
})
export class BudgetPageComponent extends SpaceBaseComponent {
	public total?: number;
	public liabilitiesMode: LiabilitiesMode = 'expenses';
	public activePeriod: RepeatPeriod = 'weekly';
	// public showIncomes: boolean = true;
	// public showExpenses: boolean = true;

	public assetGroups: AssetGroup[] | undefined;

	public members: Member[] | undefined;

	public get totals(): Totals | undefined {
		return undefined;
	}

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		private readonly calendariumSpaceService: CalendariumSpaceService,
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
	}

	protected calendariumSpaceDbo?: ICalendariumSpaceDbo;

	override onSpaceIdChanged(): void {
		if (!this.space.id) {
			return;
		}
		this.calendariumSpaceService
			.watchSpaceModuleRecord(this.space?.id)
			.pipe(takeUntil(this.spaceIDChanged$))
			.subscribe({
				next: (teamCalendarium) => {
					this.calendariumSpaceDbo = teamCalendarium.dbo || undefined;
				},
			});
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
		// const membersTotal: number = !this.members
		// 	? 0
		// 	: this.members.reduce(
		// 			(s, m) =>
		// 				s +
		// 				m.totals.per(this.period, this.showIncomes(), this.showExpenses()),
		// 			0,
		// 		);
		// this.total =
		// 	this.assetGroups.reduce(
		// 		(s, g) =>
		// 			s +
		// 			g.totals.per(this.period, this.showIncomes(), this.showExpenses()),
		// 		0,
		// 	) + membersTotal;
	}

	public memberBalance(m: Member): number {
		console.log('memberBalance', m);
		// return m.totals.per(this.period, this.showIncomes(), this.showExpenses());
		return 0;
	}

	public goAssetGroup(assetGroup: AssetGroup): void {
		if (!this.space) {
			this.errorLogger.logError(
				'can not navigate to asset group without team context',
			);
			return;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, 'assets-group/' + assetGroup.id, {
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
		if (!this.space) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, 'new-liability')
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new liability page',
				),
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
