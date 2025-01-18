import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	HappeningType,
	WeekdayCode2,
	IHappeningContext,
	newEmptyHappeningContext,
} from '@sneat/mod-schedulus-core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { first, takeUntil } from 'rxjs';
import { CalendarBasePage } from '../calendar-base-page';
import { HappeningFormComponent } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		SneatPipesModule,
		HappeningFormComponent,
		ContactusServicesModule,
	],
	providers: [SpaceComponentBaseParams],
})
export class NewHappeningPageComponent extends CalendarBasePage {
	@ViewChild('happeningPageFormComponent')
	happeningPageFormComponent?: HappeningFormComponent;

	protected isToDo: boolean;

	// protected initialHappeningType?: HappeningType;
	protected wd?: WeekdayCode2;
	protected date?: string;

	protected happening?: IHappeningContext;

	constructor(route: ActivatedRoute, params: SpaceComponentBaseParams) {
		super('NewHappeningPageComponent', route, params);
		this.isToDo = location.pathname.includes('/new-task');
		this.date = (history.state.date as string) || '';
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type && this.space && !this.happening) {
			this.createHappeningContext(type);
		}
		route.queryParamMap.pipe(takeUntil(this.destroyed$), first()).subscribe({
			next: (queryParams) => {
				console.log(
					'NewHappeningPage.constructor() => queryParams:',
					queryParams,
				);
				const type = queryParams.get('type');
				if (type !== 'single' && type !== 'recurring') {
					console.warn('unknown happening type passed in URL: type=' + type);
					return;
				}
				if (this.space && !this.happening) {
					this.createHappeningContext(type);
				}
				if (!this.wd) {
					this.wd = queryParams.get('wd') as WeekdayCode2;
				}
				if (!this.date) {
					this.date = queryParams.get('date') || '';
				}
				// if (!this.initialHappeningType) {
				// 	this.initialHappeningType = queryParams.get('type') as HappeningType;
				// }
			},
			error: this.logErrorHandler('failed to get query params'),
		});
		this.spaceChanged$.subscribe({
			next: () => {
				if (this.happening) {
					this.happening = { ...this.happening, space: this.space };
				}
			},
		});
	}

	private createHappeningContext(type: HappeningType): void {
		console.log('createHappeningContext()', type);
		const space = this.space;
		if (!space) {
			throw new Error('!space');
		}
		this.happening = newEmptyHappeningContext(
			space,
			type,
			'appointment',
			'active',
		);
	}

	// TODO(fix): protected onCommuneIdsChanged() {
	//     super.onCommuneIdsChanged();
	//     this.subscriptions.push(this.memberService.watchByCommuneId(this.communeRealId).subscribe(members => {
	//         this.members = members.map(m => new Member(m));
	//         this.members.sort((a, b) => a.title > b.title ? 1 : b.title > a.title ? -1 : 0); // TODO: Decouple
	//         this.adults = this.members.filter(m => m.dto.age === 'adult');
	//         this.kids = this.members.filter(m => m.dto.age === 'child');
	//     }));
	// }

	protected onHappeningChanged(happening: IHappeningContext): void {
		const happeningType = happening.brief?.type;
		const typeChange =
			happeningType && happeningType !== this.happening?.brief?.type;
		this.happening = happening;
		if (typeChange) {
			this.onHappeningTypeChanged(happeningType);
		}
	}

	private onHappeningTypeChanged(happeningType: HappeningType): void {
		console.log('onHappeningTypeChanged()', happeningType);
		let { href } = location;
		if (!href.includes('?')) {
			href += '?type=';
		}
		href = href.replace(/type=\w*/, `type=${happeningType}`);
		history.replaceState(history.state, document.title, href);
	}
}
