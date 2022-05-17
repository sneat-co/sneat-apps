import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { excludeUndefined } from '@sneat/core';
import {
	ContactToAssetRelation,
	ContactToMemberRelation,
	ContactRole,
	Gender,
	IContact2Asset,
	IContactDto,
	ITitledRecord,
} from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext, IMemberContext } from '@sneat/team/models';
import { MemberService } from '@sneat/team/services';
import { ContactService, ICreateContactRequest } from '../../contact.service';

@Component({
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewContactPageComponent extends TeamBaseComponent implements OnInit {

	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	public relation?: ContactToMemberRelation;
	public name = '';
	public gender?: Gender;
	public email = '';
	public phone = '';
	public creating = false;
	public readonly relations: { id: string; title: string }[] = [
		{ id: 'mother', title: 'Mother' },
		{ id: 'father', title: 'Father' },
		{ id: 'parent', title: 'Parent' },
		{ id: 'grandparent', title: 'Grand-parent' },
		{ id: 'sibling', title: 'Sibling' },
		{ id: 'child', title: 'Child' },
		{ id: 'gp', title: 'GP - Family Doctor' },
	];

	public member?: IMemberContext;

	public asset?: IAssetContext;

	contactGroup?: string;
	contactType?: ContactRole;

	assetRelation?: ContactToAssetRelation;

	get title(): string {
		return this.contactType ? `New ${this.contactType}` : 'New contact';
	}

	public readonly id = (i: number, v: { id: string }): string => v.id;


	constructor(
		params: TeamComponentBaseParams,
		route: ActivatedRoute,
		private readonly assetService: AssetService,
		private readonly contactService: ContactService,
		private readonly membersService: MemberService,
		// private readonly businessLogic: IBusinessLogic,
	) {
		super('NewContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
		this.member = window.history.state.member as IMemberContext;
		this.asset = window.history.state.asset as IAssetContext;
	}

	onContactTypeChanged(v: ContactRole): void {

	}

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(params => {
			const relation = params.get('relation');
			if (relation) {
				this.relation = relation as ContactToMemberRelation; // TODO: verify
			}
			let contactType = params.get('type');
			if (contactType) {
				if (contactType.includes(':')) {
					[this.contactGroup, contactType] = contactType.split(':');
				}
				this.contactType = contactType as ContactRole;
			}

			const assetId = params.get('asset');
			if (assetId && this.asset?.id !== assetId) {
				this.asset = { id: assetId };
				this.assetService
					.watchAssetByID(assetId)
					.pipe(this.takeUntilNeeded())
					.subscribe({
						next: asset => {
							this.asset = asset;
						},
						error: this.logErrorHandler('failed to get asset by ID'),
					});
			}
			const memberId = params.get('member');
			if (memberId && this.member?.id !== memberId) {
				this.member = { id: memberId };
				this.membersService
					.watchMember(this.team, memberId)
					.pipe(this.takeUntilNeeded())
					.subscribe(data => {
						this.member = data?.member || undefined;
					});
			}
		});
	}

	submit(): void {
		if (!this.relation) {
			alert('relation is not set');
			return;
		}
		this.creating = true;
		const contactDto: IContactDto = excludeUndefined({
			teamIDs: [this.team.id],
			title: this.name,
			email: this.email.trim() || undefined,
			phone: this.phone.trim() || undefined,
			gender: this.gender,
		});
		if (this.member) {
			if (!this.member.brief?.title) {
				throw new Error('!this.member.brief.title');
			}
			contactDto.members = [
				{ id: this.member.id, title: this.member.brief.title, relation: this.relation },
			];
		}

		// tslint:disable-next-line:no-this-assignment
		const { asset } = this;
		if (asset) {
			if (!asset.id) {
				throw new Error('!assetDto.id');
			}
			if (!asset.brief?.title) {
				throw new Error('!asset.brief.title');
			}

			if (!this.assetRelation) {
				throw new Error('!this.assetRelation');
			}
			const contact2Asset: IContact2Asset = {
				id: asset.id,
				title: asset.brief.title,
				relation: this.assetRelation,
			};
			contactDto.assets = [contact2Asset];
		}
		if (this.contactType) {
			contactDto.roles = [this.contactType];
		}
		const request: ICreateContactRequest = {
			teamID: this.team.id,
			contactDto,
		};
		this.contactService.createContact(request)
			.subscribe({
				next: contact => {
					this.navigateForwardToTeamPage(
						`contact/${contact.id}`,
						{ state: { contact } },
					).catch(this.logErrorHandler('failed to navigate to contact page'));
				},
				error: this.errorLogger.logError,
			});
	}

	selectRel(rel: ITitledRecord): void {
		this.relation = rel.id as ContactToMemberRelation;
		setTimeout(
			() => {
				this.nameInput?.setFocus()
					.catch(this.logErrorHandler('failed to set focus to name input'));
			},
			100);
	}

}
