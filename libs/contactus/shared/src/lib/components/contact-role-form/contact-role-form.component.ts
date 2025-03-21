import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ISelectItem } from '@sneat/components';
import {
	ContactGroupService,
	defaultFamilyContactGroups,
} from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndDbo } from '@sneat/core';
import {
	IContactGroupDbo,
	IContactRoleBriefWithID,
} from '@sneat/contactus-core';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-contact-role-form',
	templateUrl: './contact-role-form.component.html',
	standalone: false,
})
export class ContactRoleFormComponent
	extends SneatBaseComponent
	implements OnChanges
{
	public contactGroup?: IIdAndDbo<IContactGroupDbo> | null;

	@Input() public contactGroupID? = defaultFamilyContactGroups[0].id;

	@Output() readonly contactGroupIDChange = new EventEmitter<
		string | undefined
	>();

	@Output() readonly contactGroupChange = new EventEmitter<
		IIdAndDbo<IContactGroupDbo> | undefined
	>();

	@Input() public contactRoleID?: string;

	@Output() readonly contactRoleIDChange = new EventEmitter<
		string | undefined
	>();

	@Output() readonly contactRoleChange = new EventEmitter<
		IIdAndBrief<IContactRoleBriefWithID> | undefined
	>();

	protected groups?: readonly IIdAndDbo<IContactGroupDbo>[];

	protected get groupItems(): readonly ISelectItem[] {
		return (
			this.groups?.map((g) => ({
				id: g.id,
				title: g.dbo.title,
				emoji: g.dbo.emoji,
			})) || []
		);
	}

	protected readonly roleBriefID = (_: number, o: IContactRoleBriefWithID) =>
		o.id;
	protected readonly groupID = (_: number, o: IIdAndDbo<IContactGroupDbo>) =>
		o.id;

	constructor(private readonly contactGroupService: ContactGroupService) {
		super('ContactRoleFormComponent');
		contactGroupService
			.getContactGroups()
			.pipe(takeUntil(this.destroyed$))
			.subscribe({
				next: (groups) => {
					this.groups = groups;
					this.setContactGroup();
				},
			});
	}

	public onContactGroupIDChanged(contactGroupID: string): void {
		// event.stopPropagation();
		this.contactGroupID = contactGroupID;
		this.clearContactType();
		this.contactGroupIDChange.emit(this.contactGroupID);
		this.contactGroup = this.groups?.find((g) => g.id === this.contactGroupID);
		this.contactGroupChange.emit(this.contactGroup || undefined);
	}

	public onContactRoleIDChanged(event: Event): void {
		event.stopPropagation();
		// const contactRole = this.contactGroup?.dto?.roles?.find(r => r.id === this.contactRoleID);
		this.contactRoleIDChange.emit(this.contactRoleID);
	}

	clearContactType(): void {
		this.contactRoleID = undefined;
		this.contactRoleIDChange.emit(this.contactRoleID);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactGroupID']) {
			this.setContactGroup();
		}
	}

	private setContactGroup(): void {
		this.contactGroup = this.groups?.find((g) => g.id === this.contactGroupID);
		console.log(
			'setContactGroup()',
			this.contactGroupID,
			this.contactRoleID,
			this.contactGroup,
		);
	}
}
