import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListComponent } from '@sneat/components';
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

@Component({
	selector: 'sneat-contact-role-form',
	templateUrl: './contact-role-form.component.html',
	imports: [IonicModule, SelectFromListComponent, TitleCasePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRoleFormComponent
	extends SneatBaseComponent
	implements OnChanges
{
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	protected contactGroup?: IIdAndDbo<IContactGroupDbo> | null;

	@Input({ required: true }) contactGroupID?: string =
		defaultFamilyContactGroups[0].id;

	@Output() readonly contactGroupIDChange = new EventEmitter<
		string | undefined
	>();

	@Output() readonly contactGroupChange = new EventEmitter<
		IIdAndDbo<IContactGroupDbo> | undefined
	>();

	@Input({ required: true }) public contactRoleID?: string;

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

	protected readonly roleBriefID = (o: IContactRoleBriefWithID) => o.id;
	protected readonly groupID = (_: number, o: IIdAndDbo<IContactGroupDbo>) =>
		o.id;

	constructor(contactGroupService: ContactGroupService) {
		super('ContactRoleFormComponent');
		contactGroupService
			.getContactGroups()
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (groups) => {
					this.groups = groups;
					this.setContactGroup();
				},
			});
	}

	protected onContactGroupIDChanged(contactGroupID: string): void {
		// event.stopPropagation();
		this.contactGroupID = contactGroupID;
		this.clearContactType();
		this.contactGroupIDChange.emit(this.contactGroupID);
		this.contactGroup = this.groups?.find((g) => g.id === this.contactGroupID);
		this.contactGroupChange.emit(this.contactGroup || undefined);
	}

	protected onContactRoleIDChanged(event: CustomEvent): void {
		event.stopPropagation();
		this.contactRoleID = event.detail.value as string;
		this.contactRoleIDChange.emit(this.contactRoleID);
		this.changeDetectorRef.markForCheck();
	}

	protected clearContactType(): void {
		this.contactRoleID = undefined;
		this.contactRoleIDChange.emit(this.contactRoleID);
		this.changeDetectorRef.markForCheck();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactGroupID']) {
			this.setContactGroup();
		}
	}

	private setContactGroup(): void {
		const contactGroupID = this.contactGroupID;
		this.contactGroup = this.groups?.find((g) => g.id === contactGroupID);
		this.changeDetectorRef.markForCheck();
		// console.log(`setContactGroup(): contactGroupID=${contactGroupID}`);
	}
}
