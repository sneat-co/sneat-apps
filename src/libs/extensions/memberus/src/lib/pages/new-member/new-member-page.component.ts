//tslint:disable:no-unsafe-any
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { excludeUndefined } from '@sneat/core';
import {
	AgeGroup,
	FamilyMemberRelation,
	familyRelationTitle,
	Gender,
	IMemberDto,
	ITitledRecord,
	MemberRelationship,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	MemberRole, MemberRoleContributor,
} from '@sneat/dto';
import { TeamBasePage, TeamComponentBaseParams, TeamContextComponent } from '@sneat/team/components';
import { IAddTeamMemberRequest } from '@sneat/team/models';
import { MemberService } from '@sneat/team/services';

interface Role {
	checked?: boolean;
	id: string;
	title: string;
	icon: string;
}

@Component({
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewMemberPageComponent extends TeamBasePage implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamContextComponent;

	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	public email = '';
	public phone = '';
	public role?: string;
	public ageGroup?: AgeGroup;
	public gender?: Gender;
	public roles?: Role[];
	public relationship?: MemberRelationship;
	public relationships?: ITitledRecord[];
	public creating = false;
	public title = '';

	constructor(
		params: TeamComponentBaseParams,
		private readonly membersService: MemberService,
	) {
		super('members', params);
		this.ageGroup = history.state.age as AgeGroup;
		console.log('age', this.ageGroup);
	}

	ionViewDidEnter(): void {
		this.setFocusToNameInput();
	}

	ngAfterViewInit(): void {
		// super.ngAfterViewInit();
		this.setTeamPageContext(this.teamPageContext);
		this.ageChanged();
		this.route?.queryParams.subscribe(params => {
			this.role = params['role'];
		});
	}

	ageChanged(): void {
		if (this.ageGroup === 'child') {
			this.title = 'New child';
		}
	}

	override onTeamDtoChanged(): void {
		// noinspection JSRedundantSwitchStatement
		console.log('onTeamChanged', this.team);
		if (!this.team?.dto) {
			return;
		}
		switch (this.team.type) {
			case 'educator':
				if (location.pathname.indexOf('staff') >= 0) {
					this.title = 'New staff';
					// this.setDefaultBackUrl('staff');
					this.roles = [
						{ id: 'teacher', title: 'Teacher', icon: 'person' },
						{ id: 'administrator', title: 'Administrator', icon: 'robot' },
					];
				}
				break;
			case 'family': {
				const getRelOptions = (r: FamilyMemberRelation[]) => r.map(id => ({
					id,
					title: familyRelationTitle(id),
				}));
				this.relationships = getRelOptions(
					this.ageGroup === 'child'
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
				console.log('rel options:', this.ageGroup, [...this.relationships]);
				break;
			}
			default:
				break;
		}
		console.log('roles:', this.roles);
	}

	submit(): void {
		if (!this.title.trim()) {
			alert('Please enter full name of the new member');
			this.setFocusToNameInput();
			return;
		}
		this.creating = true;
		let memberDto: IMemberDto = {
			title: this.title,
			age: this.ageGroup,
			gender: this.gender,
			email: this.email.trim() ? this.email.trim() : undefined,
			phone: this.phone.trim() ? this.phone.trim() : undefined,
		};
		if (this.role) {
			memberDto = { ...memberDto, roles: [this.role as MemberRole] };
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
		const request: IAddTeamMemberRequest = {
			team: team.id,
			title: this.title,
			gender: this.gender,
			ageGroup: this.ageGroup,
			role: MemberRoleContributor,
		};
		if (this.email) {
			request.email = this.email;
		}
		if (this.phone) {
			request.phone = this.phone;
		}

		this.membersService.addMember(request).subscribe(member => {
			console.log('member created:', member);
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

	readonly id = (i: number, record: {id: string}) => record.id;

	public onRelationshipChanged(): void {
		if (!this.ageGroup) {
			if (this.relationship === 'parent' || this.relationship === 'spouse' || this.relationship === 'partner' || this.relationship === 'grandparent') {
				this.ageGroup = 'adult'
			} else if (this.relationship === 'child') {
				this.ageGroup = 'child';
			}
		}
		this.setFocusToNameInput();
	}
	public setFocusToNameInput(): void {
		setTimeout(
			() => {
				console.log('focus to name input');
				this.nameInput?.setFocus().catch(this.errorLogger.logError);
			},
			// tslint:disable-next-line:no-magic-numbers
			100,
		);
	}
}
