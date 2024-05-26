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
	getRelatedItemByKey,
	IRelatedItem,
	IRelatedItemsByModule,
	IRelationshipRole,
	IRelationshipRoles,
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

interface IRelationshipWithID extends IRelationshipRole {
	readonly id: string;
}

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

	@Input({ required: true }) public relatedItems?: IRelatedItemsByModule;

	protected rolesOfItem?: readonly IRelationshipWithID[];

	@Output() readonly relatedAsChange = new EventEmitter<IRelationshipRoles>();

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
		if (changes['relatedTo'] || changes['relatedItems']) {
			this.onRelatedChanged();
		}
	}

	private onRelatedChanged(): void {
		console.log(
			'RelationshipFormComponent.onRelatedToChanged()',
			'relatedTo:',
			this.relatedTo,
			'relatedItems:',
			this.relatedItems,
		);
		if (this.relatedTo && this.relatedItems) {
			if (!this.relatedTo.teamID) {
				console.error(
					'onRelatedChanged(): relatedTo.teamID is not set',
					this.relatedTo,
				);
			}
			const relatedItem = getRelatedItemByKey(
				this.relatedItems,
				this.relatedTo.moduleID,
				this.relatedTo.collection,
				this.relatedTo.teamID,
				this.relatedTo.itemID,
			);
			if (relatedItem) {
				const rolesOfItem: IRelationshipWithID[] = [];
				Object.entries(relatedItem.rolesOfItem || {}).forEach(([id, rel]) => {
					const roleOfItem: IRelationshipWithID = {
						id,
						...rel,
					};
					rolesOfItem.push(roleOfItem);
				});
				this.rolesOfItem = rolesOfItem;
				return;
			}
		}
		this.relatedAsSingle.setValue('');
		this.rolesOfItem = undefined;
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
			at: new Date().toISOString().substring(0, 10),
			by: this.userService.currentUserID as unknown as string,
		};
		// this.relatedAsRelationships = [value];
		this.relatedAsChange.emit({ [value]: { created } });
	}
}
