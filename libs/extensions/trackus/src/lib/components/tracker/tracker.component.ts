import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	Inject,
	input,
	signal,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@firebase/firestore';
import { IonicModule, IonInput } from '@ionic/angular';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import {
	ITrackerBrief,
	ITrackerDbo,
	ITrackerEntry,
} from '../../dbo/i-tracker-dbo';
import { TrackersService, TrackersServiceModule } from '../../trackers-service';
import {
	IAddTrackerEntryRequest,
	IDeleteTrackerEntryRequest,
	TrackusApiService,
	TrackusApiServiceModule,
} from '../../trackus-api.service';

@Component({
	selector: 'sneat-tracker',
	imports: [
		CommonModule,
		IonicModule,
		TrackersServiceModule,
		TrackusApiServiceModule,
	],
	templateUrl: './tracker.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerComponent
	extends SneatBaseComponent
	implements AfterViewInit
{
	public readonly $space = input.required<ISpaceContext>();
	public readonly $trackerID = input.required<string | undefined>();

	protected readonly $tracker = signal<
		IIdAndOptionalBriefAndOptionalDbo<ITrackerBrief, ITrackerDbo> | undefined
	>(undefined);

	protected $selectedTargetKey = signal<string>('');

	protected $targetKeys = computed(() => {
		const tracker = this.$tracker();
		return Object.keys(tracker?.dbo?.entries || {});
	});

	protected readonly $entriesByDate = computed(() => {
		const tracker = this.$tracker();
		const targetKey = this.$selectedTargetKey();
		const targetEntries = tracker?.dbo?.entries[targetKey];

		const entriesByDate = targetEntries?.reduce(
			(acc, item) => {
				const dateKey = item.t.toDate().toISOString().slice(0, 10);
				(acc[dateKey] = acc[dateKey] || []).push(item);
				return acc;
			},
			{} as Record<string, ITrackerEntry[]>,
		);
		return Object.entries(entriesByDate || {}).map(([dateID, entries]) => ({
			dateID,
			entries,
		}));
	});

	protected onSelectedTargetKeyChanged(event: CustomEvent): void {
		// const ce = event as CustomEvent;
		this.$selectedTargetKey.set(event.detail.value as string);
	}

	@ViewChild('numberInput') numberInput?: IonInput;
	private trackerSub?: Subscription;

	protected readonly $isSubmitting = signal<boolean>(false);
	protected readonly $deletingTrackerEntryKeys = signal<
		IDeleteTrackerEntryRequest[]
	>([]);

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly trackersService: TrackersService,
		private readonly trackusApiService: TrackusApiService,
	) {
		super('TrackerComponent', errorLogger);
		const trackerIDEffect = effect(this.onSpaceOrTrackerIDChanged);
		const trackerEffect = effect(() => {
			const tracker = this.$tracker();
			if (tracker?.dbo?.entries && !this.$selectedTargetKey()) {
				const keys = Object.keys(tracker.dbo.entries);
				if (keys?.length) {
					this.$selectedTargetKey.set(keys[0]);
				}
			}
		});
		this.destroyed$.subscribe(() => {
			trackerIDEffect?.destroy();
			trackerEffect?.destroy();
			this.trackerSub?.unsubscribe();
		});
	}

	private onSpaceOrTrackerIDChanged = () => {
		const spaceID = this.$space().id;
		const trackerID = this.$trackerID();
		console.log(
			`TrackerComponent.onSpaceOrTrackerIDChanged: spaceID=${spaceID}, trackerID=${trackerID}`,
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
				next: this.$tracker.set,
			});
	};

	public ngAfterViewInit(): void {
		this.setFocusToInput(this.numberInput);
	}

	protected deleteTrackerRecord(tarketKey: string, ts: Timestamp): void {
		const spaceID = this.$space().id;
		const trackerID = this.$trackerID();
		if (!spaceID || !trackerID) {
			return;
		}
		const created = ts.toDate().toISOString();
		const request: IDeleteTrackerEntryRequest = {
			spaceID,
			trackerID,
			created,
		};
		const deletingKeys = this.$deletingTrackerEntryKeys();
		this.$deletingTrackerEntryKeys.set([...deletingKeys, request]);
		const removeKey = () => {
			this.$deletingTrackerEntryKeys.update((keys) =>
				keys.filter((k) => k !== request),
			);
		};
		this.trackusApiService.deleteTrackerEntry(request).subscribe({
			next: () => {
				removeKey();
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete tracker record');
				removeKey();
			},
		});
	}

	protected addTrackerRecord(): void {
		const trackerID = this.$trackerID();
		const spaceID = this.$space().id;
		const value = this.numberInput?.value;
		if (!spaceID || !trackerID || value === undefined || value === '') {
			return;
		}
		const request: IAddTrackerEntryRequest = {
			spaceID,
			trackerID,
			value,
		};
		this.$isSubmitting.set(true);
		this.trackusApiService.addTrackerEntry(request).subscribe({
			next: () => {
				this.$isSubmitting.set(false);
			},
			error: (err) => {
				this.$isSubmitting.set(false);
				this.errorLogger.logError(err, 'Failed to add tracker record');
			},
		});
	}
}
