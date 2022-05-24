import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { Subject, takeUntil } from 'rxjs';
import {
	IContactGroupDto,
	defaultContactGroups,
	IContactRoleContext,
	ContactGroupService, IContactGroupContext,
} from '../../contact-group.service';
import { IContactGroupWithContacts } from '../../pages/contacts/ui-types';


@Component({
	selector: 'sneat-contact-role-form',
	templateUrl: './contact-role-form.component.html',
})
export class ContactRoleFormComponent implements OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();

	public contactGroup?: IContactGroupContext | null;

	@Input() public contactGroupID? = defaultContactGroups[0].id;
	@Output() readonly contactGroupIDChange = new EventEmitter<string | undefined>();
	@Output() readonly contactGroupChange = new EventEmitter<IContactGroupContext | undefined>();

	@Input() public contactRoleID?: string;
	@Output() readonly contactRoleIDChange = new EventEmitter<string | undefined>();
	@Output() readonly contactRoleChange = new EventEmitter<IContactRoleContext | undefined>();

	groups?: IContactGroupContext[];

	readonly id = (_: number, v: { id: string }) => v.id;

	constructor(
		private readonly contactGroupService: ContactGroupService,
	) {
		contactGroupService.getContactGroups()
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: groups => {
					this.groups = groups;
					this.setContactGroup();
				},
			});
	}

	public onContactGroupIDChanged(event: Event): void {
		event.stopPropagation();
		this.clearContactType();
		this.contactGroupIDChange.emit(this.contactGroupID);
		this.contactGroup = this.groups?.find(g => g.id === this.contactGroupID);
		this.contactGroupChange.emit(this.contactGroup);
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
		this.contactGroup = this.groups?.find(g => g.id === this.contactGroupID);
		console.log('setContactGroup()', this.contactGroupID, this.contactRoleID, this.contactGroup);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
