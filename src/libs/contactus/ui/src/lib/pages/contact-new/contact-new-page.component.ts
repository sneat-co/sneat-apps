//tslint:disable:no-unsafe-any
import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInput} from '@ionic/angular';
import {CommuneBasePageParams} from '../../../../services/params';
import {CommuneBasePage} from '../../../../pages/commune-base-page';
import {ITitledRecord} from '../../../../models/dto/dto-models';
import {IMemberDto} from '../../../../models/dto/dto-member';
import {IAssetDto} from '../../../../models/dto/dto-asset';
import {IAssetService, IBusinessLogic, IContactService, IMemberService} from '../../../../services/interfaces';
import {IContactDto} from '../../../../models/dto/dto-contact';
import {ContactToMemberRelation, ContactType, Gender} from '../../../../models/types';
import {IRecord, RxRecordKey} from 'rxstore';
import {excludeUndefined} from '../../../../utils';

@Component({
	selector: 'contactus-contact-page',
	templateUrl: './contact-new-page.component.html',
	providers: [CommuneBasePageParams],
})
export class ContactNewPageComponent extends CommuneBasePage implements OnInit {

	@ViewChild('nameInput', {static: true}) nameInput: IonInput;

	public relation: ContactToMemberRelation;
	public name: string;
	public gender: Gender;
	public email: string;
	public phone: string;
	public creating: boolean;
	public relations: ITitledRecord[] = [
		{id: 'mother', title: 'Mother'},
		{id: 'father', title: 'Father'},
		{id: 'parent', title: 'Parent'},
		{id: 'grandparent', title: 'Grand-parent'},
		{id: 'sibling', title: 'Sibling'},
		{id: 'child', title: 'Child'},
		{id: 'gp', title: 'GP - Family Doctor'},
	];

	public memberId: string;
	public memberDto?: IMemberDto;

	public assetDto?: IAssetDto;
	public assetId?: string;

	contactType: ContactType;

	get title(): string {
		return this.contactType ? `New ${this.contactType}` : 'New contact';
	}

	constructor(
		params: CommuneBasePageParams,
		private readonly assetService: IAssetService,
		private readonly contactService: IContactService,
		private readonly membersService: IMemberService,
		private readonly businessLogic: IBusinessLogic,
	) {
		super('contacts', params);
		this.memberDto = window.history.state.memberDto as IMemberDto;
		this.assetDto = window.history.state.assetDto as IAssetDto;
		this.assetId = this.assetDto && this.assetDto.id;
	}

	ionViewDidEnter(): void {
		// tslint:disable-next-line:no-magic-numbers
		setTimeout(() => this.nameInput.setFocus(), 10);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.route.queryParamMap.subscribe(params => {
			const relation = params.get('relation');
			if (relation) {
				this.relation = relation as ContactToMemberRelation; // TODO: verify
			}
			const contactType = params.get('type');
			if (contactType) {
				this.contactType = contactType as ContactType;
			}

			const assetId = params.get('asset');
			if (assetId && (!this.assetDto || this.assetDto.id !== assetId)) {
				this.assetId = assetId;
				this.assetService.getById(assetId)
					.subscribe(assetDto => {
						this.assetDto = assetDto;
						if (assetDto && !this.communeRealId) {
							this.setPageCommuneIds('assetDto', {real: assetDto.communeId});
						}
					});
			}
			const memberId = params.get('member');
			if (memberId && (!this.memberDto || this.memberDto.id !== memberId)) {
				this.memberId = memberId;
				this.subscriptions.push(this.membersService.watchById(this.memberId)
					.subscribe(memberDto => {
						this.memberDto = memberDto;
					}));
			}
		});
	}

	submit(): void {
		this.creating = true;
		const contactDto: IContactDto = excludeUndefined({
			communeId: this.communeRealId,
			title: this.name,
			email: this.email.trim() || undefined,
			phone: this.phone.trim() || undefined,
			gender: this.gender,
		});
		if (this.memberDto) {
			if (!this.memberDto.title) {
				throw new Error('!this.memberDto.title');
			}
			contactDto.members = [
				{id: this.memberId, title: this.memberDto.title, relation: this.relation},
			];
		}

		// tslint:disable-next-line:no-this-assignment
		const {assetDto} = this;
		if (assetDto) {
			if (!assetDto.id) {
				throw new Error('!assetDto.id');
			}
			if (!assetDto.title) {
				throw new Error('!assetDto.title');
			}
			contactDto.assets = [
				{id: assetDto.id, title: assetDto.title, relation: this.contactType},
			];
		}
		if (this.contactType) {
			contactDto.roles = [this.contactType];
		}
		this.businessLogic.createContact(contactDto)
			.subscribe(
				() => {
					this.navigateForward(
						'contact',
						{id: contactDto.id}, {contactDto},
						{excludeCommuneDto: true, excludeCommuneId: true},
					);
				},
				this.errorLogger.logError,
			);
	}

	selectRel(rel: ITitledRecord): void {
		this.relation = rel.id as ContactToMemberRelation;
		setTimeout(
			() => {
				this.nameInput.setFocus()
					.catch(err => {
						console.error(err);
					});
			},
			// tslint:disable-next-line:no-magic-numbers
			100);
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
