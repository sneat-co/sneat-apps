import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import {
	ContactRoleFormModule,
	PersonWizardComponent,
} from '@sneat/contactus-shared';
import { IIdAndBrief, IIdAndDbo, IIdAndOptionalDbo } from '@sneat/core';
import {
	ContactToAssetRelation,
	ContactToContactRelation,
	emptyContactBase,
	Gender,
	IContact2Asset,
	IContactGroupDbo,
	IContactRoleBrief,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady,
	IContactContext,
	ICreateContactRequest,
} from '@sneat/contactus-core';
import {
	AssetService,
	AssetusServicesModule,
} from '@sneat/extensions/assetus/components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { first, takeUntil } from 'rxjs';
import {
	ContactGroupService,
	ContactRoleService,
	ContactService,
	ContactusServicesModule,
} from '@sneat/contactus-services';

@Component({
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ContactRoleFormModule,
		PersonWizardComponent,
		ContactusServicesModule,
		AssetusServicesModule,
	],
})
export class NewContactPageComponent
	extends SpaceBaseComponent
	implements OnInit
{
	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	protected readonly personRequires: IPersonRequirements = {
		ageGroup: { hide: true },
		relatedAs: { hide: true },
		roles: { hide: true },
	};

	protected relation?: ContactToContactRelation;
	protected name = '';
	protected gender?: Gender;
	protected email = '';
	protected phone = '';
	protected creating = false;
	// public readonly relations: { id: string; title: string }[] = [
	// 	{ id: 'mother', title: 'Mother' },
	// 	{ id: 'father', title: 'Father' },
	// 	{ id: 'parent', title: 'Parent' },
	// 	{ id: 'grandparent', title: 'Grand-parent' },
	// 	{ id: 'sibling', title: 'Sibling' },
	// 	{ id: 'child', title: 'Child' },
	// 	{ id: 'gp', title: 'GP - Family Doctor' },
	// ];

	protected relatedPerson: IRelatedPerson = emptyContactBase;

	public contact?: IContactContext;

	public asset?: IAssetContext;

	protected contactGroup?: IIdAndOptionalDbo<IContactGroupDbo>;
	protected contactRole?: IIdAndBrief<IContactRoleBrief>;

	protected assetRelation?: ContactToAssetRelation;

	protected get title(): string {
		return this.contactRole?.brief
			? `${
					this.contactRole.brief.emoji
				} New ${this.contactRole.brief.title.toLowerCase()}`
			: 'New contact';
	}

	protected personFormIsReadyToSubmit = false;

	constructor(
		params: SpaceComponentBaseParams,
		route: ActivatedRoute,
		private readonly assetService: AssetService,
		private readonly contactGroupService: ContactGroupService,
		private readonly contactService: ContactService,
		private readonly contactRoleService: ContactRoleService, // private readonly businessLogic: IBusinessLogic,
	) {
		super('NewContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
		this.contact = window.history.state.contact as IContactContext;
		this.asset = window.history.state.asset as IAssetContext;
	}

	// onContactTypeChanged(v: ContactRole): void {
	//
	// }

	override ngOnInit(): void {
		this.route.queryParamMap
			.pipe(takeUntil(this.destroyed$))
			.subscribe(this.onUrlParamsChanged);
	}

	private readonly onUrlParamsChanged = (params: ParamMap): void => {
		const relation = params.get('relation');
		if (relation) {
			this.relation = relation as ContactToContactRelation; // TODO: verify
		}
		const contactGroupID = params.get('group');
		if (contactGroupID && !this.contactGroup) {
			this.contactGroupService
				.getContactGroupByID(contactGroupID, this.space)
				.pipe(first(), takeUntil(this.destroyed$))
				.subscribe({
					next: (contactGroup) => {
						this.contactGroup = contactGroup;
					},
					error: this.logErrorHandler('Failed to get contact group by ID'),
				});
		}
		const contactRole = params.get('role');

		if (contactRole && !this.contactRole) {
			this.contactRoleService
				.getContactRoleByID(contactRole)
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe({
					next: (contactRole) => {
						this.contactRole = contactRole;
					},
					error: this.logErrorHandler('Failed to get contact role by ID'),
				});
		}

		const space = this.space;
		if (!space) {
			throw new Error('Space is not defined');
		}

		const assetId = params.get('asset');
		if (assetId && this.asset?.id !== assetId) {
			this.asset = { id: assetId, space };
			this.assetService
				.watchAssetByID(space, assetId)
				.pipe(this.takeUntilDestroyed())
				.subscribe({
					next: (asset) => {
						this.asset = asset;
					},
					error: this.logErrorHandler('failed to get asset by ID'),
				});
		}
		const memberId = params.get('member');
		if (memberId && this.contact?.id !== memberId) {
			this.contact = { id: memberId, space: space };
			this.contactService
				.watchContactById(space, memberId)
				.pipe(this.takeUntilDestroyed())
				.subscribe((member) => {
					this.contact = member;
				});
		}
	};

	public onContactGroupChanged(
		contactGroup?: IIdAndDbo<IContactGroupDbo>,
	): void {
		console.log('onContactGroupChanged()', contactGroup);
		this.contactGroup = contactGroup;
	}

	public onContactRoleIDChanged(contactRoleID?: string): void {
		const brief = this.contactGroup?.dbo?.roles?.find(
			(r) => r.id === contactRoleID,
		);
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
		const space = this.space;
		if (!space) {
			throw new Error('Space is not defined');
		}
		this.creating = true;
		let request: ICreateContactRequest = {
			status: 'active',
			type: 'person',
			spaceID: space.id,
			person: {
				...this.relatedPerson,
				status: 'active',
				type: 'person',
				ageGroup: this.relatedPerson.ageGroup || 'unknown',
			},
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
			request.relatedToAssets = [contact2Asset];
		}
		const roleID = this.contactRole?.id;
		if (roleID) {
			if (request.person && !request.person.roles) {
				request = {
					...request,
					person: { ...request.person, roles: [roleID] },
				};
			} else if (
				request.person &&
				request.person.roles?.some((r) => r === roleID)
			) {
				request.person = {
					...request.person,
					roles: [...request.person.roles, roleID],
				};
			}
		}
		this.contactService.createContact(space, request).subscribe({
			next: (contact) => {
				this.navigateForwardToSpacePage(`contact/${contact.id}`, {
					replaceUrl: true,
					state: { contact },
				}).catch(this.logErrorHandler('failed to navigate to contact page'));
			},
			error: (err: unknown) => {
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
