import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { PersonTitle } from '../pipes';

@Component({
	selector: 'sneat-contacts-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IonicModule, PersonTitle],
	styles: ['.deleting {text-decoration: line-through}'],
	template: `
		@for (member of members || []; track member.id) {
			<ion-chip outline color="medium">
				<ion-label color="medium" [class.deleting]="isDeleting(member.id)">
					{{ member | personTitle }}
				</ion-label>
				<ion-icon
					*ngIf="showDelete && !isDeleting(member.id)"
					name="close-outline"
					(click)="delete($event, member)"
				/>
				<ion-spinner name="lines-sharp-small" *ngIf="isDeleting(member.id)" />
			</ion-chip>
		}
	`,
})
export class ContactsAsBadgesComponent {
	private readonly deletingMemberIDs: string[] = [];

	@Input({ required: true })
	public members?: readonly IContactWithBriefAndSpace[];
	@Input() color:
		| 'primary'
		| 'light'
		| 'dark'
		| 'medium'
		| 'secondary'
		| 'tertiary' = 'light';
	@Input() showDelete = false;

	@Output() readonly deleteMember = new EventEmitter<IContactWithBrief>();

	public isDeleting(id: string): boolean {
		return this.deletingMemberIDs.includes(id);
	}

	protected delete(event: Event, member: IContactWithBrief): void {
		event.stopPropagation();
		this.deletingMemberIDs.push(member.id);
		this.deleteMember.emit(member);
	}
}
