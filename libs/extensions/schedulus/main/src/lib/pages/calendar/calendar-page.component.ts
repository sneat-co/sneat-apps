import {
	ChangeDetectionStrategy,
	Component,
	signal,
	inject,
} from '@angular/core';
import { ParamMap } from '@angular/router';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { virtualSliderAnimations } from '@sneat/components';
import {
	HappeningType,
	NewHappeningParams,
	ScheduleNavService,
	ScheduleNavServiceModule,
} from '@sneat/mod-schedulus-core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
} from '@sneat/space-components';
import { IMemberContext } from '@sneat/contactus-core';
import {
	CalendarComponent,
	CalendarTab,
} from '@sneat/extensions-schedulus-shared';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';

@Component({
	imports: [
		SpacePageTitleComponent,
		ScheduleNavServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonIcon,
		IonLabel,
		IonButton,
		IonContent,
		IonMenuButton,
		SpaceServiceModule,
		CalendarComponent,
	],
	providers: [
		{ provide: ClassName, useValue: 'CalendarPageComponent' },
		SpaceComponentBaseParams,
	],
	animations: virtualSliderAnimations,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-schedule-page',
	templateUrl: './calendar-page.component.html',
	styleUrls: ['./calendar-page.component.scss'],
})
export class CalendarPageComponent extends SpaceBaseComponent {
	private readonly scheduleNavService = inject(ScheduleNavService);

	protected readonly $tab = signal<CalendarTab>('day');
	protected readonly $date = signal('');
	protected readonly $member = signal<IMemberContext | undefined>(undefined);

	public constructor() {
		super();

		// filterService.filter.subscribe({
		// 	next: (filter) => {
		// 		this.filter = filter;
		// 	},
		// });

		this.route?.queryParamMap.subscribe({
			next: this.onQueryParamsChanged,
		});
	}

	// private filter: ICalendarFilter = emptyCalendarFilter;

	private readonly onQueryParamsChanged = (queryParams: ParamMap) => {
		const tab = queryParams.get('tab') as CalendarTab;
		if (tab) {
			switch (tab) {
				case 'day':
				case 'week':
				case 'recurrings':
				case 'singles':
					this.$tab.set(tab);
					break;
				default:
					// history.replaceState(history.state, document.title, `${location.href}?tab=${this.tab}`);
					break;
			}
		}
		const date = queryParams.get('date');
		if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
			this.$date.set(date);
			// this.activeDay.date = isoStringsToDate(date);
		}
		const memberID = queryParams.get('member');
		if (memberID) {
			// this.filterService.next({ ...this.filter, contactIDs: [memberID] });
		}
	};

	protected onTabChanged(tab: CalendarTab): void {
		this.$tab.set(tab);
		let { href } = location;
		if (!href.includes('?')) {
			href += '?tab=';
		}
		href = href.replace(/tab=.*?(&|$)/, `tab=${tab}`);
		history.replaceState(history.state, document.title, href);
	}

	protected onDateChanged(date: string): void {
		this.$date.set(date);
	}

	protected goNew(type: HappeningType): void {
		if (!this.space) {
			return;
		}
		const params: NewHappeningParams = { type: type };
		this.scheduleNavService.goNewHappening(this.space, params);
	}
}
