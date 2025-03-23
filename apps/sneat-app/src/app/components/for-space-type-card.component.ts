import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonItemDivider,
	IonLabel,
	IonList,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceType } from '@sneat/core';
import { SpacesListComponent } from '@sneat/team-components';
import {
	ISpaceContext,
	spaceContextFromBrief,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription, takeUntil } from 'rxjs';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-for-space-card',
	templateUrl: 'for-space-type-card.component.html',
	imports: [
		RouterModule,
		SpacesListComponent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonButton,
		IonLabel,
		IonList,
		IonItemDivider,
	],
})
export class ForSpaceTypeCardComponent
	extends SneatBaseComponent
	implements OnChanges, OnDestroy
{
	@Input() emptyTitle?: string;
	@Input() itemsTitle?: string;
	@Input() buttonColor?: string;
	@Input() newSpaceButtonText?: string;
	@Input() singleSpaceButtonText?: string;
	@Input() spaceTypes?: SpaceType[];

	protected spaces?: ISpaceContext[];

	private subscription?: Subscription;

	constructor(
		private readonly userService: SneatUserService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('ForSpaceTypeCardComponent');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['spaceTypes']) {
			if (this.subscription) {
				this.subscription.unsubscribe();
			}
			this.watchUserRecord();
		}
	}

	private watchUserRecord(): void {
		this.subscription = this.userService.userState
			.pipe(takeUntil(this.destroyed$))
			.subscribe({
				next: (user) => {
					this.spaces = zipMapBriefsWithIDs(user.record?.spaces)
						?.filter((t) => this.spaceTypes?.some((tt) => tt === t.brief.type))
						.map((t) => spaceContextFromBrief(t.id, t.brief));
					console.log(
						'ForSpaceTypeCardComponent.watchUserRecord() =>',
						this.spaceTypes,
						user.record?.spaces,
						this.spaces,
					);
					this.changeDetectorRef.markForCheck();
				},
			});
	}
}
