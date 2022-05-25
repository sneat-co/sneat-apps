import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonInput } from '@ionic/angular';
import {
	ContactToAssetRelation,
	ContactToMemberRelation,
	emptyPersonBase,
	Gender,
	IContact2Asset,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady,
} from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext, ICreateContactRequest, IMemberContext } from '@sneat/team/models';
import { MemberService } from '@sneat/team/services';
import { first, takeUntil } from 'rxjs';
import {
	ContactGroupService,
	ContactRoleService,
	IContactGroupContext,
	IContactRoleBrief,
	IContactRoleContext,
} from '../../contact-group.service';
import { ContactService } from '../../contact.service';

@Component({
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewContactPageComponent extends TeamBaseComponent implements OnInit {

	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	public readonly personRequires: IPersonRequirements = {
		ageGroup: 'excluded',
		relatedAs: 'excluded',
	};

	public relation?: ContactToMemberRelation;
	public name = '';
	public gender?: Gender;
	public email = '';
	public phone = '';
	public creating = false;
	// public readonly relations: { id: string; title: string }[] = [
	// 	{ id: 'mother', title: 'Mother' },
	// 	{ id: 'father', title: 'Father' },
	// 	{ id: 'parent', title: 'Parent' },
	// 	{ id: 'grandparent', title: 'Grand-parent' },
	// 	{ id: 'sibling', title: 'Sibling' },
	// 	{ id: 'child', title: 'Child' },
	// 	{ id: 'gp', title: 'GP - Family Doctor' },
	// ];

	relatedPerson: IRelatedPerson = emptyPersonBase;


	public member?: IMemberContext;

	public asset?: IAssetContext;

	contactGroup?: IContactGroupContext;
	contactRole?: IContactRoleContext;

	assetRelation?: ContactToAssetRelation;

	get title(): string {
		return this.contactRole?.brief
			? `${this.contactRole.brief.emoji} New ${this.contactRole.brief.title.toLowerCase()}`
			: 'New contact';
	}

	public personFormIsReadyToSubmit = false;
	public readonly id = (i: number, v: { id: string }): string => v.id;

	constructor(
		params: TeamComponentBaseParams,
		route: ActivatedRoute,
		private readonly assetService: AssetService,
		private readonly contactService: ContactService,
		private readonly membersService: MemberService,
		private readonly contactGroupService: ContactGroupService,
		private readonly contactRoleService: ContactRoleService,
		// private readonly businessLogic: IBusinessLogic,
	) {
		super('NewContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
		this.member = window.history.state.member as IMemberContext;
		this.asset = window.history.state.asset as IAssetContext;
	}

	// onContactTypeChanged(v: ContactRole): void {
	//
	// }

	ngOnInit(): void {
		this.route.queryParamMap
			.pipe(takeUntil(this.destroyed))
			.subscribe(this.onUrlParamsChanged);
	}

	private readonly onUrlParamsChanged = (params: ParamMap): void => {
		const relation = params.get('relation');
		if (relation) {
			this.relation = relation as ContactToMemberRelation; // TODO: verify
		}
		const contactGroupID = params.get('group');
		if (contactGroupID && !this.contactGroup) {

			this.contactGroupService.getContactGroupByID(contactGroupID)
				.pipe(
					first(),
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: contactGroup => {
						this.contactGroup = contactGroup;
					},
					error: this.logErrorHandler('Failed to get contact group by ID'),
				});
		}
		const contactRole = params.get('role');

		if (contactRole && !this.contactRole) {
			this.contactRoleService.getContactRoleByID(contactRole)
				.pipe(
					first(),
					this.takeUntilNeeded(),
				)
				.subscribe({
					next: contactRole => {
						this.contactRole = contactRole;
					},
					error: this.logErrorHandler('Failed to get contact role by ID'),
				});
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
	};

	public onContactGroupChanged(contactGroup?: IContactGroupContext): void {
		console.log('onContactGroupChanged()', contactGroup);
		this.contactGroup = contactGroup;
	}

	public onContactRoleIDChanged(contactRoleID?: string): void {
		const brief: IContactRoleBrief | undefined = this.contactGroup?.dto?.roles.find(r => r.id === contactRoleID);
		this.contactRole = brief && { id: brief.id, brief };
		console.log('onContactRoleIDChanged()', contactRoleID, this.contactRole);
	}

	public onRelatedPersonChange(myPerson: IRelatedPerson): void {
		this.relatedPerson = myPerson;
	}

	public onPersonFormIsReadyToSubmit(): void {
		this.personFormIsReadyToSubmit = true;
	}

	submit(): void {
		this.creating = true;
		let request: ICreateContactRequest = {
			teamID: this.team.id,
			...this.relatedPerson,
			ageGroup: this.relatedPerson.ageGroup || 'unknown',
		};

		const asset = this.asset;
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
			request.assetIDs = [contact2Asset];
		}
		const roleID = this.contactRole?.id;
		if (roleID) {
			if (!request.roles) {
				request = { ...request, roles: [roleID] };
			} else if (request.roles.some(r => r === roleID)) {
				request.roles.push(roleID);
			}
		}
		this.contactService.createContact(request)
			.subscribe({
				next: contact => {
					this.navigateForwardToTeamPage(
						`contact/${contact.id}`,
						{ state: { contact } },
					).catch(this.logErrorHandler('failed to navigate to contact page'));
				},
				error: err => {
					this.creating = false;
					this.errorLogger.logError(err, 'Failed to create new contact');
				},
			});
	}

	// selectRel(rel: ITitledRecord): void {
	// 	this.relation = rel.id as ContactToMemberRelation;
	// 	setTimeout(
	// 		() => {
	// 			this.nameInput?.setFocus()
	// 				.catch(this.logErrorHandler('failed to set focus to name input'));
	// 		},
	// 		100);
	// }

	public get isContactNotReady(): boolean {
		return isRelatedPersonNotReady(this.relatedPerson, {});
	}

}
