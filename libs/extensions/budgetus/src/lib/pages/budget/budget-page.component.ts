import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Member } from '@sneat/contactus-core';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { AssetGroup } from '@sneat/mod-assetus-core';
import { ICalendariumSpaceDbo, RepeatPeriod } from '@sneat/mod-schedulus-core';
import {
  SpaceBaseComponent,
  SpaceComponentBaseParams,
} from '@sneat/space-components';
import { Totals } from '@sneat/space-models';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { LiabilitiesMode } from './budget-component-types';
import { BudgetPeriodsComponent } from './budget-periods.component';

import { CalendariumSpaceService } from '@sneat/extensions-schedulus-shared';

@Component({
  imports: [
    ContactusServicesModule,
    BudgetPeriodsComponent,
    SpaceServiceModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonList,
  ],
  providers: [
    { provide: ClassName, useValue: 'BudgetPageComponent' },
    SpaceComponentBaseParams,
    CalendariumSpaceService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-budget-page',
  templateUrl: './budget-page.component.html',
})
export class BudgetPageComponent extends SpaceBaseComponent {
  private readonly calendariumSpaceService = inject(CalendariumSpaceService);

  protected readonly $total = signal<number | undefined>(undefined);
  protected readonly $liabilitiesMode = signal<LiabilitiesMode>('expenses');

  protected $activePeriod = signal<RepeatPeriod>('weekly');

  // public showIncomes: boolean = true;
  // public showExpenses: boolean = true;

  protected assetGroups: AssetGroup[] | undefined;

  protected members: Member[] | undefined;

  public get totals(): Totals | undefined {
    return undefined;
  }

  constructor() {
    super();
    this.route.queryParamMap.subscribe((qp) => {
      const tab = qp.get('tab');
      if (tab === 'incomes' || tab === 'expenses') {
        this.$liabilitiesMode.set(tab);
      }
    });
  }

  protected readonly $calendariumSpaceDbo = signal<
    ICalendariumSpaceDbo | undefined
  >(undefined);

  protected override onSpaceIdChanged(): void {
    if (!this.space.id) {
      return;
    }
    this.calendariumSpaceService
      .watchSpaceModuleRecord(this.space?.id)
      .pipe(this.takeUntilDestroyed(), takeUntil(this.spaceIDChanged$))
      .subscribe({
        next: (spaceCalendarium) => {
          this.$calendariumSpaceDbo.set(spaceCalendarium.dbo || undefined);
        },
      });
  }

  protected $showIncomes = computed(() => {
    const lm = this.$liabilitiesMode();
    return lm === 'incomes' || lm === 'balance';
  });

  protected readonly $showExpenses = computed(() => {
    const lm = this.$liabilitiesMode();
    return lm === 'expenses' || lm === 'balance';
  });

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

  public memberBalance(_m: Member): number {
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

  protected liabilitiesModeChanged(ev: Event): void {
    this.$liabilitiesMode.set((ev as CustomEvent).detail.value);
    history.replaceState(
      undefined,
      document.title,
      location.href.indexOf('tab=') > 0
        ? location.href.replace(/tab=\w+/, `tab=${this.$liabilitiesMode}`)
        : `${location.href}&tab=${this.$liabilitiesMode}`,
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
