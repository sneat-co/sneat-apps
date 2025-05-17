import {
	Component,
	computed,
	EventEmitter,
	inject,
	Input,
	input,
	Output,
	signal,
} from '@angular/core';
import {
	FamilyMemberRelation,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	relationshipTitle,
} from '@sneat/contactus-core';
import { AgeGroupID } from '@sneat/core';
import { WithSpaceInput } from '@sneat/space-services';
import { IRelatedChange, IUpdateRelatedRequest } from '@sneat/space-models';
import { SpaceService } from '@sneat/space-services';
import { ISelectItem } from '@sneat/ui';
import { RelationshipFormComponent } from './relationship-form.component';
import {
	IRelatedTo,
	IRelationshipRoles,
	ISpaceModuleItemRef,
	WritableRelationshipRoles,
} from '@sneat/dto';

const getRelOptions = (r: FamilyMemberRelation[]): ISelectItem[] => [
	...r.map((id) => ({ id, title: relationshipTitle(id) })),
	{ id: MemberRelationshipOther, title: 'Other' },
	{ id: MemberRelationshipUndisclosed, title: 'Undisclosed' },
];

@Component({
	selector: 'sneat-contact-relationship-form',
	templateUrl: './contact-relationship-form.component.html',
	imports: [RelationshipFormComponent],
})
export class ContactRelationshipFormComponent extends WithSpaceInput {
	public readonly $contactID = input.required<string | undefined>();

	protected readonly $itemRef = computed<ISpaceModuleItemRef | undefined>(
		() => {
			const spaceID = this.$spaceID();
			const itemID = this.$contactID();
			return spaceID && itemID
				? {
						spaceID,
						module: 'contactus',
						collection: 'contacts',
						itemID,
					}
				: undefined;
		},
	);

	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	public readonly $relatedTo = input.required<IRelatedTo | undefined>();
	public readonly $isProcessing = signal(false);

	public readonly $userSpaceContactID = input.required<
		string | null | undefined
	>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	@Output() readonly relatedAsChange = new EventEmitter<IRelationshipRoles>();

	private readonly spaceService = inject(SpaceService);

	public constructor() {
		super('ContactRelationshipFormComponent');
	}

	protected onRelatedAsChanged(relatedChange: IRelatedChange): void {
		console.log('onRelatedAsChanged(relatedChange)', relatedChange);
		const contactID = this.$contactID();
		const spaceID = this.$spaceID();
		if (!contactID) {
			const relRoles: WritableRelationshipRoles = {};
			relatedChange.remove?.rolesToItem?.forEach(
				(role: string) => delete relRoles[role],
			);
			relatedChange.add?.rolesToItem?.forEach(
				(role: string) => (relRoles[role] = { created: { at: '', by: '' } }),
			);
			this.relatedAsChange.emit(relRoles);
			return;
		}
		if (!spaceID) {
			throw new Error('onRelatedAsChanged() - spaceID is not set');
		}
		const userContactID = this.$userSpaceContactID();
		if (!userContactID) {
			throw new Error('onRelatedAsChanged() - userContactID is not set');
		}

		const request: IUpdateRelatedRequest = {
			spaceID,
			moduleID: 'contactus',
			collection: 'contacts',
			id: contactID,
			related: [
				{
					itemRef: {
						spaceID: this.$spaceID() || '',
						module: 'contactus',
						collection: 'contacts',
						itemID: userContactID,
					},
					...relatedChange,
				},
			],
		};
		this.$isProcessing.set(true);
		this.spaceService.updateRelated(request).subscribe({
			next: () => {
				console.log('onRelatedAsChanged() - contact updated');
				this.$isProcessing.set(false);
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to update contact');
				setTimeout(() => this.$isProcessing.set(false), 500);
			},
		});
	}

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
}
