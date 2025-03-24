import { EventEmitter, Output } from '@angular/core';
import {
	Component,
	effect,
	inject,
	input,
	OnDestroy,
	signal,
} from '@angular/core';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import {
	OptionalTrackerWithIdAndOptionalBriefAndOptionalDbo,
	standardTrackers,
} from '../../dbo/i-tracker-dbo';
import { TrackersService } from '../../trackers-service';

// template: ` <ng-container
// 	*ngTemplateOutlet="contentTemplate; context: { $tracker: $tracker.asReadonly() }"
// ></ng-container>`,

@Component({
	selector: 'sneat-tracker-provider',
	template: '<ng-content></ng-content>',
	providers: [TrackersService],
})
export class TrackerProviderComponent
	extends SneatBaseComponent
	implements OnDestroy
{
	// @ContentChild(TemplateRef) contentTemplate!: TemplateRef<{$tracker: Signal<IIdAndOptionalBriefAndOptionalDbo<ITrackerBrief, ITrackerDbo> | undefined>}>;

	constructor() {
		super('TrackerProviderComponent');
	}

	@Output() trackerChange =
		new EventEmitter<OptionalTrackerWithIdAndOptionalBriefAndOptionalDbo>();

	public readonly $spaceID = input.required<string | undefined>();
	public readonly $trackerID = input.required<string | undefined>();

	protected readonly $tracker =
		signal<OptionalTrackerWithIdAndOptionalBriefAndOptionalDbo>(undefined);

	private trackerSub?: Subscription;

	private readonly trackersService = inject(TrackersService);

	private readonly trackerRefEffect = effect(() =>
		this.onTrackerRefIDChanged(),
	);

	private readonly onTrackerRefIDChanged = () => {
		const spaceID = this.$spaceID();
		const trackerID = this.$trackerID();
		console.log(
			`TrackerProviderComponent.onTrackerRefIDChanged: spaceID=${spaceID}, trackerID=${trackerID}`,
		);
		this.trackerSub?.unsubscribe();
		if (!spaceID || !trackerID) {
			this.$tracker.set(undefined);
			return;
		}
		const spaceRef = { id: spaceID };
		this.trackerSub = this.trackersService
			.watchModuleSpaceItem(spaceRef, trackerID)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (tracker) => {
					if (tracker.id.startsWith('_') && !tracker?.brief?.title) {
						const brief = standardTrackers.find(
							(t) => t.id === tracker.id,
						)?.brief;
						if (brief) {
							tracker = { ...tracker, brief: { ...brief, ...tracker.brief } };
						}
					}
					this.$tracker.set(tracker);
					this.trackerChange.emit(tracker);
				},
			});
	};

	public override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.trackerRefEffect.destroy();
	}
}
