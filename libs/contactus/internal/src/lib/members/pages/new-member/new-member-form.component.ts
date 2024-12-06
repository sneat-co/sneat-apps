import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	// FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
	// Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { TeamMemberType } from '@sneat/auth-models';
import { PersonWizardComponent } from '@sneat/contactus-shared';
import { formNexInAnimation } from '@sneat/core';
import { personName } from '@sneat/components';
import { RoutingState } from '@sneat/core';
import {
	emptyMemberPerson,
	IContactusSpaceDboAndID,
	ICreateSpaceMemberRequest,
	IMemberPerson,
	IPersonRequirements,
	IRelatedPerson,
	// isRelatedPersonNotReady,
	isRelatedPersonReady,
} from '@sneat/contactus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { MemberComponentBaseParams } from '../../member-component-base-params';

@Component({
	selector: 'sneat-new-member-form',
	templateUrl: 'new-member-form.component.html',
	animations: [formNexInAnimation],
	providers: [MemberComponentBaseParams],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		PersonWizardComponent,
	],
})
export class NewMemberFormComponent implements OnChanges {
	public personRequirements: IPersonRequirements = {
		// ageGroup: { required: false },
		// gender: { required: true },
	};

	private readonly hasNavHistory: boolean;
	public isSubmitting = false;

	protected canSubmit = false;

	@Input({ required: true }) space?: ISpaceContext;

	protected contactusSpace?: IContactusSpaceDboAndID;

	@Input() member: IMemberPerson = emptyMemberPerson;
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
		this.personRequirements = {
			// TODO: Should we move it inside person form wizard?
			...this.personRequirements,
			ageGroup:
				this.space?.type === 'family' && this.member.type !== 'animal'
					? { required: true }
					: { hide: true },
			roles:
				this.space?.type === 'family' && this.member.type !== 'animal'
					? { hide: true }
					: { required: true },
			relatedAs:
				this.space?.type === 'family' && this.member.type !== 'animal'
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
		const space = this.space;
		if (!space) {
			this.params.errorLogger.logError(
				'not able to add new member without team context',
			);
			return;
		}
		if (this.personRequirements.ageGroup?.required && !this.member.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (this.personRequirements.gender?.required && !this.member.gender) {
			throw new Error('Gender is a required field');
		}
		const displayName = personName(this.member.names);
		const duplicateMember = zipMapBriefsWithIDs(
			this.contactusSpace?.dbo?.contacts,
		)?.find((m) => personName(m.brief.names) === displayName);
		if (duplicateMember) {
			alert('There is already a member with same name: ' + displayName);
			return;
		}

		const request: ICreateSpaceMemberRequest = {
			...this.member,
			status: 'active',
			countryID: space.dbo?.countryID || '--',
			roles: ['contributor'],
			spaceID: space.id,
		};

		this.isSubmitting = true;
		this.addMemberForm.disable();
		this.params.memberService.createMember(request).subscribe({
			next: (member) => {
				console.log('member created:', member);
				if (this.hasNavHistory) {
					this.params.navController
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
					this.isSubmitting = false;
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
		this.member = relatedPerson as IMemberPerson;
		this.setPersonRequirements();
		this.memberChange.emit(this.member);
		this.canSubmit = isRelatedPersonReady(
			relatedPerson,
			this.personRequirements,
		);
	}
}
