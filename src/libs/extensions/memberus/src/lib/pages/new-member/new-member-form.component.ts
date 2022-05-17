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
import { excludeUndefined, RoutingState } from '@sneat/core';
import {
	FamilyMemberRelation, Gender,
	IMemberDto,
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

interface Role {
	checked?: boolean;
	id: string;
	title: string;
	icon: string;
}

const getRelOptions = (r: FamilyMemberRelation[]): ITitledRecord[] => [...r.map(id => ({
	id,
	title: relationshipTitle(id),
})), { id: 'other', title: 'Other' }, { id: 'undisclosed', title: 'Undisclosed' }];

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
		trigger('nextIn', [
			transition(':enter', [
				style({ opacity: 0 }),           // initial styles
				animate('250ms',
					style({ opacity: 1 }),          // final style after the transition has finished
				),
			]),
		]),
	],
})
export class NewMemberFormComponent implements AfterViewInit, OnChanges {

	private readonly hasNavHistory: boolean;

	@Input() team?: ITeamContext;

	@ViewChild('firstNameInput', { static: true }) firstNameInput?: IonInput;
	@ViewChild('fullNameInput', { static: true }) fullNameInput?: IonInput;
	@ViewChild('emailInput', { static: false }) emailInput?: IonInput;
	@ViewChild('genderFirstInput', { static: false }) genderFirstInput?: IonRadio;

	public relationships: ITitledRecord[] = getRelOptions(Object.values(FamilyMemberRelation));
	public roles?: Role[];

	public readonly fullName = new FormControl('', [
		// Validators.required,
		Validators.maxLength(50),
	]);

	public readonly firstName = new FormControl('', [
		Validators.maxLength(50),
	]);

	public readonly middleName = new FormControl('', [
		Validators.maxLength(50),
	]);

	public readonly lastName = new FormControl('', [
		Validators.maxLength(50),
	]);

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

	public isNameSet = false;

	public get hasNames(): boolean {
		return this.firstName.value || this.lastName.value || this.fullName.value;
	}

	public readonly phone = new FormControl('', []);


	public addMemberForm = new FormGroup({
		fullName: this.fullName,
		firstName: this.firstName,
		lastName: this.lastName,
		middleName: this.middleName,
		email: this.email,
		phone: this.phone,
		ageGroup: this.ageGroup,
		relationship: this.relationship,
	}, isFormValid);


	public get isComplete(): boolean {
		return this.hasNames && !!this.ageGroup.value && !!this.gender && !!this.relationship;
	}

	private isFullNameChanged = false;

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

	onNameChanged(event: Event): void {
		console.log('onNameChanged()', this.firstName.value, this.lastName.value, event);
		if (!this.isFullNameChanged) {

			const fullName = this.generateFullName();

			if (fullName !== this.fullName.value) {
				this.fullName.setValue(fullName, {
					onlySelf: true,
					emitEvent: false,
					emitModelToViewChange: true,
					emitViewToModelChange: false,
				});
			}
		}
	}

	public nameKeyupEnter(event: Event): void {
		if (!this.isNameSet) {
			this.nextFromName(event);
		} else {
			this.submit();
		}
	}

	private generateFullName(): string {
		const
			first = this.firstName.value.trim(),
			middle = this.middleName.value.trim(),
			last = this.lastName.value.trim();
		if (first && last || first && middle || middle && last) {
			return (first + ' ' + middle + ' ' + last)
				.replace('  ', ' ').trim();
		}
		return '';
	}

	onFullNameChanged(event: Event): void {
		console.log('onFullNameChanged()', this.firstName.value, this.lastName.value, event);
		if (!this.isFullNameChanged) {
			const fullName = this.generateFullName();
			if (this.fullName.value !== fullName) {
				this.isFullNameChanged = true;
			}
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('NewMemberFormComponent.ngOnChanges(), changes:', changes);
		if (changes['team']) {
			const previousValue = changes['team'].previousValue as ITeamContext | undefined,
				currentValue = changes['team'].currentValue as ITeamContext | undefined;
			if (previousValue?.type !== currentValue?.type) {
				this.onTeamTypeChanged();
			}
		}
	}

	ngAfterViewInit(): void {
		this.setFocusToInput(this.firstNameInput, 333);
	}


	submit(): void {
		if (!this.hasNames) {
			alert('Please enter first or last or full name of the new member');
			if (!this.firstName.value && !this.lastName.value) {
				this.setFocusToInput(this.firstNameInput);
			} else {
				this.setFocusToInput(this.fullNameInput);
			}
			return;
		}
		this.addMemberForm.disable();
		let memberDto: IMemberDto = {
			name: {
				full: this.fullName.value,
				first: this.firstName.value,
				last: this.lastName.value,
			},
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
			name: {
				full: this.fullName.value,
				first: this.firstName.value,
				middle: this.middleName.value,
				last: this.lastName.value,
			},
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
		if (!this.hasNames) {
			alert('At least 1 of names should be set');
			return;
		}
		this.isNameSet = true;
		setTimeout(() => {
			const setFocus = this.genderFirstInput?.setFocus;
			if (setFocus) {
				setFocus(event)
					.catch(this.errorLogger.logErrorHandler('failed to set focus to gender'));
			}
		}, 500);
	}

	public onRelationshipChanged(): void {
		if (!this.ageGroup.value) {
			const relationship = this.relationship.value;
			if (relationship.value === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
				this.ageGroup.setValue('adult');
			} else if (relationship === 'child') {
				this.ageGroup.setValue('child');
			}
		}
		this.setFocusToInput(this.emailInput);
	}

	public setFocusToInput(input?: IonInput, delay = 100): void {
		console.log('setFocusToInput()', input);
		if (!input) {
			console.error('can not set focus to undefined input');
			return;
		}
		setTimeout(
			() => {
				requestAnimationFrame(() => {
					console.log('focus to name input');
					input.setFocus()
						.catch(this.errorLogger.logErrorHandler('failed to set focus to input'));
				});
			},
			delay,
		);
	}

	private onTeamTypeChanged(): void {
		// noinspection JSRedundantSwitchStatement
		console.log('NewMemberFormComponent.onTeamTypeChanged()', this.team);
		switch (this.team?.type) {
			case 'educator':
				if (location.pathname.indexOf('staff') >= 0) {
					// this.title = 'New staff';
					// this.setDefaultBackUrl('staff');
					this.roles = [
						{ id: 'teacher', title: 'Teacher', icon: 'person' },
						{ id: 'administrator', title: 'Administrator', icon: 'robot' },
					];
				}
				break;
			case 'family': {
				this.relationships = getRelOptions(
					this.ageGroup.value === 'child'
						?
						[
							FamilyMemberRelation.child,
							FamilyMemberRelation.sibling,
							MemberRelationshipOther,
						] as FamilyMemberRelation[]
						: [
							FamilyMemberRelation.spouse,
							FamilyMemberRelation.partner,
							FamilyMemberRelation.child,
							FamilyMemberRelation.sibling,
							FamilyMemberRelation.parent,
							FamilyMemberRelation.grandparent,
							MemberRelationshipUndisclosed,
							MemberRelationshipOther,
						] as FamilyMemberRelation[],
				);
				if (this.relationship) {
					console.log('rel options:', this.ageGroup, [...this.relationships]);
				}
				break;
			}
			default:
				break;
		}
		console.log('roles:', this.roles);
	}

}
