import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { virtualSliderAnimations } from '@sneat/components';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext } from '@sneat/team/models';
import { ScheduleTab } from '../../components/schedule/schedule-core';


@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './schedule-page.component.html',
	styleUrls: ['./schedule-page.component.scss'],
	providers: [TeamComponentBaseParams],
	animations: virtualSliderAnimations,
})
export class SchedulePageComponent extends TeamBaseComponent {

	public tab: ScheduleTab = 'day';
	public date = '';
	member?: IMemberContext;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly singleHappeningService: ISingleHappeningService,
		// private readonly slotsProvider: ISlotsProvider,
	) {
		super('SchedulePageComponent', route, params);


		this.route?.queryParamMap.subscribe(queryParams => {
			const tab = queryParams.get('tab') as ScheduleTab;
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
		});
	}

	onTabChanged(tab: ScheduleTab): void {
		this.tab = tab;
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?tab=';
		}
		href = href.replace(
			/tab=\w*/,
			`tab=${this.tab}`,
		);
		history.replaceState(history.state, document.title, href);

	}

	onDateChanged(date: string): void {
		this.date = date;
	}
}


