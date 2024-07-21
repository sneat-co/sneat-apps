import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceType } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
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
	standalone: true,
	imports: [CommonModule, IonicModule, RouterModule, SpacesListComponent],
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
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly userService: SneatUserService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('ForTeamTypeCardComponent', errorLogger);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['teamTypes']) {
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
						'ForTeamTypeCardComponent =>',
						this.spaceTypes,
						user.record?.spaces,
						this.spaces,
					);
					this.changeDetectorRef.markForCheck();
				},
			});
	}
}
