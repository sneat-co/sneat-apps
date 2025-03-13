import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	Inject,
	input,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import {
	getStandardTrackerTitle,
	isStandardTracker,
	ITrackerBrief,
} from '../../dbo/i-tracker-dbo';
import {
	TrackusApiService,
	TrackusApiServiceModule,
} from '../../trackus-api.service';
import {
	TrackusSpaceService,
	TrackusSpaceServiceModule,
} from '../../trackus-space.service';

@Component({
	selector: 'sneat-trackers',
	imports: [
		CommonModule,
		IonicModule,
		TrackusSpaceServiceModule,
		RouterLink,
		TrackusApiServiceModule,
	],
	templateUrl: './trackers.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackersComponent extends SneatBaseComponent {
	public readonly $space = input.required<ISpaceContext>();
	protected readonly $spaceID = computed(() => this.$space().id);

	protected readonly $loading = signal<boolean>(true);

	private trackersSub?: Subscription;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly trackusSpaceService: TrackusSpaceService,
		private readonly trackusApiService: TrackusApiService,
	) {
		super('TrackersComponent', errorLogger);
		this.destroyed$.subscribe(effect(this.onTrackusSpaceChanged).destroy);
		this.destroyed$.subscribe(() => this.trackersSub?.unsubscribe());
	}

	private readonly onTrackusSpaceChanged = () => {
		this.trackersSub?.unsubscribe();
		this.trackersSub = this.$trackusSpace()
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (trackusSpace) => {
					console.log('trackusSpace:', trackusSpace);
					const trackers =
						Object.entries(trackusSpace.dbo?.trackers || {}).map(
							([id, brief]) => ({
								id,
								brief,
							}),
						) || [];
					trackers.sort((a, b) =>
						(a.brief.title || a.id).localeCompare(b.brief.title || b.id),
					);
					this.$trackers.set(trackers);
					this.$loading.set(false);
				},
			});
	};

	private readonly $trackusSpace = computed(() => {
		const spaceID = this.$spaceID();
		console.log('TrackersComponent => spaceID changed:', spaceID);
		this.trackersSub?.unsubscribe();
		return this.trackusSpaceService.watchSpaceModuleRecord(spaceID);
	});

	protected getTrackerTitle(tracker: IIdAndBrief<ITrackerBrief>): string {
		if (tracker.brief.title) {
			return tracker.brief.title;
		}
		if (isStandardTracker(tracker.id)) {
			return getStandardTrackerTitle(tracker.id);
		}
		return tracker.id;
	}

	protected readonly $trackers = signal<
		undefined | readonly IIdAndBrief<ITrackerBrief>[]
	>(undefined);

	protected archiveTracker(event: Event, trackerID: string): void {
		event.stopPropagation();
		event.preventDefault();
		if (
			!confirm(
				'Are you sure want to archive this tracker? Please note the restoration from archive is not implemented yet.',
			)
		) {
			return;
		}
		const spaceID = this.$spaceID();
		this.trackusApiService.archiveTracker({ spaceID, trackerID }).subscribe({});
	}
}
