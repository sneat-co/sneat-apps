//tslint:disable:no-unsafe-any
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { excludeUndefined } from '@sneat/core';
import {
	AgeGroup,
	FamilyMemberRelation,
	familyRelationTitle,
	Gender, IMemberDto, ITitledRecord,
	MemberRelationship,
	MemberRelationshipOther, MemberRelationshipUndisclosed, MemberRole,
} from '@sneat/dto';
import { TeamBasePageDirective, TeamComponentBaseParams, TeamPageContextComponent } from '@sneat/team/components';

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
export class NewMemberPageComponent extends TeamBasePageDirective implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamPageContextComponent;

	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	public name = '';
	public email = '';
	public phone = '';
	public role?: string;
	public age?: AgeGroup;
	public gender?: Gender;
	public roles?: Role[];
	public relationship?: MemberRelationship;
	public relationships?: ITitledRecord[];
	public creating = false;
	public title = 'New member';

	constructor(
		params: TeamComponentBaseParams,
		// private readonly membersService: IMemberService,
	) {
		super('members', params);
		this.age = history.state.age as AgeGroup;
		console.log('age', this.age);
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
		if (this.age === 'child') {
			this.title = 'New child';
		}
	}

	override onTeamChanged(): void {
		// noinspection JSRedundantSwitchStatement
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
					this.age === 'child'
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
				console.log('rel options:', this.age, [...this.relationships]);
				break;
			}
			default:
				break;
		}
		console.log('roles:', this.roles);
	}

	submit(): void {
		if (!this.name.trim()) {
			alert('Please enter full name of the new member');
			this.setFocusToNameInput();
			return;
		}
		this.creating = true;
		let memberDto: IMemberDto = {
			title: this.name,
			age: this.age,
			gender: this.gender,
			email: this.email.trim() ? this.email.trim() : undefined,
			phone: this.phone.trim() ? this.phone.trim() : undefined,
		};
		if (this.role) {
			memberDto = { ...memberDto, roles: [this.role as MemberRole] };
		}
		memberDto = excludeUndefined(memberDto);

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

	id = (i: number, record: {id: string}) => record.id;

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
