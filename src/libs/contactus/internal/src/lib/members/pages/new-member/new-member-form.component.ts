import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule, IonInput, IonRadio } from '@ionic/angular';
import { PersonFormWizardComponent } from '@sneat/contactus-shared';
import { formNexInAnimation } from '@sneat/core';
import { createSetFocusToInput, personName } from '@sneat/components';
import { RoutingState } from '@sneat/core';
import {
	emptyMemberPerson, IMemberPerson,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady, isRelatedPersonReady,
	TeamMemberType,
} from '@sneat/dto';
import {
	IContactusTeamDtoWithID,
	ICreateTeamMemberRequest,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import { MemberComponentBaseParams } from '../../member-component-base-params';


@Component({
	selector: 'sneat-new-member-form',
	templateUrl: 'new-member-form.component.html',
	animations: [
		formNexInAnimation,
	],
	providers: [
		MemberComponentBaseParams,
	],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		PersonFormWizardComponent,
	],
})
export class NewMemberFormComponent implements OnChanges {

	public personRequirements: IPersonRequirements = {
		// ageGroup: { required: false },
		// gender: { required: true },
	};

	private readonly hasNavHistory: boolean;
	public disabled = false;

	protected canSubmit = false;

	@Input({ required: true }) team?: ITeamContext;

	protected contactusTeam?: IContactusTeamDtoWithID;

	@Input() member: IMemberPerson = emptyMemberPerson;
	@Output() readonly memberChange = new EventEmitter<IMemberPerson>();

	@ViewChild(PersonFormWizardComponent, { static: false }) personFormComponent?: PersonFormWizardComponent;
	@ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	@ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	public get isPersonFormReady(): boolean {
		return isRelatedPersonNotReady(this.member, this.personRequirements);
	}

	public readonly setFocusToInput = createSetFocusToInput(this.params.errorLogger);

	public readonly memberType = new FormControl<TeamMemberType>('member', [
		Validators.required,
	]);

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
		if (changes['team']) {
			this.setPersonRequirements();
		}
	}

	private setPersonRequirements(): void {
		this.personRequirements = { // TODO: Should we move it inside person form wizard?
			...this.personRequirements,
			ageGroup: this.team?.type === 'family' && this.member.type !== 'animal' ? { required: true } : { hide: true },
			roles: this.team?.type === 'family' && this.member.type !== 'animal' ? { hide: true } : { required: true },
			relatedAs: this.team?.type === 'family' && this.member.type !== 'animal' ? { required: true } : { hide: true },
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
			throw ('!this.personFormComponent');
		}
		const team = this.team;
		if (!team) {
			this.params.errorLogger.logError('not able to add new member without team context');
			return;
		}
		if (this.personRequirements.ageGroup?.required && !this.member.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (this.personRequirements.gender?.required && !this.member.gender) {
			throw new Error('Gender is a required field');
		}
		const displayName = personName(this.member.name);
		const duplicateMember = zipMapBriefsWithIDs(this.contactusTeam?.dto?.contacts)?.find(m => personName(m.brief.name) === displayName);
		if (duplicateMember) {
			alert('There is already a member with same name: ' + displayName);
			return;
		}

		const request: ICreateTeamMemberRequest = {
			...this.member,
			status: 'active',
			countryID: team.dto?.countryID || '--',
			roles: ['contributor'],
			teamID: team.id,
		};

		this.disabled = true;
		this.addMemberForm.disable();
		this.params.memberService.createMember(request).subscribe({
			next: member => {
				console.log('member created:', member);
				if (this.hasNavHistory) {
					this.params.navController.pop()
					.catch(this.params.errorLogger.logErrorHandler('failed to navigate to prev page'));
				} else {
					this.params.teamNavService.navigateBackToTeamPage(team, 'members')
					.catch(this.params.errorLogger.logErrorHandler('failed to navigate back to members page'));
				}
			},
			error: err => {
				this.params.errorLogger.logError(err, 'Failed to create a new member');
				this.addMemberForm.enable();
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

	protected readonly id = (_: number, o: { id: string }) => o.id;

	onRelatedPersonChanged(relatedPerson: IRelatedPerson): void {
		console.log('NewMemberFormComponent.onRelatedPersonChanged()', relatedPerson);
		this.member = relatedPerson as IMemberPerson;
		this.setPersonRequirements();
		this.memberChange.emit(this.member);
		this.canSubmit = isRelatedPersonReady(relatedPerson, this.personRequirements);
	}
}
