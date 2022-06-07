import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';
import { IMemberContext } from '@sneat/team/models';
import { SneatPipesModule } from '../pipes/sneat-pipes.module';

@Component({
	selector: 'sneat-members-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: ['.deleting {text-decoration: line-through}'],
	template: `
		<ion-chip outline color="medium" *ngFor="let member of members">
			<ion-label [color]="isDeleting(member.id) ? 'medium' : 'dark'" [class.deleting]="isDeleting(member.id)">{{member|personTitle}}</ion-label>
			<ion-icon *ngIf="!isDeleting(member.id)" name="close" (click)="delete($event, member)"></ion-icon>
			<ion-spinner name="lines-sharp-small" *ngIf="isDeleting(member.id)"></ion-spinner>
		</ion-chip>
	`,
})
export class MembersAsBadgesComponent {

	private readonly deletingMemberIDs: string[] = [];

	@Input() public members?: readonly IMemberContext[];
	@Input() color: 'primary' | 'light' | 'dark' | 'medium' | 'secondary' | 'tertiary' = 'light';

	@Output() readonly deleteMember = new EventEmitter<IMemberContext>();

	readonly id = (_: number, m: { id: string }) => m.id;

	public isDeleting(id: string): boolean {
		return this.deletingMemberIDs.includes(id);
	}

	delete(event: Event, member: IMemberContext): void {
		event.stopPropagation();
		this.deletingMemberIDs.push(member.id);
		this.deleteMember.emit(member);
	}
}

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
	],
	declarations: [MembersAsBadgesComponent],
	exports: [MembersAsBadgesComponent],
})
export class MembersAsBadgesModule {
}
