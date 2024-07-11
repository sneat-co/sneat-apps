import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { virtualSliderAnimations } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { HappeningType } from '@sneat/mod-schedulus-core';
import {
	NewHappeningParams,
	ScheduleNavService,
} from '@sneat/extensions/schedulus/shared';
import {
	emptyScheduleFilter,
	CalendarFilterService,
} from '../../components/calendar-filter.service';
import { ICalendarFilter } from '../../components/calendar/components/calendar-filter/calendar-filter';
import { CalendarComponentModule } from '../../components/calendar/calendar-component.module';
import { CalendarTab } from '../../components/calendar/calendar-component-types';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
	TeamCoreComponentsModule,
} from '@sneat/team-components';
import { IMemberContext } from '@sneat/contactus-core';
import { CalendariumServicesModule } from '../../services';

@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './calendar-page.component.html',
	styleUrls: ['./calendar-page.component.scss'],
	providers: [TeamComponentBaseParams],
	animations: virtualSliderAnimations,
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TeamCoreComponentsModule,
		CalendarComponentModule,
		ContactusServicesModule,
		CalendariumServicesModule,
	],
})
export class CalendarPageComponent extends TeamBaseComponent {
	public tab: CalendarTab = 'day';
	public date = '';
	member?: IMemberContext;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
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

	private filter: ICalendarFilter = emptyScheduleFilter;

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
