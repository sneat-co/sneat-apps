import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	input,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonBadge,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonRadio,
	IonRadioGroup,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
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
	IRelatedItemsByModule,
	IRelationshipRole,
	IRelationshipRoles,
	ISpaceModuleItemRef,
	ITitledRecord,
	IWithCreatedShort,
} from '@sneat/dto';
import { SpaceRelatedFormComponent } from '../space-related-form.component';

const getRelOptions = (r: FamilyMemberRelation[]): ITitledRecord[] => [
	...r.map((id) => ({ id, title: relationshipTitle(id) })),
	{ id: MemberRelationshipOther, title: 'Other' },
	{ id: MemberRelationshipUndisclosed, title: 'Undisclosed' },
];

interface IRelationshipWithID extends IRelationshipRole {
	readonly id: string;
}

@Component({
	animations: [formNexInAnimation],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		IonCard,
		IonItem,
		IonIcon,
		IonSelect,
		IonSelectOption,
		IonItemGroup,
		IonItemDivider,
		IonLabel,
		IonRadioGroup,
		IonRadio,
		IonBadge,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-relationship-form',
	templateUrl: 'relationship-form.component.html',
})
export class RelationshipFormComponent
	extends SpaceRelatedFormComponent
	implements OnChanges
{
	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	public readonly $relatedTo = input.required<
		ISpaceModuleItemRef | undefined
	>();

	public readonly $relatedItems = input.required<
		IRelatedItemsByModule | undefined
	>();

	protected rolesOfItem?: readonly IRelationshipWithID[];

	@Output() readonly relatedAsChange = new EventEmitter<IRelationshipRoles>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	protected readonly relatedAsSingle = new FormControl<string>('');

	constructor(private readonly userService: SneatUserService) {
		super('RelationshipFormComponent');
	}

	// Defined here as it is used in the template twice
	protected readonly label = 'Related to me as';

	protected relationshipOptions?: ITitledRecord[];

	override ngOnChanges(changes: SimpleChanges): void {
		console.log('RelationshipFormComponent.ngOnChanges()', changes);
		if (changes['ageGroup'] || changes['space']) {
			this.setRelationships();
		}
		if (changes['relatedTo'] || changes['relatedItems']) {
			this.onRelatedChanged();
		}
	}

	private onRelatedChanged(): void {
		const relatedTo = this.$relatedTo();
		const relatedItems = this.$relatedItems();
		console.log(
			'RelationshipFormComponent.onRelatedToChanged()',
			'relatedTo:',
			relatedTo,
			'relatedItems:',
			relatedItems,
		);
		if (!relatedTo || !relatedItems) {
			this.relatedAsSingle.setValue('');
			this.rolesOfItem = undefined;
			return;
		}
		if (!relatedTo.space) {
			console.error(
				'onRelatedChanged(): relatedTo.spaceID is not set',
				relatedTo,
			);
			return;
		}
		const relatedItem = relatedTo
			? getRelatedItemByKey(
					this.$relatedItems(),
					relatedTo.module,
					relatedTo.collection,
					relatedTo.space,
					relatedTo.itemID,
				)
			: undefined;
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

	//
	// override onSpaceTypeChanged(): void {
	//
	//
	// }

	private setRelationships(): void {
		switch (this.$spaceType()) {
			case 'family': {
				this.relationshipOptions = getRelOptions(
					this.$ageGroup() === 'child'
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
			this.$spaceRef(),
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
