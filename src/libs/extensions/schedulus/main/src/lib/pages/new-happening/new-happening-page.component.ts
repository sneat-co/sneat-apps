//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HappeningType, IHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext, Member, newEmptyHappeningContext } from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';
import { HappeningPageFormComponent } from '../../components/happening-page-form/happening-page-form.component';
import { ScheduleBasePage } from '../schedule-base-page';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewHappeningPageComponent extends ScheduleBasePage {

	@ViewChild('happeningPageFormComponent') happeningPageFormComponent?: HappeningPageFormComponent;

	public isToDo: boolean;
	public wd?: WeekdayCode2;
	public happeningType: HappeningType = 'recurring';
	public happening?: IHappeningContext;
	private singleHappening?: IHappeningContext;
	private recurringHappening?: IHappeningContext;
	public date = '';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly memberService: IMemberService,
		// private readonly regularHappeningService: IRegularHappeningService,
		// private readonly singleHappeningService: ISingleHappeningService,
	) {
		// window.location.pathname.indexOf('/new-task') >= 0 ? 'tasks' : 'schedule'
		super('NewHappeningPageComponent', route, params);
		this.isToDo = location.pathname.indexOf('/new-task') >= 0;
		this.date = history.state.date as string || '';
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type && this.team && !this.happening) {
			this.createHappeningContext(type);
		}
		route.queryParamMap
			.pipe(
				takeUntil(this.destroyed),
				first(),
			)
			.subscribe({
				next: queryParams => {
					console.log('NewHappeningPage.constructor() => queryParams:', queryParams);
					const type = queryParams.get('type');
					if (type !== 'single' && type !== 'recurring') {
						console.warn('unknown happening type passed in URL: type=' + type);
						return;
					}
					this.happeningType = type;
					if (this.team && !this.happening) {
						this.createHappeningContext(type);
					}
					this.wd = queryParams.get('wd') as WeekdayCode2;
					if (!this.date) {
						this.date = queryParams.get('date') || '';
					}
				},
				error: this.logErrorHandler('failed to get query params'),
			});
	}

	private createHappeningContext(type: HappeningType): void {
		const team = this.team;
		if (!team) {
			throw new Error('!team');
		}
		this.happening = newEmptyHappeningContext(team, type, 'appointment', 'active');
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

	onHappeningChanged(happening: IHappeningContext): void {
		this.happening = happening;
	}

	onHappeningTypeChanged(): void {
		console.log('onHappeningTypeChanged()');
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?type=';
		}
		href = href.replace(
			/type=\w*/,
			`type=${this.happeningType}`,
		);
		history.replaceState(history.state, document.title, href);
		if (!this.happening?.brief) {
			throw new Error('!this.happening?.brief');
		}
		if (this.happening) {
			switch (this.happeningType) {
				case 'single':
					this.recurringHappening = this.happening;
					break;
				case 'recurring':
					this.singleHappening = this.happening;
					break;
			}
		}
		this.happening = {
			...this.happening,
			brief: { ...this.happening.brief, type: this.happeningType, slots: undefined },
		};
		const setSlots = (slots?: IHappeningSlot[]) => {
			if (slots && this.happening?.brief) {
				this.happening = {
					...this.happening,
					brief: {
						...this.happening.brief,
						slots,
					},
				};
			}
		};
		switch (this.happeningType) {
			case 'single':
				setSlots(this.singleHappening?.brief?.slots);
				break;
			case 'recurring':
				setSlots(this.recurringHappening?.brief?.slots);
				break;
		}
		console.log('singleHappening', this.singleHappening, this.happening);
	}


	// tslint:disable-next-line:prefer-function-over-method
	onMemberSelectChanged(m: Member, event: Event): void {
		const { detail } = (event as CustomEvent);
		m.isChecked = detail.checked;
	}


	// onEventTimesChanged(times: { from: Date; to: Date }): void {
	// 	console.log('NewHappeningPage.onEventTimesChanged() =>', times);
	// 	this.eventStarts = times.from;
	// 	this.eventEnds = times.to;
	// }

	// public addNewMember(): void {
	// 	alert('Not implemented yet. Please add from members page for now.');
	// }


}
