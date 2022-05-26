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
	template: `
		<ion-chip outline color="medium" *ngFor="let member of members">
			<ion-label color="dark">{{member|personTitle}}</ion-label>
			<ion-icon name="close" (click)="delete.emit(member)"></ion-icon>
		</ion-chip>
	`,
})
export class MembersAsBadgesComponent implements OnChanges {
	@Input() memberIDs?: string[];
	@Input() briefs?: IMemberBrief[];
	@Input() color: 'primary' | 'light' | 'dark' | 'medium' | 'secondary' | 'tertiary' = 'light';

	@Output() readonly delete = new EventEmitter<IMemberContext>();
	public members?: IMemberContext[];

	readonly id = (_: number, m: { id: string }) => m.id;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['members'] || changes['memberIDs']) {
			this.members = this.memberIDs?.map((id: string): IMemberContext => {
					const brief = this.briefs?.find(m => m.id === id) || ({ id, name: { full: `member:${id}` } });
					return { id, brief };
				},
			);
			console.log('MembersAsBadgesComponent =>', this.memberIDs, this.briefs, this.members);
		}
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
