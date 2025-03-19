import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	Inject,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief, IIdAndOptionalDbo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import {
	getStandardTrackerTitle,
	isStandardTracker,
	ITrackerBrief,
} from '../../dbo/i-tracker-dbo';
import { ITrackusSpaceDbo } from '../../dbo/i-trackus-space-dbo';
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
export class TrackersComponent extends SneatBaseComponent implements OnInit {
	public readonly $space = input.required<ISpaceContext>();

	// This makes sure we react to distinct space ID values only
	protected readonly $spaceID = computed(() => this.$space().id);

	protected readonly $error = signal<string | undefined>(undefined);

	private $retry = signal<number>(0);

	private readonly watchTrackusSpace = () => {
		this.trackersSub?.unsubscribe();
		this.$error.set(undefined);
		const spaceID = this.$spaceID();
		if (!spaceID) {
			return;
		}
		const retry = this.$retry();
		if (retry) {
			console.info(
				`Attempt #${retry} to retry loading of trackus space record for spaceID=${spaceID},`,
			);
		}
		this.$trackers.set(undefined);
		this.trackersSub = this.trackusSpaceService
			.watchSpaceModuleRecord(spaceID)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: this.processTrackusSpace,
				error: (err) => {
					const errMsg = 'Failed to load tracker';
					this.logError(err, errMsg, { show: !!retry });
					this.$error.set(errMsg);
					this.$trackers.set(undefined);
				},
			});
	};

	protected readonly $trackers = signal<
		undefined | readonly IIdAndBrief<ITrackerBrief>[]
	>(undefined);

	protected readonly $loading = computed<boolean>(
		() => !!this.$spaceID() && this.$trackers() === undefined && !this.$error(),
	);

	private trackersSub?: Subscription;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly trackusSpaceService: TrackusSpaceService,
		private readonly trackusApiService: TrackusApiService,
	) {
		super('TrackersComponent', errorLogger);
		const watchTrackusSpaceEffect = effect(this.watchTrackusSpace);
		this.destroyed$.subscribe(() => {
			this.trackersSub?.unsubscribe();
			watchTrackusSpaceEffect.destroy();
		});
	}

	ngOnInit(): void {
		console.log('TrackersComponent.ngOnInit()');
	}

	private readonly processTrackusSpace = (
		trackusSpace: IIdAndOptionalDbo<ITrackusSpaceDbo>,
	) => {
		console.log('trackusSpace: ' + JSON.stringify(trackusSpace));
		const trackers =
			Object.entries(trackusSpace.dbo?.trackers || {}).map(([id, brief]) => ({
				id,
				brief,
			})) || [];
		trackers.sort((a, b) =>
			(a.brief.title || a.id).localeCompare(b.brief.title || b.id),
		);
		this.$trackers.set(trackers);
	};

	protected getTrackerTitle(tracker: IIdAndBrief<ITrackerBrief>): string {
		if (tracker.brief.title) {
			return tracker.brief.title;
		}
		if (isStandardTracker(tracker.id)) {
			return getStandardTrackerTitle(tracker.id);
		}
		return tracker.id;
	}

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

	protected retry(): void {
		this.$retry.set(this.$retry() + 1);
	}
}
