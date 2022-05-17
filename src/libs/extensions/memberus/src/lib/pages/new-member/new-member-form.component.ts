import { animate, style, transition, trigger } from '@angular/animations';
import {
	AfterViewInit,
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonRadio, IonRadioGroup, NavController } from '@ionic/angular';
import { formNexInAnimation } from '@sneat/animations';
import { createSetFocusToInput, NamesFormComponent } from '@sneat/components';
import { excludeUndefined, RoutingState } from '@sneat/core';
import {
	FamilyMemberRelation, Gender,
	IMemberDto, IName,
	ITitledRecord,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	MemberRole,
	MemberRoleContributor,
	relationshipTitle,
} from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreateTeamMemberRequest, ITeamContext } from '@sneat/team/models';
import { MemberService, TeamNavService } from '@sneat/team/services';


const isFormValid = (control: AbstractControl): ValidationErrors | null => {
	const formGroup = control as FormGroup;
	const firstName = formGroup.controls['firstName'];
	const lastName = formGroup.controls['lastName'];
	const fullName = formGroup.controls['fullName'];
	const gender = formGroup.controls['gender'];
	if (gender?.value && !firstName?.value && !lastName?.value && !fullName?.value) {
		return { 'fullName': 'If full name is not provided either first or last name or both should be supplied' };
	}
	return null;
};

@Component({
	selector: 'sneat-new-member-form',
	templateUrl: 'new-member-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class NewMemberFormComponent {

	private readonly hasNavHistory: boolean;
	public isPersonFormReady = false;

	@Input() team?: ITeamContext;

	@ViewChild(NamesFormComponent, { static: false }) namesFormComponent?: NamesFormComponent;
	@ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	@ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	public roles?: string[];

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	public readonly memberType = new FormControl('member', [
		Validators.required,
	]);

	public readonly ageGroup = new FormControl('', [
		Validators.required,
	]);

	public gender?: Gender;

	public readonly role = new FormControl('', [
		Validators.required,
	]);
	public readonly relationship = new FormControl('', [
		Validators.required,
	]);

	public readonly email = new FormControl('', [
		Validators.email,
	]);

	public readonly phone = new FormControl('', []);


	public addMemberForm = new FormGroup({
		email: this.email,
		phone: this.phone,
		ageGroup: this.ageGroup,
		relationship: this.relationship,
	}, isFormValid);


	public get isComplete(): boolean {
		return !!this.namesFormComponent?.namesForm.valid && !!this.ageGroup.value && !!this.gender && !!this.relationship;
	}


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		route: ActivatedRoute,
		routingState: RoutingState,
		private readonly navController: NavController,
		private readonly membersService: MemberService,
		private readonly teamNavService: TeamNavService,
	) {
		this.hasNavHistory = routingState.hasHistory();
		route.queryParams.subscribe(params => {
			this.role.setValue(params['role'] || '');
			this.ageGroup.setValue(params['age'] || '');
		});
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
		if (!this.namesFormComponent) {
			throw ('!this.namesFormComponent');
		}
		this.addMemberForm.disable();
		const name: IName = this.namesFormComponent.names();
		let memberDto: IMemberDto = {
			name,
			ageGroup: this.ageGroup.value,
			gender: this.gender,
			email: this.email.value.trim() ? this.email.value.trim() : undefined,
			phone: this.phone.value.trim() ? this.phone.value.trim() : undefined,
		};
		if (this.role) {
			memberDto = { ...memberDto, roles: [this.role.value as MemberRole] };
		}
		memberDto = excludeUndefined(memberDto);
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('not able to add new member without team context');
			return;
		}
		if (!this.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (!this.gender) {
			throw new Error('Gender is a required field');
		}
		let request: ICreateTeamMemberRequest = {
			memberType: this.memberType.value,
			teamID: team.id,
			name,
			gender: this.gender,
			ageGroup: this.ageGroup.value,
			role: MemberRoleContributor,
		};
		if (this.email) {
			request = {
				...request,
				email: this.email.value,
			};
		}
		if (this.phone) {
			request = {
				...request,
				phone: this.phone.value,
			};
		}

		this.membersService.createMember(request).subscribe({
			next: member => {
				console.log('member created:', member);
				if (this.hasNavHistory) {
					this.navController.pop()
						.catch(this.errorLogger.logErrorHandler('failed to navigate to prev page'));
				} else {
					this.teamNavService.navigateBackToTeamPage(team, 'members')
						.catch(this.errorLogger.logErrorHandler('failed to navigate back to members page'));
				}
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to create a new member');
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

	public nextFromName(event: Event): void {
		if (!this.namesFormComponent?.namesForm.valid) {
			alert('Problem with names: ' + JSON.stringify(this.namesFormComponent?.namesForm.errors));
			return;
		}
		this.isPersonFormReady = true;
		setTimeout(() => {
			const setFocus = this.genderFirstInput?.setFocus;
			if (setFocus) {
				setFocus(event)
					.catch(this.errorLogger.logErrorHandler('failed to set focus to gender'));
			}
		}, 500);
	}


	onPersonFormReady(): void {
		this.isPersonFormReady = true;
	}
}
