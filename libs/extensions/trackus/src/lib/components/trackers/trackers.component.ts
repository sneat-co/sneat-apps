import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EventEmitter,
	inject,
	input,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AnalyticsService, IIdAndBrief, IIdAndOptionalDbo } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import {
	getStandardTrackerTitle,
	isStandardTracker,
	ITrackerBrief,
	standardTrackers,
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

interface Category {
	readonly id: string;
	readonly title: string;
	readonly emoji: string;
	readonly trackers: readonly IIdAndBrief<ITrackerBrief>[];
}

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

	// This makes sure we react to distinct space ID values only
	protected readonly $spaceID = computed(() => this.$space().id);

	protected readonly $error = signal<string | undefined>(undefined);

	private readonly $retry = signal<number>(0);

	protected readonly $category = signal<string | undefined>(undefined);

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

	protected readonly $categories = signal<readonly Category[]>([
		{ id: 'fitness', title: 'Fitness', emoji: '🏋', trackers: [] },
		{ id: 'health', title: 'Health', trackers: [], emoji: '⚕️' },
		{ id: 'home', title: 'Home', trackers: [], emoji: '🏠' },
		{ id: 'vehicles', title: 'Vehicles', trackers: [], emoji: '🚗' },
	]);

	private trackersSub?: Subscription;

	private readonly analyticsService = inject(AnalyticsService);
	private readonly trackusSpaceService = inject(TrackusSpaceService);
	private readonly trackusApiService = inject(TrackusApiService);

	constructor() {
		super('TrackersComponent');
		const watchTrackusSpaceEffect = effect(this.watchTrackusSpace);
		this.destroyed$.subscribe(() => {
			this.trackersSub?.unsubscribe();
			watchTrackusSpaceEffect.destroy();
		});
	}

	private readonly processTrackusSpace = (
		trackusSpace: IIdAndOptionalDbo<ITrackusSpaceDbo>,
	) => {
		console.log('trackusSpace: ' + JSON.stringify(trackusSpace));
		const trackers =
			Object.entries(trackusSpace.dbo?.trackers || {}).map(([id, brief]) => {
				if ((id.startsWith('_') && !brief.title) || !brief.emoji) {
					const standardBrief = standardTrackers.find(
						(st) => st.id === id,
					)?.brief;
					brief = { ...standardBrief, ...brief };
				}
				return { id, brief };
			}) || [];

		standardTrackers.forEach((tracker) => {
			const isRemovedTracker = trackusSpace.dbo?.archivedTrackers?.[tracker.id];
			if (!isRemovedTracker && !trackers.find((t) => t.id === tracker.id)) {
				trackers.push(tracker);
			}
		});

		const categories: Category[] = this.$categories().map((c) => ({
			...c,
			trackers: [],
		}));

		const addTrackersToCategories = (
			trackers: readonly IIdAndBrief<ITrackerBrief>[],
		): void => {
			trackers.forEach((tracker) => {
				tracker.brief.categories.forEach((trackerCat) => {
					const catIndex = categories.findIndex((cat) => cat.id === trackerCat);

					if (catIndex >= 0) {
						let category = categories[catIndex];
						category = {
							...category,
							trackers: [...category.trackers, tracker],
						};
						categories[catIndex] = category;
					}
				});
			});
		};

		addTrackersToCategories(trackers);

		categories.forEach((category, i) => {
			const catTrackers = [...category.trackers];
			catTrackers.sort((a, b) =>
				(a.brief.title || a.id).localeCompare(b.brief.title || b.id),
			);
			category = { ...category, trackers: catTrackers };
			categories[i] = category;
		});
		this.$categories.set(categories);
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

	protected readonly $archivingTrackerIDs = signal<readonly string[]>([]);

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
		const archivingTrackerIDs = this.$archivingTrackerIDs();
		if (!archivingTrackerIDs.includes(trackerID)) {
			this.$archivingTrackerIDs.set([...archivingTrackerIDs, trackerID]);
		}
		const onArchivingComplete = () =>
			this.$archivingTrackerIDs.set(
				archivingTrackerIDs.filter((id) => id !== trackerID),
			);
		this.trackusApiService.archiveTracker({ spaceID, trackerID }).subscribe({
			next: onArchivingComplete,
			error: (err) => {
				onArchivingComplete();
				this.logError(err, 'Failed to archive tracker');
			},
		});
	}

	protected retry(): void {
		this.$retry.set(this.$retry() + 1);
	}

	protected onCategoryChanged = (event: CustomEvent) => {
		const selectedValue = event.detail.value as string;
		this.analyticsService.logEvent('trackus/trackers/category_changed', {
			selected_category: selectedValue,
		});
		this.$category.set(selectedValue);
	};

	@Output() public readonly goNewTracker = new EventEmitter<string>();

	protected openNewTracker(event: Event, category: string): void {
		console.log('goNewTracker', category);
		event.stopPropagation();
		event.preventDefault();
		this.goNewTracker.emit(category);
	}
}
