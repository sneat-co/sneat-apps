import {
	Component,
	computed,
	effect,
	EventEmitter,
	inject,
	Input,
	input,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { IonButton, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import {
	IContactRoleWithIdAndBrief,
	ContactToAssetRelation,
	IContact2Asset,
	IContactContext,
	IContactGroupDbo,
	IPersonRequirements,
	isRelatedPersonNotReady,
	ContactRole,
	IContactRoleWithIdAndOptionalBrief,
	NewContactBaseDboAndSpaceRef,
	ICreateContactPersonRequest,
} from '@sneat/contactus-core';
import {
	ContactGroupService,
	ContactRoleService,
	ContactService,
} from '@sneat/contactus-services';
import { PersonWizardComponent } from '../pesson-wizard';
import { IContactAddEventArgs } from '../../contact-events';
import { ContactRoleFormComponent } from '../role-form';
import { IIdAndDbo, IIdAndOptionalDbo } from '@sneat/core';
import {
	AssetService,
	AssetusServicesModule,
} from '@sneat/ext-assetus-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { NewContactFormBaseComponent } from './new-contact-form-base.component';

export type OptionalContactRoleIdAndBrief =
	| IContactRoleWithIdAndBrief
	| undefined;

export type OptionalContactGroupIdAndBrief =
	| IIdAndOptionalDbo<IContactGroupDbo>
	| undefined;

export type NewContactFormCommand = 'create' | 'reset';

@Component({
	imports: [
		IonItemDivider,
		IonLabel,
		ContactRoleFormComponent,
		PersonWizardComponent,
		IonButton,
		AssetusServicesModule,
	],
	selector: 'sneat-new-person-form',
	templateUrl: './new-person-form.component.html',
})
export class NewPersonFormComponent
	extends NewContactFormBaseComponent
	implements OnInit
{
	@Input() public isInModal = false;

	@Input() command?: Observable<NewContactFormCommand>;
	@Input() selectGroupAndRole$?: Observable<IContactAddEventArgs | undefined>;

	// If set user can't change this.
	public readonly $fixedGroupID = input<string>();

	// If set user can't change role.
	public readonly $fixedRoleID = input<ContactRole>();

	public readonly $assetID = input<string>();

	private readonly assetID$ = new Subject<string | undefined>();

	public readonly $asset = signal<IAssetContext | undefined>(undefined);

	protected readonly $selectedContactGroup = signal<
		OptionalContactGroupIdAndBrief | undefined
	>(undefined);

	protected readonly $selectedContactGroupID = computed(
		() => this.$selectedContactGroup()?.id,
	);

	protected readonly $selectedContactRole = signal<
		IContactRoleWithIdAndOptionalBrief | undefined
	>(undefined);

	protected readonly $selectedContactRoleID = computed(
		() => this.$selectedContactRole()?.id,
	);

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
		new EventEmitter<OptionalContactRoleIdAndBrief>();

	@Output() readonly contactGroupChange =
		new EventEmitter<OptionalContactGroupIdAndBrief>();

	protected assetRelation?: ContactToAssetRelation;
	protected readonly $personFormIsReadyToSubmit = signal(false);
	protected readonly $creating = signal(false);

	private readonly assetService = inject(AssetService);
	private readonly contactGroupService = inject(ContactGroupService);
	private readonly contactService = inject(ContactService);
	private readonly contactRoleService = inject(ContactRoleService);

	public constructor() {
		super('NewContactFormComponent');
		this.setupEffects();
	}

	public ngOnInit(): void {
		this.command?.pipe(this.takeUntilDestroyed()).subscribe(this.onCommand);
		this.selectGroupAndRole$
			?.pipe(this.takeUntilDestroyed())
			.subscribe(this.onSelectGroupAndRole);
	}

	private readonly onSelectGroupAndRole = (
		args: IContactAddEventArgs | undefined,
	) => {
		console.log('selectedGroupAndRole:', args);
		if (args?.group?.id && args.group.id !== this.$fixedGroupID()) {
			this.$selectedContactGroup.set({ id: args.group.id });
		}
		if (args?.role?.id) {
			this.$selectedContactRole.set({ id: args?.role?.id });
		}
	};

	private readonly onCommand = (command: NewContactFormCommand): void => {
		switch (command) {
			case 'create': {
				this.submit();
				break;
			}
			case 'reset': {
				this.$selectedContactRole.set(undefined);
				this.$selectedContactGroup.set(undefined);
				break;
			}
			default:
				this.errorLogger.logError(
					'NewContactPageComponent received unknown command: ' + command,
				);
				break;
		}
	};

	private setupEffects(): void {
		console.log('NewContactFormComponent.setupEffects()');
		effect(() => {
			this.creatingChange.emit(this.$creating());
		});
		effect(() => {
			const contactGroupID = this.$selectedContactGroupID();
			console.log('effect for $selectedContactGroupID', contactGroupID);
			if (!contactGroupID) {
				return;
			}
			const spaceRef = this.$contact().space;
			this.contactGroupService
				.getContactGroupByID(contactGroupID, spaceRef)
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe({
					next: (contactGroup) => {
						console.log(
							'effect for $selectedContactGroupID loaded contactGroup:',
							contactGroup,
						);
						this.$selectedContactGroup.set(contactGroup);
					},
					error: this.logErrorHandler('Failed to get contact group by ID'),
				});
		});
		effect(() => {
			const fixedGroupID = this.$fixedGroupID();
			if (fixedGroupID && this.$selectedContactGroupID() !== fixedGroupID) {
				this.$selectedContactGroup.set({ id: fixedGroupID });
			}
		});
		effect(() => {
			const contactRoleID = this.$fixedRoleID();
			if (!contactRoleID) {
				return;
			}
			this.$selectedContactRole.set({ id: contactRoleID });
			this.contactRoleService
				.getContactRoleByID(contactRoleID)
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe({
					next: (contactRole) => {
						this.$selectedContactRole.set({
							id: contactRole.id as ContactRole,
							brief: contactRole.brief,
						});
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
			const space = this.$contact().space;
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
			const space = this.$contact().space;
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
		this.$selectedContactGroup.set(contactGroup);
	}

	protected onContactRoleIDChanged(contactRoleID?: string): void {
		const contactRole = this.$selectedContactGroup()?.dbo?.roles?.find(
			(r) => r.id === contactRoleID,
		);
		this.$selectedContactRole.set(contactRole);
		console.log(
			'onContactRoleIDChanged()',
			contactRoleID,
			this.$selectedContactRole,
		);
	}

	public onContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		this.contactChange.emit(contact);
	}

	public onPersonFormIsReadyToSubmit(): void {
		this.$personFormIsReadyToSubmit.set(true);
	}

	protected submit(): void {
		this.console.log('NewContactFormComponent.submit()');
		const space = this.$contact().space;
		if (!space) {
			throw new Error('Space is not defined');
		}
		this.$creating.set(true);
		const contactDbo = this.$contact().dbo;
		let request: ICreateContactPersonRequest = {
			status: 'active',
			type: 'person',
			spaceID: space.id,
			person: {
				...contactDbo,
				status: 'active',
				type: 'person',
				ageGroup: contactDbo.ageGroup || 'unknown',
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
			request = {
				...request,
				relatedToAssets: [contact2Asset],
			};
		}
		const roleID = this.$selectedContactRoleID();
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
				request = {
					...request,
					person: {
						...request.person,
						roles: [...request.person.roles, roleID],
					},
				};
			}
		}
		this.contactService.createContact(space, request).subscribe({
			next: (contact) => {
				const space = this.$contact().space;
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

	protected readonly $isContactNotReady = computed(() =>
		isRelatedPersonNotReady(this.$contact().dbo, {}),
	);
}
