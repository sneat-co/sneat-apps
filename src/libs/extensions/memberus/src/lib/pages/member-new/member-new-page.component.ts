//tslint:disable:no-unsafe-any
import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInput} from '@ionic/angular';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {Age, Gender} from 'sneat-shared/models/types';
import {IMemberService} from 'sneat-shared/services/interfaces';
import {
	FamilyMemberRelation,
	familyRelationTitle,
	IMemberDto,
	MemberRelationship,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	MemberRole
} from 'sneat-shared/models/dto/dto-member';
import {IRecord} from 'rxstore';
import {excludeUndefined} from '../../../../utils';
import {MemberKind} from '../../../../models/kinds';
import {ITitledRecord} from '../../../../models/dto/dto-models';

interface Role {
	checked?: boolean;
	id: string;
	title: string;
	icon: string;
}

@Component({
	selector: 'app-member-new',
	templateUrl: './member-new-page.component.html',
	providers: [CommuneBasePageParams],
})
export class MemberNewPageComponent extends CommuneBasePage implements OnInit {

	@ViewChild('nameInput', {static: false}) nameInput: IonInput;

	public name = '';
	public email = '';
	public phone = '';
	public role: string;
	public age?: Age;
	public gender?: Gender;
	public roles: Role[];
	public relationship: MemberRelationship;
	public relationships: ITitledRecord[];
	public creating: boolean;
	public title = 'New member';

	constructor(
		params: CommuneBasePageParams,
		private readonly membersService: IMemberService,
	) {
		super('members', params);
		this.age = history.state.age as Age;
		console.log('age', this.age);
	}

	ionViewDidEnter(): void {
		this.setFocusToNameInput();
	}

	private setFocusToNameInput(): void {
		setTimeout(
			() => {
				console.log('focus to name input');
				this.nameInput.setFocus()
					.catch(this.errorLogger.logError);

			},
			// tslint:disable-next-line:no-magic-numbers
			100,
		);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.ageChanged();
		this.route.queryParams.subscribe(params => {
			this.role = params.role;
		});
	}

	ageChanged(): void {
		if (this.age === 'child') {
			this.title = 'New child';
		}
	}

	onCommuneChanged(): void {
		// noinspection JSRedundantSwitchStatement
		if (!this.commune) {
			return;
		}
		switch (this.commune.type) {
			case 'educator':
				if (location.pathname.indexOf('staff') >= 0) {
					this.title = 'New staff';
					this.setDefaultBackUrl('staff');
					this.roles = [
						{id: 'teacher', title: 'Teacher', icon: 'person'},
						{id: 'administrator', title: 'Administrator', icon: 'robot'},
					];
				}
				break;
			case 'family':
				const getRelOptions = (rels: FamilyMemberRelation[]) => rels.map(id => ({id, title: familyRelationTitle(id)}));
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
						] as FamilyMemberRelation[]
				);
				console.log('rel options:', this.age, [...this.relationships]);
				break;
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
			memberDto = {...memberDto, roles: [this.role as MemberRole]};
		}
		memberDto = excludeUndefined(memberDto);

		this.startCommuneReadwriteTx([MemberKind], (tx, communeDto, userDto) =>
			this.membersService.addCommuneItem(
				{
					...memberDto,
					communeId: communeDto.id,
				},
				tx,
			))
			.subscribe({
					next: member => {
						console.log('New member ID:', member.id);
						setTimeout(
							() => {
								this.navigateRoot(
									'member',
									{id: member.id},
									{memberDto: member},
								);
							},
							// tslint:disable-next-line:no-magic-numbers
							100,
						);
					},
					error: err => {
						this.errorLogger.logError(err, 'Failed to create new member');
					},
				},
			);
	}

	trackById = (i: number, record: IRecord) => record.id;
}
