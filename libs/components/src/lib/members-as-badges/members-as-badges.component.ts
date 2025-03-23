import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { PersonTitle } from '../pipes';

@Component({
	selector: 'sneat-members-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IonicModule, PersonTitle],
	styles: ['.deleting {text-decoration: line-through}'],
	template: `
		@for (member of members || []; track member.id) {
			<ion-chip outline color="medium">
				<ion-label color="medium" [class.deleting]="isDeleting(member.id)"
					>{{ member | personTitle }}
				</ion-label>
				<ion-icon
					*ngIf="showDelete && !isDeleting(member.id)"
					name="close"
					(click)="delete($event, member)"
				/>
				<ion-spinner name="lines-sharp-small" *ngIf="isDeleting(member.id)" />
			</ion-chip>
		}
	`,
})
export class MembersAsBadgesComponent {
	private readonly deletingMemberIDs: string[] = [];

	@Input({ required: true })
	public members?: readonly IIdAndBrief<IContactBrief>[];
	@Input() color:
		| 'primary'
		| 'light'
		| 'dark'
		| 'medium'
		| 'secondary'
		| 'tertiary' = 'light';
	@Input() showDelete = false;

	@Output() readonly deleteMember = new EventEmitter<
		IIdAndBrief<IContactBrief>
	>();

	public isDeleting(id: string): boolean {
		return this.deletingMemberIDs.includes(id);
	}

	protected delete(event: Event, member: IIdAndBrief<IContactBrief>): void {
		event.stopPropagation();
		this.deletingMemberIDs.push(member.id);
		this.deleteMember.emit(member);
	}
}
