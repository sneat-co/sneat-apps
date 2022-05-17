import { Component, Inject, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonRadio, NavController } from '@ionic/angular';
import { formNexInAnimation } from '@sneat/animations';
import { createSetFocusToInput, NamesFormComponent } from '@sneat/components';
import { excludeUndefined, RoutingState } from '@sneat/core';
import { emptyPersonBase, IMemberDto, IMyPerson, MemberRoleContributor, myPersonToPerson } from '@sneat/dto';
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
	public disabled = false;

	@Input() team?: ITeamContext;

	myPerson: IMyPerson = emptyPersonBase;

	@ViewChild(NamesFormComponent, { static: false }) namesFormComponent?: NamesFormComponent;
	@ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	@ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	public get isPersonFormReady(): boolean {
		const p = this.myPerson;
		return !!p.ageGroup && !!p.gender;
	};


	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	public readonly memberType = new FormControl('member', [
		Validators.required,
	]);

	public addMemberForm = new FormGroup({
		// email: this.email,
		// phone: this.phone,
		// ageGroup: this.ageGroup,
		// relationship: this.relationship,
	}, isFormValid);


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
			const ageGroup = params['ageGroup'];
			if (ageGroup) {
				this.myPerson = { ...this.myPerson, ageGroup: ageGroup };
			}
			const roles = params['roles'] || '';
			if (roles) {
				this.myPerson = { ...this.myPerson, roles: roles.split(',') };
			}
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
		let memberDto: IMemberDto = {
			...myPersonToPerson(this.myPerson),
		};
		memberDto = excludeUndefined(memberDto);
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('not able to add new member without team context');
			return;
		}
		if (!memberDto.ageGroup) {
			throw new Error('Age group is a required field');
		}
		if (!memberDto.gender) {
			throw new Error('Gender is a required field');
		}
		if (!memberDto.roles?.length) {
			memberDto = {...memberDto, roles: [MemberRoleContributor]}
		}
		const request: ICreateTeamMemberRequest = {
			...memberDto,
			memberType: this.memberType.value,
			teamID: team.id,
		};

		this.disabled = true;
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

	onMyPersonChanged(myPerson: IMyPerson): void {
		this.myPerson = myPerson;
	}
}
