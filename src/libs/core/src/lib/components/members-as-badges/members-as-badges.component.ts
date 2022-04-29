import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';

@Component({
	selector: 'sneat-members-as-badges',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-badge *ngFor="let member of members" color="tertiary"
							 style="font-weight: normal; padding: 0.5em">
			{{member.title}}
		</ion-badge>
	`,
})
export class MembersAsBadgesComponent implements OnChanges {
	@Input() memberIDs?: string[];
	@Input() briefs?: IMemberBrief[];

	public members?: IMemberBrief[];

	readonly id = (_: number, m: IMemberBrief): string => m.id;

	title(id: string): string {
		const member = this.briefs?.find(m => m.id === id);
		return member?.title || `member:${id}`;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.members = this.memberIDs?.map(
			(id: string): IMemberBrief => this.briefs?.find(m => m.id === id) || ({ id, title: `member:${id}` }),
		);
	}
}

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [MembersAsBadgesComponent],
	exports: [MembersAsBadgesComponent],
})
export class MembersAsBadgesModule {
}
