//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { RoutingState } from '@sneat/core';
import { HappeningType, IHappeningDto, IHappeningSlot, ITiming, SlotParticipant } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext, Member } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';
import { takeUntil } from 'rxjs';
import { ScheduleService } from '../../services/schedule.service';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewHappeningPageComponent extends TeamBaseComponent implements OnInit {

	isToDo: boolean;
	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;
	happeningType: HappeningType = 'recurring';
	slots: IHappeningSlot[] = [];
	contacts: number[] = [];
	public date: string;

	participantsTab: 'members' | 'others' = 'members';

	happeningTitle = new FormControl('', Validators.required);

	happeningForm = new FormGroup({
		title: this.happeningTitle,
	});

	public checkedMemberIDs: string[] = [];
	singleTiming?: ITiming;

	get members(): IMemberContext[] | undefined {
		const members = this.team?.dto?.members;
		if (!members) {
			return undefined;
		}
		return members.map(memberContextFromBrief);
	}

	private readonly hasNavHistory: boolean;

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
		this.date = history.state.date as string;
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type) {
			this.happeningType = type;
		}
		route.queryParamMap
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: queryParams => {
					console.log('NewHappeningPage.constructor() => queryParams:', queryParams);
					if (!type) {
						const tab = queryParams.get('tab');
						if (tab === 'single' || tab === 'recurring') {
							this.happeningType = tab;
						}
					}
				},
				error: this.logErrorHandler('failed to get query params'),
			});
	}

	ngOnInit(): void {
		console.log('NewHappeningPageComponent.ngOnInit()');
	}

	readonly id = (i: number, v: { id: string }) => v.id;

	segmentChanged(): void {
		console.log('segmentChanged()');
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?tab=';
		}
		href = href.replace(
			/tab=\w*/,
			`tab=${this.happeningType}`,
		);
		console.log('href:', href);
		history.replaceState(history.state, document.title, href);
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

	onSlotRemoved(slots: IHappeningSlot[]): void {
		console.log('NewHappeningPage.onSlotRemoved() => slots.length:', slots.length);
		this.slots = slots;
	}

	// tslint:disable-next-line:prefer-function-over-method
	onMemberSelectChanged(m: Member, event: Event): void {
		const { detail } = (event as CustomEvent);
		m.isChecked = detail.checked;
	}

	ionViewDidEnter(): void {
		if (!this.titleInput) {
			this.logError(new Error('titleInput is not initialized'));
			return;
		}
		this.titleInput.setFocus()
			.catch(this.logErrorHandler('failed to set focus to title input'));
	}

	addContact(): void {
		this.contacts.push(1);
	}

	onTimingChanged(timing: ITiming): void {
		console.log('NewHappeningPageComponent.onTimingChanged()', timing);
		this.singleTiming = timing;
	}

	makeHappeningDto(): IHappeningDto {
		if (!this.team) {
			throw new Error('!this.team');
		}
		const activityFormValue = this.happeningForm.value;
		const dto: IHappeningDto = {
			type: this.happeningType,
			kind: 'activity',
			teamIDs: [this.team.id],
			title: activityFormValue.title,
		};
		switch (dto.type) {
			case 'recurring':
				dto.slots = this.slots;
				break;
			case 'single':
				if (!this.singleTiming) {
					throw new Error('timing is not set');
				}
				dto.slots = [{
					id: 'once',
					repeats: 'once',
					...this.singleTiming,
				}];
				break;
			default:
				throw new Error('unknown happening type: ' + dto.type);
		}
		{ // Populate selected members
			const selectedMembers = this.members?.filter(m => this.checkedMemberIDs.some(v => v === m.id));
			if (selectedMembers?.length) {
				dto.memberIDs = selectedMembers.map(m => m.id)
					.filter(v => !!v) as string[];
				dto.participants = selectedMembers.map(m => {
					const s: SlotParticipant = { type: 'member', id: m.id, title: m.brief?.title || m.id };
					return s;
				});
			}
		}
		return dto;
	}

	createHappening(): void {
		console.log('onTimingChanged.createHappening()');
		try {
			this.happeningForm.markAsTouched();
			if (!this.team) {
				return;
			}
			if (!this.happeningForm.valid) {
				if (!this.happeningForm.controls['title'].valid) {
					this.titleInput?.setFocus()
						.catch(this.logErrorHandler('failed to set focus to title input after happening found to be not valid'));
				}
				return;
			}
			const dto = this.makeHappeningDto();

			const team = this.team;

			if (!team) {
				this.logError(new Error('!team context'));
				return;
			}

			this.scheduleService
				.createHappening({ teamID: team.id, dto })
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
				});
		} catch (e) {
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

	public isMemberChecked(member: IMemberContext): boolean {
		const { id } = member;
		return this.checkedMemberIDs.some(v => v === id);
	}

	public isMemberCheckChanged(member: IMemberContext, event: Event): void {
		const ce = event as CustomEvent;
		console.log('isMemberCheckChanged()', ce);
		const checked = ce.detail.value === 'on';
		const { id } = member;
		if (!checked) {
			this.checkedMemberIDs = this.checkedMemberIDs.filter(v => v !== id);
			return;
		}
		if (!this.checkedMemberIDs.some(v => v === id)) {
			this.checkedMemberIDs.push(id);
		}
	}
}
