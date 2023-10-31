import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { formNexInAnimation } from '@sneat/core';
import {
	AgeGroupID,
	FamilyMemberRelation,
	IRelationships,
	ITitledRecord,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	relationshipTitle,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team-models';
import { TeamRelatedFormComponent } from '../team-related-form.component';

const getRelOptions = (r: FamilyMemberRelation[]): ITitledRecord[] => [
	...r.map((id) => ({ id, title: relationshipTitle(id) })),
	{ id: MemberRelationshipOther, title: 'Other' },
	{ id: MemberRelationshipUndisclosed, title: 'Undisclosed' },
];

@Component({
	selector: 'sneat-relationship-form',
	templateUrl: 'relationship-form.component.html',
	animations: [formNexInAnimation],
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule],
})
export class RelationshipFormComponent
	extends TeamRelatedFormComponent
	implements OnChanges
{
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) ageGroup?: AgeGroupID;

	@Input({ required: true }) relatedAs?: IRelationships;
	@Output() readonly relatedAsChange = new EventEmitter<IRelationships>();

	@Input() isActive = false;
	@Input() disabled = false;

	// Defined here as it is used in the template twice
	protected readonly label = 'Related to me as';

	protected relationships?: ITitledRecord[];

	override ngOnChanges(changes: SimpleChanges): void {
		console.log('RelationshipFormComponent.ngOnChanges()', changes);
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
						? ([
								FamilyMemberRelation.child,
								FamilyMemberRelation.sibling,
								FamilyMemberRelation.cousin,
						  ] as FamilyMemberRelation[])
						: ([
								FamilyMemberRelation.spouse,
								FamilyMemberRelation.partner,
								FamilyMemberRelation.child,
								FamilyMemberRelation.sibling,
								FamilyMemberRelation.cousin,
								FamilyMemberRelation.parent,
								FamilyMemberRelation.parentInLaw,
								FamilyMemberRelation.grandparent,
								FamilyMemberRelation.grandparentInLaw,
						  ] as FamilyMemberRelation[]),
				);
				break;
			}
			default:
				break;
		}
		console.log(
			'RelationshipFormComponent.setRelationships()',
			this.team,
			this.relationships,
		);
	}

	public onRelationshipChanged(event: Event): void {
		event.stopPropagation();
		this.relatedAsChange.emit(this.relatedAs);
	}
}
