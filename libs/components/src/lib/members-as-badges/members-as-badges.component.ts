import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactContext } from '@sneat/team-models';
import { SneatPipesModule } from '../pipes/sneat-pipes.module';

@Component({
	selector: 'sneat-members-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IonicModule, SneatPipesModule],
	styles: ['.deleting {text-decoration: line-through}'],
	template: `
		<ion-chip outline color="medium" *ngFor="let member of members || []">
			<ion-label color="medium" [class.deleting]="isDeleting(member.id)">{{
				member | personTitle
			}}</ion-label>
			<ion-icon
				*ngIf="showDelete && !isDeleting(member.id)"
				name="close"
				(click)="delete($event, member)"
			/>
			<ion-spinner name="lines-sharp-small" *ngIf="isDeleting(member.id)" />
		</ion-chip>
	`,
})
export class MembersAsBadgesComponent {
	private readonly deletingMemberIDs: string[] = [];

	@Input() public members?: readonly IContactContext[];
	@Input() color:
		| 'primary'
		| 'light'
		| 'dark'
		| 'medium'
		| 'secondary'
		| 'tertiary' = 'light';
	@Input() showDelete = false;

	@Output() readonly deleteMember = new EventEmitter<IContactContext>();

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public isDeleting(id: string): boolean {
		return this.deletingMemberIDs.includes(id);
	}

	delete(event: Event, member: IContactContext): void {
		event.stopPropagation();
		this.deletingMemberIDs.push(member.id);
		this.deleteMember.emit(member);
	}
}
