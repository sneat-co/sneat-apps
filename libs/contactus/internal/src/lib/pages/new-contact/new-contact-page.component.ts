import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import {
	ContactRoleFormModule,
	PersonWizardComponent,
} from '@sneat/contactus-shared';
import {
	ContactToAssetRelation,
	ContactToContactRelation,
	emptyContactBase,
	Gender,
	IContact2Asset,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady,
} from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team/components';
import {
	IAssetContext,
	IContactContext,
	ICreateContactRequest,
} from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';
import {
	ContactGroupService,
	ContactRoleService,
	IContactGroupContext,
	IContactRoleBrief,
	IContactRoleContext,
} from '@sneat/contactus-services';

@Component({
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
	providers: [TeamComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ContactRoleFormModule,
		PersonWizardComponent,
	],
})
export class NewContactPageComponent
	extends TeamBaseComponent
	implements OnInit
{
	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	public readonly personRequires: IPersonRequirements = {
		ageGroup: { hide: true },
		relatedAs: { hide: true },
		roles: { hide: true },
	};

	public relation?: ContactToContactRelation;
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

	relatedPerson: IRelatedPerson = emptyContactBase;

	public contact?: IContactContext;

	public asset?: IAssetContext;

	contactGroup?: IContactGroupContext;
	contactRole?: IContactRoleContext;

	assetRelation?: ContactToAssetRelation;

	get title(): string {
		return this.contactRole?.brief
			? `${
					this.contactRole.brief.emoji
			  } New ${this.contactRole.brief.title.toLowerCase()}`
			: 'New contact';
	}

	public personFormIsReadyToSubmit = false;
	protected readonly id = (_: number, o: { id: string }) => o.id;

	constructor(
		params: TeamComponentBaseParams,
		route: ActivatedRoute,
		private readonly assetService: AssetService,
		private readonly contactGroupService: ContactGroupService,
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

	ngOnInit(): void {
		this.route.queryParamMap
			.pipe(takeUntil(this.destroyed))
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
				.getContactGroupByID(contactGroupID)
				.pipe(first(), takeUntil(this.destroyed))
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
				.pipe(first(), this.takeUntilNeeded())
				.subscribe({
					next: (contactRole) => {
						this.contactRole = contactRole;
					},
					error: this.logErrorHandler('Failed to get contact role by ID'),
				});
		}

		const team = this.team;
		if (!team) {
			throw new Error('Team is not defined');
		}

		const assetId = params.get('asset');
		if (assetId && this.asset?.id !== assetId) {
			this.asset = { id: assetId, team };
			this.assetService
				.watchAssetByID(team, assetId)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (asset) => {
						this.asset = asset;
					},
					error: this.logErrorHandler('failed to get asset by ID'),
				});
		}
		const memberId = params.get('member');
		if (memberId && this.contact?.id !== memberId) {
			this.contact = { id: memberId, team };
			this.contactService
				.watchContactById(team, memberId)
				.pipe(this.takeUntilNeeded())
				.subscribe((member) => {
					this.contact = member;
				});
		}
	};

	public onContactGroupChanged(contactGroup?: IContactGroupContext): void {
		console.log('onContactGroupChanged()', contactGroup);
		this.contactGroup = contactGroup;
	}

	public onContactRoleIDChanged(contactRoleID?: string): void {
		const brief: IContactRoleBrief | undefined =
			this.contactGroup?.dto?.roles.find((r) => r.id === contactRoleID);
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
		const team = this.team;
		if (!team) {
			throw new Error('Team is not defined');
		}
		this.creating = true;
		let request: ICreateContactRequest = {
			status: 'active',
			type: 'person',
			teamID: team.id,
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
		this.contactService.createContact(team, request).subscribe({
			next: (contact) => {
				this.navigateForwardToTeamPage(`contact/${contact.id}`, {
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
