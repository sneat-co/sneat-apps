import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { ContactusServicesModule } from '@sneat/contactus-services';
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
	CalendariumServicesModule,
	CalendarTab,
	// CalendarFilterService,
	// emptyCalendarFilter,
	// ICalendarFilter,
} from '@sneat/extensions-schedulus-shared';
import { SpaceServiceModule } from '@sneat/space-services';

@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './calendar-page.component.html',
	styleUrls: ['./calendar-page.component.scss'],
	providers: [SpaceComponentBaseParams],
	animations: virtualSliderAnimations,
	imports: [
		CommonModule,
		SpacePageTitleComponent,
		// ContactusServicesModule,
		// CalendariumServicesModule,
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
})
export class CalendarPageComponent extends SpaceBaseComponent {
	protected tab: CalendarTab = 'day';
	protected date = '';
	protected member?: IMemberContext;

	constructor(
		// private filterService: CalendarFilterService,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		super('CalendarPageComponent');

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
					this.tab = tab;
					break;
				default:
					// history.replaceState(history.state, document.title, `${location.href}?tab=${this.tab}`);
					break;
			}
		}
		const date = queryParams.get('date');
		if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
			this.date = date;
			// this.activeDay.date = isoStringsToDate(date);
		}
		const memberID = queryParams.get('member');
		if (memberID) {
			// this.filterService.next({ ...this.filter, contactIDs: [memberID] });
		}
	};

	protected onTabChanged(tab: CalendarTab): void {
		this.tab = tab;
		let { href } = location;
		if (!href.includes('?')) {
			href += '?tab=';
		}
		href = href.replace(/tab=\w*/, `tab=${this.tab}`);
		history.replaceState(history.state, document.title, href);
	}

	protected onDateChanged(date: string): void {
		this.date = date;
	}

	protected goNew(type: HappeningType): void {
		if (!this.space) {
			return;
		}
		const params: NewHappeningParams = { type: type };
		this.scheduleNavService.goNewHappening(this.space, params);
	}
}
