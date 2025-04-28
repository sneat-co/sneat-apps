import { JsonPipe } from '@angular/common';
import {
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	OnChanges,
	OnInit,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonCard,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { IPersonNames, isNameEmpty } from '@sneat/auth-models';
import { excludeUndefined, formNexInAnimation, SpaceType } from '@sneat/core';
import { IFormField } from '@sneat/core';
import {
	AgeGroupID,
	Gender,
	IContactBase,
	IEmail,
	IPersonRequirements,
	IPhone,
	IRelatedPerson,
	MemberContactType,
	NewContactBaseDboAndSpaceRef,
} from '@sneat/contactus-core';
import {
	getRelatedItemIDs,
	IRelatedItem,
	IRelatedModules,
	IRelatedTo,
	IRelationshipRoles,
	ISpaceModuleItemRef,
} from '@sneat/dto';
import { UserSpaceBriefProvider } from '../../../providers/user-space-brief.provider';
import { NewContactFormBaseComponent } from '../new-contact/new-contact-form-base.component';
import { AgeGroupFormComponent } from '../person-forms/age-group';
import { EmailsFormComponent } from '../emails-form';
import { GenderFormComponent } from '../person-forms/gender-form';
import {
	INamesFormFields,
	NamesFormComponent,
} from '../person-forms/names-form';
import { PhonesFormComponent } from '../phones-form';
import { RelationshipFormComponent } from '../relationship-form';
import { ContactRelationshipFormComponent } from '../relationship-form/contact-relationship-form.component';
import { RolesFormComponent } from '../roles-form';

export interface PersonWizardState {
	// wizard state
	readonly contactType?: boolean;
	readonly ageGroup?: boolean;
	readonly name?: boolean;
	readonly nameNext?: boolean;
	readonly gender?: boolean;
	readonly roles?: boolean;
	readonly relatedAs?: boolean;
	readonly communicationChannels?: boolean;
	readonly submitButton?: boolean;
}

type WizardStepID = keyof PersonWizardState;

interface WizardStepCondition {
	readonly contactTypes: readonly MemberContactType[];
	readonly contactRoles?: readonly string[];
	readonly spaceTypes?: readonly SpaceType[];
}

interface WizardStepFilter {
	readonly hideFor?: WizardStepCondition;
	readonly showFor?: WizardStepCondition;
}

interface WizardStepDef {
	readonly id: WizardStepID;
	readonly filter?: WizardStepFilter;
}

export type IPersonFormWizardFields = {
	[id in keyof PersonWizardState]: IFormField;
};

@Component({
	animations: [formNexInAnimation],
	imports: [
		AgeGroupFormComponent,
		GenderFormComponent,
		NamesFormComponent,
		RolesFormComponent,
		FormsModule,
		PhonesFormComponent,
		EmailsFormComponent,
		IonSegment,
		IonSegmentButton,
		IonCard,
		ContactRelationshipFormComponent,
	],
	selector: 'sneat-person-form-wizard',
	templateUrl: './person-wizard.component.html',
})
export class PersonWizardComponent
	extends NewContactFormBaseComponent
	implements OnInit, OnChanges
{
	@Input() requires: IPersonRequirements = {};
	@Input() disabled = false;
	@Input() hideRelationship = false;
	@Input() hidePetOption = true;

	@Input() displayAgeGroupValue = false;

	@Input() nameFields: INamesFormFields = {
		firstName: { hide: false },
		lastName: { hide: false },
		middleName: { hide: false },
		nickName: { hide: true, required: false },
		fullName: { hide: false, required: false },
	};

	public readonly $fields = input.required<Readonly<IPersonFormWizardFields>>();

	public isReadyToSubmit = false;
	@Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

	public show: PersonWizardState = {};

	public readonly $wizardStep = signal<WizardStepID>('contactType');

	tab?: 'emails' | 'phones' = 'emails';

	@ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
	@ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;

	protected readonly $relatedToUser = computed<ISpaceModuleItemRef | undefined>(
		() => {
			const userContactID = this.userSpaceBrief.$userContactID();
			return userContactID
				? {
						spaceID: this.$spaceID(),
						module: 'contactus',
						collection: 'contacts',
						itemID: userContactID,
					}
				: undefined;
		},
	);
	protected readonly $relatedTo = computed<IRelatedTo | undefined>(() => {
		const key = this.$relatedToUser();
		if (!key) {
			return undefined;
		}
		return {
			key,
			title: '', // getContactTitle({ id: '', ...this.$contact() }),
			related: this.$contact().dbo.related || {},
		};
	});

	// private readonly $userSpaces = signal<
	// 	Readonly<Record<string, IUserSpaceBrief>> | undefined
	// >(undefined);

	protected readonly userSpaceBrief = new UserSpaceBriefProvider(
		this.destroyed$,
		this.$spaceID,
		this.userService,
	);

	constructor(private readonly userService: SneatUserService) {
		super('PersonWizardComponent');
	}

	public ngOnInit() {
		this.setContactData(this.$contact().dbo, {
			name: 'contactType',
			hasValue: true,
		});
		// runInInjectionContext(this.injector, () => {
		// 	effect(() => {
		// 		// This effect currently does not makes sense
		// 		// as we have different component for different contact types
		// 		const contact = this.$contact();
		// 		console.log('$contact() changed', contact);
		// 		if (this.$wizardStep() === 'contactType') {
		// 			if (contact.dbo.type) {
		// 				this.onContactTypeChanged();
		// 				this.setContactData(contact.dbo, {
		// 					name: 'contactType',
		// 					hasValue: true,
		// 				});
		// 			}
		// 		}
		// 	});
		// });
	}

	private readonly formOrder: readonly WizardStepDef[] = [
		{ id: 'contactType' },
		{ id: 'ageGroup' },
		{ id: 'gender' },
		// relatedAs to current user or a specific contact
		{
			id: 'relatedAs',
			filter: {
				hideFor: { contactTypes: ['animal'] },
			},
		},
		{ id: 'name' },
		{
			id: 'roles',
			filter: { hideFor: { contactTypes: ['animal'], spaceTypes: ['family'] } },
		},
		{
			id: 'communicationChannels',
			filter: { hideFor: { contactTypes: ['animal'] } },
		},
		{ id: 'submitButton' },
	];

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('PersonWizardState.ngOnChanges()', changes);
		if (changes['fields']) {
			this.openNext('contactType');
		}
	}

	private setContactData(
		dbo: IContactBase,
		changedProp: Readonly<{
			readonly name: WizardStepID;
			readonly hasValue: boolean;
		}>,
	): void {
		console.log('setContactData()', changedProp);
		this.contactChange.emit({ ...this.$contact(), dbo });
		if (changedProp.hasValue) {
			this.openNext(changedProp.name);
		}
	}

	protected onNameChanged(name: IPersonNames): void {
		console.log('PersonWizardState.onNameChanged()', name);
		if (!this.show.nameNext && !isNameEmpty(name)) {
			this.show = { ...this.show, nameNext: true };
		}
		this.setContactData(
			{ ...this.$contact().dbo, names: name },
			{ name: 'name', hasValue: false },
		);
	}

	protected onContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		console.log('PersonWizardState.onContactChanged()', contact);
		// this.setRelatedPerson(
		// 	{ ...this.newPerson, petKind },
		// 	{ name: 'petKind', hasValue: !!petKind },
		// );
	}

	protected onGenderChanged(gender?: Gender): void {
		console.log('PersonWizardState.onGenderChanged()', gender);
		this.setContactData(
			{ ...this.$contact().dbo, gender },
			{ name: 'gender', hasValue: !!gender },
		);
	}

	private onContactTypeChanged(): void {
		switch (this.$contact().dbo.type) {
			case 'animal':
				this.nameFields = {
					...this.nameFields,
					nickName: { hide: false, required: true },
					firstName: { hide: true },
					lastName: { hide: true },
					middleName: { hide: true },
				};
				break;
			case 'person':
				this.nameFields = {
					...this.nameFields,
					nickName: { hide: true, required: false },
					firstName: { hide: false },
					lastName: { hide: false },
					middleName: { hide: false },
				};
				break;
		}
	}

	protected onAgeGroupChanged(ageGroup?: AgeGroupID): void {
		console.log('PersonWizardComponent.onAgeGroupChanged()', ageGroup);
		if (ageGroup) {
			this.show = { ...this.show, ageGroup: this.displayAgeGroupValue };
		}
		if (this.$contact().dbo.type !== 'person') {
			this.setContactData(
				{ ...this.$contact().dbo, type: 'person' },
				{
					name: 'contactType',
					hasValue: true,
				},
			);
			this.onContactTypeChanged();
		}
		const relatedPerson: IRelatedPerson = excludeUndefined({
			...this.$contact().dbo,
			ageGroup: ageGroup === 'pet' ? undefined : ageGroup,
			type: ageGroup === 'pet' ? 'animal' : 'person',
		});
		this.setContactData(relatedPerson, {
			name: 'ageGroup',
			hasValue: !!ageGroup || this.$contact().dbo.type === 'animal',
		});
	}

	protected onEmailsChanged(emails: IEmail[]): void {
		this.setContactData(
			{ ...this.$contact().dbo, emails },
			{
				name: 'communicationChannels',
				hasValue: !!emails?.length || !!this.$contact().dbo.phones?.length,
			},
		);
	}

	protected onPhoneChanged(phones: IPhone[]): void {
		this.setContactData(
			{ ...this.$contact().dbo, phones },
			{
				name: 'communicationChannels',
				hasValue: !!phones?.length || !!this.$contact().dbo.emails?.length,
			},
		);
	}

	protected onRelatedAsChanged(rolesToTarget: IRelationshipRoles): void {
		console.log(
			'PersonWizardState.onRelatedAsChanged() rolesToTarget=',
			rolesToTarget,
		);

		const itemID = this.userSpaceBrief.$userContactID();
		if (!itemID) {
			throw new Error('!$userContactID()');
		}

		const userContactRelatedItem: IRelatedItem = {
			rolesToItem: rolesToTarget,
		};

		const related: IRelatedModules = {
			contactus: {
				contacts: { [itemID]: userContactRelatedItem },
			},
		};

		let contactDbo: IContactBase = {
			...this.$contact().dbo,
			related,
		};

		if (!this.$contact().dbo.ageGroup) {
			const relationship = Object.keys(rolesToTarget || []).length
				? Object.keys(rolesToTarget)[0]
				: undefined;
			contactDbo = {
				...this.$contact().dbo,
				ageGroup:
					relationship === 'parent' ||
					relationship === 'spouse' ||
					relationship === 'partner' ||
					relationship === 'grandparent'
						? 'adult'
						: 'child',
			};
		}
		this.setContactData(contactDbo, {
			name: 'relatedAs',
			hasValue: !!rolesToTarget,
		});
	}

	protected nextFromName(event: Event): void {
		event.stopPropagation();

		if (!this.namesFormComponent) {
			throw Error('!namesFormComponent');
		}
		if (!this.namesFormComponent.namesForm) {
			throw Error('!namesFormComponent.namesForm');
		}

		this.namesFormComponent.namesForm.markAllAsTouched();
		if (!this.namesFormComponent.namesForm.valid) {
			const errors = this.namesFormComponent?.namesForm.errors;
			if (errors) {
				alert(
					'Problem with names:\n' +
						Object.entries(errors)
							.map((err) => `\t${err[0]}: ${err[1]}`)
							.join('\n'),
				);
			}
			return;
		}
		this.openNext('name');
		this.show = { ...this.show, nameNext: false };
	}

	private skipStep(step: WizardStepDef): boolean {
		if (!step.filter || (!step.filter.hideFor && !step.filter.showFor)) {
			return false;
		}
		const { space, dbo } = this.$contact();
		if (dbo.type) {
			const hideFor = step.filter.hideFor;
			if (
				hideFor?.contactTypes?.includes(dbo.type as MemberContactType) ||
				hideFor?.contactRoles?.some((role) => dbo.roles?.includes(role))
			) {
				return true;
			}
			if (
				step.filter.showFor?.contactTypes?.length &&
				!step.filter.showFor.contactTypes.includes(
					dbo.type as MemberContactType,
				)
			) {
				return true;
			}
		}
		if (space?.type) {
			if (step.filter.hideFor?.spaceTypes?.includes(space.type)) {
				return true;
			}
			if (
				step.filter.showFor?.spaceTypes?.length &&
				!step.filter.showFor.spaceTypes.includes(space.type)
			) {
				return true;
			}
		}

		return false;
	}

	private openNext(currentStepID: keyof PersonWizardState): void {
		for (;;) {
			console.log('openNext()', currentStepID);
			const i = this.formOrder.findIndex((step) => step.id === currentStepID);
			if (i < 0) {
				console.log(
					`openNext have not found ${currentStepID} in this.formOrder=${this.formOrder.join(
						',',
					)}`,
				);
				return;
			}
			if (i === this.formOrder.length - 1) {
				// last element
				console.log('openNext reached last element');
				return;
			}
			const nextStep = this.formOrder[i + 1];
			if (this.skipStep(nextStep)) {
				currentStepID = nextStep.id;
				continue;
			}

			if (!this.show[nextStep.id]) {
				const nextField = this.$fields()[nextStep.id];
				const showNextField = nextField ? !nextField.hide : true;
				this.show = { ...this.show, [nextStep.id]: showNextField };
				if (!showNextField) {
					this.openNext(nextStep.id);
				}
				this.$wizardStep.set(nextStep.id);
				if (this.stepHasValue(nextStep.id)) {
					currentStepID = nextStep.id;
					continue;
				}
			}
			break; // <---------- Exit point
		}
		if (this.show.submitButton) {
			this.isReadyToSubmit = true;
			this.isReadyToSubmitChange.emit();
		}
	}

	private stepHasValue(name: WizardStepID): boolean | undefined {
		const p = this.$contact().dbo;
		switch (name) {
			case 'name':
				return !!p.names && Object.values(p.names).some((v) => !!v);
			case 'ageGroup':
				return !!p.ageGroup;
			case 'gender':
				return !!p.gender && p.gender !== 'unknown';
			case 'relatedAs':
				return (
					getRelatedItemIDs(
						p.related,
						'contactus',
						'contacts',
						this.$contact().space.id,
					).length > 0
				);
			case 'roles':
				return !!p.roles?.length;
		}
		return undefined;
	}
}
