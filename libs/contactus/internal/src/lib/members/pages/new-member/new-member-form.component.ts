import { JsonPipe } from '@angular/common';
import {
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { PersonWizardComponent } from '@sneat/contactus-shared';
import { formNexInAnimation } from '@sneat/core';
import { personName } from '@sneat/components';
import { RoutingState } from '@sneat/core';
import {
	IContactusSpaceDboAndID,
	ICreateSpaceMemberRequest,
	IMemberPerson,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonReady,
} from '@sneat/contactus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { MemberComponentBaseParams } from '../../member-component-base-params';

@Component({
	selector: 'sneat-new-member-form',
	templateUrl: 'new-member-form.component.html',
	animations: [formNexInAnimation],
	providers: [MemberComponentBaseParams],
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		PersonWizardComponent,
		JsonPipe,
	],
})
export class NewMemberFormComponent implements OnChanges {
	public personRequirements: IPersonRequirements = {
		// ageGroup: { required: false },
		// gender: { required: true },
	};

	private readonly navController = inject(NavController);

	private readonly hasNavHistory: boolean;
	protected readonly $isSubmitting = signal(false);

	protected readonly $canSubmit = computed(
		() =>
			this.$space().id &&
			!this.$isSubmitting() &&
			this.$isRelatedPersonReady() &&
			!this.addMemberForm.disabled && //TODO(check) Could be a problem with Push detection strategy?
			this.addMemberForm.valid,
	);

	public readonly $space = input.required<ISpaceContext>();

	protected contactusSpace?: IContactusSpaceDboAndID;

	public readonly $member = input.required<IMemberPerson>();

	private readonly $isRelatedPersonReady = computed(() => {
		const member = this.$member();
		return member && isRelatedPersonReady(member, this.personRequirements);
	});

	@Output() readonly memberChange = new EventEmitter<IMemberPerson>();

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

	constructor(
		private readonly params: MemberComponentBaseParams,
		routingState: RoutingState,
	) {
		this.hasNavHistory = routingState.hasHistory();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space']) {
			this.setPersonRequirements();
		}
	}

	private setPersonRequirements(): void {
		const space = this.$space();
		const member = this.$member();
		this.personRequirements = {
			// TODO: Should we move it inside person form wizard?
			...this.personRequirements,
			ageGroup:
				space.type === 'family' && member?.type !== 'animal'
					? { required: true }
					: { hide: true },
			roles:
				space.type === 'family' && member?.type !== 'animal'
					? { hide: true }
					: { required: true },
			relatedAs:
				space.type === 'family' && member?.type !== 'animal'
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
		const member = this.$member();
		if (!space) {
			this.params.errorLogger.logError(
				'not able to add new member without team context',
			);
			return;
		}
		if (!member) {
			this.params.errorLogger.logError('member field is undefined');
			return;
		}
		if (this.personRequirements.ageGroup?.required && !member.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (this.personRequirements.gender?.required && !member.gender) {
			throw new Error('Gender is a required field');
		}
		const displayName = personName(member.names);
		const duplicateMember = zipMapBriefsWithIDs(
			this.contactusSpace?.dbo?.contacts,
		)?.find((m) => personName(m.brief.names) === displayName);
		if (duplicateMember) {
			alert('There is already a member with same name: ' + displayName);
			return;
		}

		const request: ICreateSpaceMemberRequest = {
			...member,
			status: 'active',
			countryID: space.dbo?.countryID || '--',
			roles: ['contributor'],
			spaceID: space.id,
		};

		this.$isSubmitting.set(true);
		this.addMemberForm.disable();
		this.params.memberService.createMember(request).subscribe({
			next: (member) => {
				console.log('member created:', member);
				if (this.hasNavHistory) {
					this.navController
						.pop()
						.catch(
							this.params.errorLogger.logErrorHandler(
								'failed to navigate to prev page',
							),
						);
				} else {
					this.params.spaceNavService
						.navigateBackToSpacePage(space, 'members')
						.catch(
							this.params.errorLogger.logErrorHandler(
								'failed to navigate back to members page',
							),
						);
				}
			},
			error: (err) => {
				this.params.errorLogger.logError(err, 'Failed to create a new member');
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

	onRelatedPersonChanged(relatedPerson: IRelatedPerson): void {
		console.log(
			'NewMemberFormComponent.onRelatedPersonChanged()',
			relatedPerson,
		);
		// this.$member.set(relatedPerson as IMemberPerson);
		const member = relatedPerson as IMemberPerson;
		this.setPersonRequirements();
		this.memberChange.emit(member);
	}
}
