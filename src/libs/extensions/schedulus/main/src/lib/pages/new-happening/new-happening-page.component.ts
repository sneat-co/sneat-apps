//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingState } from '@sneat/core';
import { HappeningType, WeekdayCode2 } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { Member } from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';
import { HappeningPageFormComponent } from '../../components/happening-page-form/happening-page-form.component';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleBasePage } from '../schedule-base-page';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewHappeningPageComponent extends ScheduleBasePage {

	private readonly hasNavHistory: boolean;

	@ViewChild('happeningPageFormComponent') happeningPageFormComponent?: HappeningPageFormComponent;

	public isToDo: boolean;
	public wd?: WeekdayCode2;
	public happeningType: HappeningType = 'recurring';
	public date = '';
	public isCreating = false;

	isFormValid = false;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		routingState: RoutingState,
		private readonly scheduleService: ScheduleService,
		// private readonly memberService: IMemberService,
		// private readonly regularHappeningService: IRegularHappeningService,
		// private readonly singleHappeningService: ISingleHappeningService,
	) {
		// window.location.pathname.indexOf('/new-task') >= 0 ? 'tasks' : 'schedule'
		super('NewHappeningPageComponent', route, params);
		this.hasNavHistory = routingState.hasHistory();
		this.isToDo = location.pathname.indexOf('/new-task') >= 0;
		this.date = history.state.date as string || '';
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type) {
			this.happeningType = type;
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
					this.wd = queryParams.get('wd') as WeekdayCode2;
					if (!this.date) {
						this.date = queryParams.get('date') || '';
					}
				},
				error: this.logErrorHandler('failed to get query params'),
			});
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
	}



	// tslint:disable-next-line:prefer-function-over-method
	onMemberSelectChanged(m: Member, event: Event): void {
		const { detail } = (event as CustomEvent);
		m.isChecked = detail.checked;
	}



	createHappening(): void {
		console.log('NewHappeningPageComponent.createHappening()');
		if (!this.team) {
			return;
		}
		if (!this.happeningPageFormComponent) {
			return;
		}
		try {
			// this.happeningForm.markAsTouched();
			// if (!this.happeningForm.valid) {
			// 	alert('title is a required field');
			// 	// if (!this.happeningForm.controls['title'].valid) {
			// 	// 	this.titleInput?.setFocus()
			// 	// 		.catch(this.logErrorHandler('failed to set focus to title input after happening found to be not valid'));
			// 	// }
			// 	return;
			// }
			const team = this.team;

			if (!team) {
				this.logError(new Error('!team context'));
				return;
			}

			this.isCreating = true;

			const dto = this.happeningPageFormComponent.makeHappeningDto();

			this.scheduleService
				.createHappening({ teamID: team.id, dto })
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: () => {
						console.log('new happening created');
						if (this.hasNavHistory) {
							this.teamParams.navController.pop()
								.catch(this.logErrorHandler('failed to pop back after creating a happening'));
						} else {
							this.teamParams.teamNavService.navigateBackToTeamPage(team, 'schedule')
								.catch(this.logErrorHandler('failed to team schedule after creating a happening'));
						}
					},
					error: this.logErrorHandler('failed to create new happening'),
					complete: () => this.isCreating = false,
				});
		} catch (e) {
			this.isCreating = false;
			this.errorLogger.logError(e, 'failed to create new happening');
		}
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
