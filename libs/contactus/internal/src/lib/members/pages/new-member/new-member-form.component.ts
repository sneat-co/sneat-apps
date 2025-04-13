import {
	Component,
	computed,
	inject,
	OnChanges,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonCol,
	IonGrid,
	IonLabel,
	IonRow,
	IonSpinner,
} from '@ionic/angular/standalone';
import { MemberService } from '@sneat/contactus-services';
import { PersonWizardComponent } from '@sneat/contactus-shared';
import { formNexInAnimation } from '@sneat/core';
import { personName } from '@sneat/components';
import { RoutingState } from '@sneat/core';
import {
	IContactusSpaceDboAndID,
	ICreateSpaceMemberRequest,
	IPersonRequirements,
	isRelatedPersonReady,
	MemberContactType,
	NewContactBaseDboAndSpaceRef,
	WithNewContactInput,
} from '@sneat/contactus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
	selector: 'sneat-new-member-form',
	templateUrl: 'new-member-form.component.html',
	animations: [formNexInAnimation],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		PersonWizardComponent,
		IonCard,
		IonCardContent,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		QRCodeComponent,
		IonButton,
		IonSpinner,
		IonLabel,
		IonRow,
		IonGrid,
		IonCol,
	],
})
export class NewMemberFormComponent
	extends WithNewContactInput
	implements OnChanges
{
	public personRequirements: IPersonRequirements = {
		ageGroup: { required: true },
		gender: { required: true },
	};

	private readonly navController = inject(NavController);

	private readonly hasNavHistory: boolean;
	protected readonly $isSubmitting = signal(false);

	protected readonly $canSubmit = computed(
		() =>
			this.$spaceRef().id &&
			!this.$isSubmitting() &&
			this.$isRelatedPersonReady() &&
			!this.addMemberForm.disabled && //TODO(check) Could be a problem with Push detection strategy?
			this.addMemberForm.valid,
	);

	protected readonly $spaceRef = computed(() => this.$contact().space);

	public readonly $space = signal<ISpaceContext>({ id: '' });

	protected contactusSpace?: IContactusSpaceDboAndID;

	private readonly $isRelatedPersonReady = computed(() => {
		const contact = this.$contact();
		return (
			contact && isRelatedPersonReady(contact.dbo, this.personRequirements)
		);
	});

	@ViewChild(PersonWizardComponent, { static: false })
	personFormComponent?: PersonWizardComponent;
	// @ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	// @ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	// public get isPersonFormReady(): boolean {
	// 	return isRelatedPersonNotReady(this.member, this.personRequirements);
	// }
	//
	// public readonly setFocusToInput = createSetFocusToInput(
	// 	this.params.errorLogger,
	// );

	// public readonly memberType = new FormControl<TeamMemberType>('member', [
	// 	Validators.required,
	// ]);

	public addMemberForm = new UntypedFormGroup({
		// email: this.email,
		// phone: this.phone,
		// ageGroup: this.ageGroup,
		// relationship: this.relationship,
	});

	private readonly memberService = inject(MemberService);
	private readonly spaceNavService = inject(SpaceNavService);

	public constructor(routingState: RoutingState) {
		super('NewMemberFormComponent');
		this.hasNavHistory = routingState.hasHistory();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['$space']) {
			this.setPersonRequirements(this.$contact());
		}
	}

	private setPersonRequirements(contact: NewContactBaseDboAndSpaceRef): void {
		const space = this.$space();
		this.personRequirements = {
			// TODO: Should we move it inside person form wizard?
			...this.personRequirements,
			ageGroup:
				space.type === 'family' && contact.dbo.type !== 'animal'
					? { required: true }
					: { hide: true },
			roles:
				space.type === 'family' && contact.dbo.type !== 'animal'
					? { hide: true }
					: { required: true },
			relatedAs:
				space.type === 'family' && contact.dbo.type !== 'animal'
					? { required: true }
					: { hide: true },
		};
	}

	submit(): void {
		// if (!this.hasNames) {
		// 	alert('Please enter first or last or full name of the new member');
		// 	if (!this.firstName.value && !this.lastName.value) {
		// 		this.setFocusToInput(this.firstNameInput);
		// 	} else {
		// 		this.setFocusToInput(this.fullNameInput);
		// 	}
		// 	return;
		// }
		if (!this.personFormComponent) {
			throw '!this.personFormComponent';
		}
		const space = this.$space();
		const contact = this.$contact();
		if (!space) {
			this.errorLogger.logError(
				'not able to add new member without team context',
			);
			return;
		}
		if (!contact) {
			this.errorLogger.logError('member field is undefined');
			return;
		}
		if (this.personRequirements.ageGroup?.required && !contact.dbo.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (this.personRequirements.gender?.required && !contact.dbo.gender) {
			throw new Error('Gender is a required field');
		}
		const displayName = personName(contact.dbo.names);
		const duplicateMember = zipMapBriefsWithIDs(
			this.contactusSpace?.dbo?.contacts,
		)?.find((m) => personName(m.brief.names) === displayName);
		if (duplicateMember) {
			alert('There is already a member with same name: ' + displayName);
			return;
		}

		const request: ICreateSpaceMemberRequest = {
			...contact.dbo,
			type: contact.dbo.type as MemberContactType,
			status: 'active',
			countryID: space.dbo?.countryID || '--',
			roles: ['contributor'],
			spaceID: space.id,
		};

		this.$isSubmitting.set(true);
		this.addMemberForm.disable();
		this.memberService.createMember(request).subscribe({
			next: (member) => {
				console.log('member created:', member);
				if (this.hasNavHistory) {
					this.navController
						.pop()
						.catch(
							this.errorLogger.logErrorHandler(
								'failed to navigate to prev page',
							),
						);
				} else {
					this.spaceNavService
						.navigateBackToSpacePage(space, 'members')
						.catch(
							this.errorLogger.logErrorHandler(
								'failed to navigate back to members page',
							),
						);
				}
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to create a new member');
				this.addMemberForm.enable();
				setTimeout(() => {
					this.$isSubmitting.set(false);
				}, 1000);
			},
		});

		// this.startCommuneReadwriteTx([MemberKind], (tx, communeDto, userDto) =>
		// 	this.membersService.addCommuneItem(
		// 		{
		// 			...memberDto,
		// 			communeId: communeDto.id,
		// 		},
		// 		tx,
		// 	))
		// 	.subscribe({
		// 			next: member => {
		// 				console.log('New member ID:', member.id);
		// 				setTimeout(
		// 					() => {
		// 						this.navigateRoot(
		// 							'member',
		// 							{ id: member.id },
		// 							{ memberDto: member },
		// 						);
		// 					},
		// 					// tslint:disable-next-line:no-magic-numbers
		// 					100,
		// 				);
		// 			},
		// 			error: err => {
		// 				this.errorLogger.logError(err, 'Failed to create new member');
		// 			},
		// 		},
		// 	);
	}

	onContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		console.log('NewMemberFormComponent.onContactChanged()', contact);
		this.setPersonRequirements(contact);
		this.contactChange.emit(contact);
	}
}
