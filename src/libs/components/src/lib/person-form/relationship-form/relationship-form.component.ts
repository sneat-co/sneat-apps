import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import {
	AgeGroup,
	FamilyMemberRelation,
	ITitledRecord,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed, relationshipTitle,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { TeamRelatedFormComponent } from '../team-related-form.component';

const getRelOptions = (r: FamilyMemberRelation[]): ITitledRecord[] => [
	...r.map(id => ({ id, title: relationshipTitle(id) })),
	{ id: MemberRelationshipOther, title: 'Other' },
	{ id: MemberRelationshipUndisclosed, title: 'Undisclosed' },
];

@Component({
	selector: 'sneat-relationship-form',
	templateUrl: 'relationship-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class RelationshipFormComponent extends TeamRelatedFormComponent implements OnChanges {
	@Input() isActive = false;
	@Input() disabled = false;
	@Input() team?: ITeamContext;
	@Input() relationship?: string;
	@Input() ageGroup?: AgeGroup;
	@Output() readonly relationshipChange = new EventEmitter<string>();

	public readonly label = 'Related to me as';

	public relationships?: ITitledRecord[];

	override ngOnChanges(changes: SimpleChanges): void {
		if (changes['ageGroup']) {
			this.setRelationships();
		}
	}

	//
	// override onTeamTypeChanged(): void {
	//
	//
	// }

	private setRelationships(): void {
		switch (this.team?.type) {
			case 'family': {
				this.relationships = getRelOptions(
					this.ageGroup === 'child'
						?
						[
							FamilyMemberRelation.child,
							FamilyMemberRelation.sibling,
							FamilyMemberRelation.cousin,
						] as FamilyMemberRelation[]
						: [
							FamilyMemberRelation.spouse,
							FamilyMemberRelation.partner,
							FamilyMemberRelation.child,
							FamilyMemberRelation.sibling,
							FamilyMemberRelation.cousin,
							FamilyMemberRelation.parent,
							FamilyMemberRelation.grandparent,
						] as FamilyMemberRelation[],
				);
				break;
			}
			default:
				break;
		}
		console.log('RelationshipFormComponent.setRelationships()', this.team, this.relationships);
	}

	public onRelationshipChanged(event: Event): void {
		event.stopPropagation();
		this.relationshipChange.emit(this.relationship);
	}

}
