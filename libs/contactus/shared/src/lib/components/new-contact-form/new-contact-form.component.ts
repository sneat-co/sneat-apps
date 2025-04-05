import {
	Component,
	effect,
	EventEmitter,
	inject,
	input,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import {
	ContactToAssetRelation,
	emptyContactBase,
	IContact2Asset,
	IContactContext,
	IContactGroupDbo,
	IContactRoleBrief,
	ICreateContactRequest,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady,
} from '@sneat/contactus-core';
import {
	ContactGroupService,
	ContactRoleService,
	ContactService,
} from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndDbo, IIdAndOptionalDbo } from '@sneat/core';
import { AssetService } from '@sneat/extensions-assetus-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { WithSpaceInput } from '@sneat/space-components';
import { first, Subject, takeUntil } from 'rxjs';
import { ContactRoleFormComponent } from '../contact-role-form';
import { PersonWizardComponent } from '../person-form';

export type ContactRoleIdAndBrief = IIdAndBrief<IContactRoleBrief> | undefined;
export type ContactGroupIdAndBrief =
	| IIdAndOptionalDbo<IContactGroupDbo>
	| undefined;

@Component({
	selector: 'sneat-new-contact-form',
	templateUrl: './new-contact-form.component.html',
	imports: [
		IonItemDivider,
		IonLabel,
		ContactRoleFormComponent,
		IonicModule,
		PersonWizardComponent,
	],
})
export class NewContactFormComponent extends WithSpaceInput implements OnInit {
	public readonly $contact = input.required<IContactContext | undefined>();
	@Output() public readonly contactChange = new EventEmitter<IContactContext>();

	public readonly $contactGroupID = input<string>();
	public readonly $contactRoleID = input<string>();
	public readonly $assetID = input<string>();

	private readonly assetID$ = new Subject<string | undefined>();

	public readonly $asset = signal<IAssetContext | undefined>(undefined);

	protected relatedPerson: IRelatedPerson = emptyContactBase;
	protected readonly $contactGroup = signal<ContactGroupIdAndBrief>(undefined);
	protected readonly $contactRole = signal<ContactRoleIdAndBrief>(undefined);

	public readonly $parentContactID = input<string>();
	private readonly parentContactID$ = new Subject<string | undefined>();
	private readonly $parentContact = signal<IContactContext | undefined>(
		undefined,
	);

	protected readonly personRequires: IPersonRequirements = {
		ageGroup: { hide: true },
		relatedAs: { hide: true },
		roles: { hide: true },
	};

	@Output() readonly contactRoleChange =
		new EventEmitter<ContactRoleIdAndBrief>();

	@Output() readonly contactGroupChange =
		new EventEmitter<ContactGroupIdAndBrief>();

	protected assetRelation?: ContactToAssetRelation;
	protected readonly $personFormIsReadyToSubmit = signal(false);
	protected readonly $creating = signal(false);

	private readonly assetService = inject(AssetService);
	private readonly contactGroupService = inject(ContactGroupService);
	private readonly contactService = inject(ContactService);
	private readonly contactRoleService = inject(ContactRoleService);

	public constructor() {
		super('NewContactFormComponent');
	}

	public ngOnInit() {
		effect(() => {
			const contactGroupID = this.$contactGroupID();
			const spaceRef = this.$spaceRef();
			if (!contactGroupID) {
				return;
			}
			this.contactGroupService
				.getContactGroupByID(contactGroupID, spaceRef)
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe({
					next: (contactGroup) => {
						this.$contactGroup.set(contactGroup);
					},
					error: this.logErrorHandler('Failed to get contact group by ID'),
				});
		});
		effect(() => {
			const contactRoleID = this.$contactRoleID();
			if (!contactRoleID) {
				return;
			}
			this.contactRoleService
				.getContactRoleByID(contactRoleID)
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe({
					next: (contactRole) => {
						this.$contactRole.set(contactRole);
					},
					error: this.logErrorHandler('Failed to get contact role by ID'),
				});
		});
		effect(() => {
			const id = this.$assetID();
			this.assetID$.next(id);
			if (!id) {
				return;
			}
			const space = this.$space();
			if (this.$asset()?.id !== id) {
				this.$asset.set({ id, space });
			}
			this.assetService
				.watchAssetByID(space, id)
				.pipe(this.takeUntilDestroyed(), takeUntil(this.assetID$))
				.subscribe({
					next: (asset) => {
						this.$asset.set(asset);
					},
					error: this.logErrorHandler('failed to get asset by ID'),
				});
		});
		effect(() => {
			const id = this.$parentContactID();
			this.parentContactID$.next(id);
			if (!id) {
				return;
			}
			const space = this.$spaceRef();
			this.contactService
				.watchContactById(space, id)
				.pipe(this.takeUntilDestroyed(), takeUntil(this.parentContactID$))
				.subscribe((parentContact) => {
					this.$parentContact.set(parentContact);
				});
		});
	}

	protected onContactGroupChanged(
		contactGroup?: IIdAndDbo<IContactGroupDbo>,
	): void {
		console.log('onContactGroupChanged()', contactGroup);
		this.$contactGroup.set(contactGroup);
	}

	protected onContactRoleIDChanged(contactRoleID?: string): void {
		const brief = this.$contactGroup()?.dbo?.roles?.find(
			(r) => r.id === contactRoleID,
		);
		this.$contactRole.set(brief && { id: brief.id, brief });
		console.log('onContactRoleIDChanged()', contactRoleID, this.$contactRole);
	}

	public onRelatedPersonChange(myPerson: IRelatedPerson): void {
		this.relatedPerson = myPerson;
	}

	public onPersonFormIsReadyToSubmit(): void {
		this.$personFormIsReadyToSubmit.set(true);
	}

	protected submit(): void {
		const space = this.$space();
		if (!space) {
			throw new Error('Space is not defined');
		}
		this.$creating.set(true);
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

		const asset = this.$asset();
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
		const roleID = this.$contactRole()?.id;
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
				const space = this.$space();
				this.spaceNavService
					.navigateForwardToSpacePage(space, `contact/${contact.id}`, {
						replaceUrl: true,
						state: { contact },
					})
					.catch(
						this.errorLogger.logErrorHandler(
							'failed to navigate to contact page',
						),
					);
			},
			error: (err: unknown) => {
				this.$creating.set(false);
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
