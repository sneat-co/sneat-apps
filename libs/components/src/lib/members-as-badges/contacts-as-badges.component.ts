import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import {
	IonChip,
	IonIcon,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import {
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { PersonTitle } from '../pipes';

@Component({
	selector: 'sneat-contacts-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PersonTitle, IonChip, IonLabel, IonIcon, IonSpinner],
	styles: ['.deleting {text-decoration: line-through}'],
	template: `
		@for (member of members || []; track member.id) {
			<ion-chip outline="true" color="medium">
				<ion-label color="medium" [class.deleting]="isDeleting(member.id)">
					{{ member | personTitle }}
				</ion-label>
				@if (showDelete && !isDeleting(member.id)) {
					<ion-icon name="close-outline" (click)="delete($event, member)" />
				}
				@if (isDeleting(member.id)) {
					<ion-spinner name="lines-sharp-small" />
				}
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
