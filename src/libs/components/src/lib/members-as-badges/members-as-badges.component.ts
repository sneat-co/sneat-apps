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
import { SneatPipesModule } from '../pipes';

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
export class MembersAsBadgesComponent implements OnChanges {

	private readonly deletingMemberIDs: string[] = [];

	@Input() memberIDs?: string[];
	@Input() briefs?: IMemberBrief[];
	@Input() color: 'primary' | 'light' | 'dark' | 'medium' | 'secondary' | 'tertiary' = 'light';

	@Output() readonly deleteMember = new EventEmitter<IMemberContext>();
	public members?: IMemberContext[];

	readonly id = (_: number, m: { id: string }) => m.id;

	public isDeleting(id: string): boolean {
		return this.deletingMemberIDs.includes(id);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['members'] || changes['memberIDs'] || changes['briefs']) {
			this.members = this.memberIDs?.map((id: string): IMemberContext => {
					const brief = this.briefs?.find(m => m.id === id) || ({ id, name: { full: `member:${id}` } });
					return { id, brief };
				},
			);
			// console.log('MembersAsBadgesComponent =>', this.memberIDs, this.briefs, this.members);
		}
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
