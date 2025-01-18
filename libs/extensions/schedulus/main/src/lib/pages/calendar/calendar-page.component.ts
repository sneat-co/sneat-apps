import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
	SpaceCoreComponentsModule,
} from '@sneat/team-components';
import { IMemberContext } from '@sneat/contactus-core';
import {
	CalendarComponentModule,
	CalendariumServicesModule,
	CalendarTab,
	CalendarFilterService,
	emptyCalendarFilter,
	ICalendarFilter,
} from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './calendar-page.component.html',
	styleUrls: ['./calendar-page.component.scss'],
	providers: [SpaceComponentBaseParams],
	animations: virtualSliderAnimations,
	imports: [
		CommonModule,
		IonicModule,
		SpaceCoreComponentsModule,
		CalendarComponentModule,
		ContactusServicesModule,
		CalendariumServicesModule,
		ScheduleNavServiceModule,
	],
})
export class CalendarPageComponent extends SpaceBaseComponent {
	public tab: CalendarTab = 'day';
	public date = '';
	member?: IMemberContext;

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		private filterService: CalendarFilterService,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		super('SchedulePageComponent', route, params);

		filterService.filter.subscribe({
			next: (filter) => {
				this.filter = filter;
			},
		});

		this.route?.queryParamMap.subscribe({
			next: this.onQueryParamsChanged,
		});
	}

	private filter: ICalendarFilter = emptyCalendarFilter;

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
			this.filterService.next({ ...this.filter, contactIDs: [memberID] });
		}
	};

	onTabChanged(tab: CalendarTab): void {
		this.tab = tab;
		let { href } = location;
		if (!href.includes('?')) {
			href += '?tab=';
		}
		href = href.replace(/tab=\w*/, `tab=${this.tab}`);
		history.replaceState(history.state, document.title, href);
	}

	onDateChanged(date: string): void {
		this.date = date;
	}

	goNew(type: HappeningType): void {
		if (!this.space) {
			return;
		}
		const params: NewHappeningParams = { type: type };
		this.scheduleNavService.goNewHappening(this.space, params);
	}
}
