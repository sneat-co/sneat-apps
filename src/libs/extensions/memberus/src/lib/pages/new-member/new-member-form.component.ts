import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonInput, IonRadio } from '@ionic/angular';
import { formNexInAnimation } from '@sneat/animations';
import { createSetFocusToInput, PersonFormWizardComponent } from '@sneat/components';
import { RoutingState } from '@sneat/core';
import {
	emptyRelatedPerson,
	IPersonRequirements,
	IRelatedPerson,
	isRelatedPersonNotReady,
	MemberType,
} from '@sneat/dto';
import { ICreateTeamMemberRequest, ITeamContext } from '@sneat/team/models';
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
})
export class NewMemberFormComponent {

	public readonly personRequirements: IPersonRequirements = {
		ageGroup: {required: true},
		gender: {required: true},
	};
	private readonly hasNavHistory: boolean;
	public disabled = false;

	@Input() team?: ITeamContext;

	@Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	@ViewChild(PersonFormWizardComponent, { static: false }) personFormComponent?: PersonFormWizardComponent;
	@ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	@ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	public get isPersonFormReady(): boolean {
		return isRelatedPersonNotReady(this.relatedPerson, this.personRequirements);
	};

	public readonly setFocusToInput = createSetFocusToInput(this.params.errorLogger);

	public readonly memberType = new FormControl<MemberType>('member', [
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
		this.addMemberForm.disable();
		const team = this.team;
		if (!team) {
			this.params.errorLogger.logError('not able to add new member without team context');
			return;
		}
		if (!this.relatedPerson.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (!this.relatedPerson.gender) {
			throw new Error('Gender is a required field');
		}
		const request: ICreateTeamMemberRequest = {
			...this.relatedPerson,
			memberType: this.memberType.value || 'member',
			teamID: team.id,
		};

		this.disabled = true;
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

	readonly id = (i: number, record: { id: string }) => record.id;

	onRelatedPersonChanged(relatedPerson: IRelatedPerson): void {
		console.log('NewMemberFormComponent.onRelatedPersonChanged()', relatedPerson);
		this.relatedPerson = relatedPerson;
		this.relatedPersonChange.emit(relatedPerson);
	}
}
