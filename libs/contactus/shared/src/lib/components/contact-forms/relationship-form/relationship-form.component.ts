import { JsonPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
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
	IWithCreatedShort,
} from '@sneat/dto';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { SpaceRelatedFormComponent } from '../space-related-form.component';

const getRelOptions = (r: FamilyMemberRelation[]): ISelectItem[] => [
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
		IonItemDivider,
		IonLabel,
		SelectFromListComponent,
		IonButtons,
		IonButton,
		IonIcon,
		IonSpinner,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-relationship-form',
	templateUrl: 'relationship-form.component.html',
})
export class RelationshipFormComponent extends SpaceRelatedFormComponent {
	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	public readonly $relatedToTarget = input.required<
		ISpaceModuleItemRef | undefined
	>();

	// TODO: Needs documentation on what it is
	public readonly $relatedItems = input.required<
		IRelatedItemsByModule | undefined
	>();

	protected readonly $relatedToTargetAs = computed(() => {
		const relatedTo = this.$relatedToTarget();
		if (!relatedTo) {
			return undefined;
		}
		const relatedItems = this.$relatedItems();
		if (!relatedItems) {
			return undefined;
		}
		return getRelatedItemByKey(
			relatedItems,
			relatedTo.module,
			relatedTo.collection,
			relatedTo.space,
			relatedTo.itemID,
		);
	});

	protected readonly $rolesOfItemRelatedToTarget = computed<
		readonly IRelationshipWithID[] | undefined
	>(() => {
		const relatedItem = this.$relatedToTargetAs();
		if (!relatedItem) {
			return undefined;
		}
		const rolesOfItem: IRelationshipWithID[] = [];
		Object.entries(relatedItem.rolesOfItem || {}).forEach(([id, rel]) => {
			const roleOfItem: IRelationshipWithID = {
				id,
				...rel,
			};
			rolesOfItem.push(roleOfItem);
		});
		return rolesOfItem;
	});

	protected readonly $useSelect = computed(() => {
		const n = this.$rolesOfItemRelatedToTarget()?.length;
		return n === 0 || n === 1;
	});

	@Output() readonly relatedAsChange = new EventEmitter<IRelationshipRoles>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	protected readonly relatedAsSingle = new FormControl<string>('');

	constructor(private readonly userService: SneatUserService) {
		super('RelationshipFormComponent');
	}

	// Defined here as it is used in the template twice
	protected readonly label = 'Related to me as';

	protected $relationshipOptions = computed(() => {
		switch (this.$spaceType()) {
			case 'family': {
				return getRelOptions(
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
			}
			default:
				return [];
		}
	});

	protected onRelationshipChanged(value: string): void {
		console.log('onRelationshipChanged()', value);
		const created: IWithCreatedShort = {
			at: new Date().toISOString().substring(0, 10),
			by: this.userService.currentUserID as unknown as string,
		};
		// this.relatedAsRelationships = [value];
		this.relatedAsChange.emit({ [value]: { created } });
	}
}
