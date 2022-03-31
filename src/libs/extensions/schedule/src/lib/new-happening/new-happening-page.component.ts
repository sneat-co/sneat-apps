//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IonInput} from '@ionic/angular';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IMemberService, IRegularHappeningService, ISingleHappeningService} from 'sneat-shared/services/interfaces';
import {DtoRegularActivity, DtoSingleActivity, IHappening, Slot, SlotParticipant} from 'sneat-shared/models/dto/dto-happening';
import {IRecord, RxRecordKey} from 'rxstore';
import {Member} from 'sneat-shared/models/ui/ui-models';

@Component({
	selector: 'app-happening-new',
	templateUrl: './new-happening-page.component.html',
	providers: [CommuneBasePageParams],
})
export class NewHappeningPageComponent extends CommuneBasePage {

	isToDo: boolean;

	@ViewChild('titleInput', {static: true}) titleInput: IonInput;

	happeningKind: 'regular' | 'single' = 'single';

	slots: Slot[] = [];
	contacts: number[] = [];
	showSlotForm = true;
	public date: string;

	members: Member[];
	adults: Member[];
	kids: Member[];
	private eventStarts: Date;
	private eventEnds: Date;

	activityForm = new FormGroup({
		title: new FormControl('', Validators.required),
	});

	segmentChanged(): void {
		history.replaceState(
			history.state, document.title,
			location.href.replace(
				/tab=\w+/,
				`tab=${this.happeningKind}`,
			),
		);
	}

	onSlotRemoved(slots: Slot[]): void {
		console.log('NewHappeningPage.onSlotRemoved() => slots.length:', slots.length);
		this.slots = slots;
		this.showSlotForm = !this.slots.length;
	}

	onSlotAdded(): void {
		this.showSlotForm = false;
	}

	// tslint:disable-next-line:prefer-function-over-method
	onMemberSelectChanged(m: Member, event: CustomEvent): void {
		m.isChecked = event.detail.checked;
	}

	constructor(
		params: CommuneBasePageParams,
		private readonly memberService: IMemberService,
		private readonly regularHappeningService: IRegularHappeningService,
		private readonly singleHappeningService: ISingleHappeningService,
	) {
		super(window.location.pathname.indexOf('/new-task') >= 0 ? 'tasks' : 'schedule', params);
		this.isToDo = window.location.pathname.indexOf('/new-task') >= 0;
		this.date = window.history.state.date as string;
		console.log('date', this.date);

		const type = window.history.state.type as 'regular' | 'single';
		if (type) {
			this.happeningKind = type;
		}
		params.route.queryParamMap.subscribe(queryParams => {
			console.log('NewHappeningPage.constructor() => queryParams:', queryParams);
			if (!type) {
				const tab = queryParams.get('tab');
				if (tab === 'single' || tab === 'regular') {
					this.happeningKind = tab;
				}
			}
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

	newSlot(): void {
		this.showSlotForm = true;
	}

	ionViewDidEnter(): void {
		this.titleInput.setFocus()
			.catch(this.errorLogger.logError);
	}


	addContact(): void {
		this.contacts.push(1);
	}

	createActivity(): void {
		this.activityForm.markAsTouched();
		if (!this.activityForm.valid) {
			if (!this.activityForm.controls.title.valid) {
				this.titleInput.setFocus()
					.catch(this.errorLogger.logError);
			}
			return;
		}
		const activityFormValue = this.activityForm.value;
		const dto: IHappening = {
			communeId: this.communeRealId,
			title: activityFormValue.title,
		};
		{
			const selectedMembers = this.members.filter(m => m.isChecked);
			if (selectedMembers.length) {
				dto.memberIds = selectedMembers.map(m => m.id)
					.filter(v => !!v) as string[];
				dto.participants = selectedMembers.map(m => {
					// tslint:disable-next-line:no-non-null-assertion
					const s: SlotParticipant = {type: 'member', id: m.id!, title: m.title!};
					return s;
				});
			}
		}

		switch (this.happeningKind) {
			case 'regular':
				const regularDto: DtoRegularActivity = {
					...dto,
					kind: 'activity',
					type: 'appointment',
					slots: this.slots,
				};
				this.regularHappeningService.addCommuneItem(regularDto)
					.subscribe(
						() => {
							this.navCtrl.back();
						},
						this.errorLogger.logError,
					);
				break;
			case 'single':
				const eventDto: DtoSingleActivity = {
					...dto,
					kind: 'activity',
					dtStarts: this.eventStarts.getTime(),
					dtEnds: this.eventEnds.getTime(),
				};
				this.singleHappeningService.addCommuneItem(eventDto)
					.subscribe(
						() => {
							this.navCtrl.back();
						},
						err => this.errorLogger.logError,
					);
				break;
			default:
				this.errorLogger.logError(new Error(`Unkonw happening kind: ${this.happeningKind}`));
				break;
		}
	}

	onEventTimesChanged(times: { from: Date; to: Date }): void {
		console.log('NewHappeningPage.onEventTimesChanged() =>', times);
		this.eventStarts = times.from;
		this.eventEnds = times.to;
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
