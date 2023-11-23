import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { formNexInAnimation } from '@sneat/core';
import {
	AgeGroupID,
	FamilyMemberRelation,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	relationshipTitle,
} from '@sneat/contactus-core';
import {
	IRelatedItemsByTeam,
	IRelationships,
	ITeamModuleDocRef,
	ITitledRecord,
	IWithCreatedShort,
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
	imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class RelationshipFormComponent
	extends TeamRelatedFormComponent
	implements OnChanges
{
	@Input({ required: true }) public team?: ITeamContext;
	@Input({ required: true }) public ageGroup?: AgeGroupID;

	@Input({ required: true }) public relatedTo?: ITeamModuleDocRef;
	@Input() public allRelated?: IRelatedItemsByTeam;
	@Input() public relatedAs?: string[];

	@Output() readonly relatedAsChange = new EventEmitter<IRelationships>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	protected readonly relatedAsSingle = new FormControl<string>('');

	constructor(private readonly userService: SneatUserService) {
		super();
	}

	// Defined here as it is used in the template twice
	protected readonly label = 'Related to me as';

	protected relationshipOptions?: ITitledRecord[];

	override ngOnChanges(changes: SimpleChanges): void {
		console.log('RelationshipFormComponent.ngOnChanges()', changes);
		if (changes['ageGroup'] || changes['team']) {
			this.setRelationships();
		}
		if (changes['relatedTo'] || changes['allRelated']) {
			this.onRelatedChanged();
		}
	}

	private onRelatedChanged(): void {
		console.log(
			'RelationshipFormComponent.onRelatedToChanged()',
			this.relatedTo,
		);
		if (this.relatedTo && this.allRelated) {
			if (!this.relatedTo.teamID) {
				console.error(
					'onRelatedChanged(): relatedTo.teamID is not set',
					this.relatedTo,
				);
			}
			const relatedItem =
				this.allRelated[this.relatedTo.teamID]?.[this.relatedTo.moduleID]?.[
					this.relatedTo.collection
				]?.[this.relatedTo.itemID];
			if (relatedItem) {
				const relatedAsIDs = Object.keys(relatedItem.relatedAs || {});
				this.relatedAs = relatedAsIDs;
				this.relatedAsSingle.setValue(
					relatedAsIDs.length == 1 ? relatedAsIDs[0] : '',
				);
				return;
			}
		}
		this.relatedAsSingle.setValue('');
		this.relatedAs = undefined;
	}

	//
	// override onTeamTypeChanged(): void {
	//
	//
	// }

	private setRelationships(): void {
		switch (this.team?.type) {
			case 'family': {
				this.relationshipOptions = getRelOptions(
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
			this.relationshipOptions,
		);
	}

	protected onRelationshipChanged(event: Event): void {
		event.stopPropagation();
		const ce = event as CustomEvent;
		const value = ce.detail.value as string;
		console.log('onRelationshipChanged()', value);
		const created: IWithCreatedShort = {
			on: new Date().toISOString().substring(0, 10),
			by: this.userService.currentUserID as unknown as string,
		};
		this.relatedAs = [value];
		this.relatedAsChange.emit({ [value]: { created } });
	}
}
