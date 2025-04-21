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
	AgeGroupID,
	FamilyMemberRelation,
	IRelatedChange,
	MemberRelationshipOther,
	MemberRelationshipUndisclosed,
	relationshipTitle,
} from '@sneat/contactus-core';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { WithSpaceInput } from '@sneat/space-components';
import { ISelectItem } from '@sneat/ui';
import { RelationshipFormComponent } from './relationship-form.component';
import { IRelatedTo, IRelationshipRoles } from '@sneat/dto';

const getRelOptions = (r: FamilyMemberRelation[]): ISelectItem[] => [
	...r.map((id) => ({ id, title: relationshipTitle(id) })),
	{ id: MemberRelationshipOther, title: 'Other' },
	{ id: MemberRelationshipUndisclosed, title: 'Undisclosed' },
];

@Component({
	selector: 'sneat-contact-relationship-form',
	template: `
		<sneat-relationship-form
			[$space]="$space()"
			[$relatedTo]="$relatedTo()"
			[$relationshipOptions]="$relationshipOptions()"
			[$isProcessing]="$isProcessing()"
			[disabled]="disabled"
			[isActive]="isActive"
			(relatedAsChange)="onRelatedAsChanged($event)"
		/>
	`,
	imports: [RelationshipFormComponent],
})
export class ContactRelationshipFormComponent extends WithSpaceInput {
	public readonly $contactID = input.required<string | undefined>();

	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	public readonly $relatedTo = input.required<IRelatedTo | undefined>();
	public readonly $isProcessing = signal(false);

	public readonly $userSpaceContactID = input.required<
		string | null | undefined
	>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	@Output() readonly relatedAsChange = new EventEmitter<IRelationshipRoles>();

	private readonly contactService = inject(ContactService);

	public constructor() {
		super('ContactRelationshipFormComponent');
	}

	protected onRelatedAsChanged(relatedChange: IRelatedChange): void {
		console.log('onRelatedAsChanged(relatedChange)', relatedChange);
		const contactID = this.$contactID();
		const spaceID = this.$spaceID();
		if (!contactID) {
			throw new Error('onRelatedAsChanged() - contactID is not set');
		}
		if (!spaceID) {
			throw new Error('onRelatedAsChanged() - spaceID is not set');
		}
		const userContactID = this.$userSpaceContactID();
		if (!userContactID) {
			throw new Error('onRelatedAsChanged() - userContactID is not set');
		}

		const request: IUpdateContactRequest = {
			contactID,
			spaceID,
			related: [
				{
					itemRef: {
						space: this.$spaceID() || '',
						module: 'contactus',
						collection: 'contacts',
						itemID: userContactID,
					},
					...relatedChange,
				},
			],
		};
		this.$isProcessing.set(true);
		this.contactService.updateContact(request).subscribe({
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
