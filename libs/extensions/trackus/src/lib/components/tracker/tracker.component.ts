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
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, map, Subscription } from 'rxjs';
import {
	ITrackerBrief,
	ITrackerDbo,
	ITrackerEntryDbo,
} from '../../dbo/i-tracker-dbo';
import { TrackersService, TrackersServiceModule } from '../../trackers-service';
import {
	IAddTrackerEntryRequest,
	IDeleteTrackerEntryRequest,
	TrackusApiService,
	TrackusApiServiceModule,
} from '../../trackus-api.service';

interface ListOfEntriesForDate {
	readonly dateID: string;
	readonly targets: {
		readonly targetKey: string;
		readonly entries: readonly ITrackerEntryDbo[];
	}[];
}

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

	private trackBy: 'contact' | 'space' = 'contact';
	protected $trackByID = signal<string>('');

	protected readonly $tracker = signal<
		IIdAndOptionalBriefAndOptionalDbo<ITrackerBrief, ITrackerDbo> | undefined
	>(undefined);

	protected readonly $entriesByDateAndTargetKey = computed<
		ListOfEntriesForDate[]
	>(() => {
		const tracker = this.$tracker();
		const entriesByDateAndTargetKey: Record<
			string,
			Record<string, ITrackerEntryDbo[]>
		> = {};

		Object.entries(tracker?.dbo?.entries || {}).forEach(
			([targetKey, entries]) => {
				entries.forEach((entry) => {
					const dateID = entry.ts.toDate().toISOString().slice(0, 10);
					// debugger;
					let entriesByTargetKey = entriesByDateAndTargetKey[dateID];
					if (!entriesByTargetKey) {
						entriesByDateAndTargetKey[dateID] = entriesByTargetKey = {};
					}
					let targetEntries = entriesByTargetKey[targetKey];
					if (!targetEntries) {
						entriesByTargetKey[targetKey] = targetEntries = [];
					}
					targetEntries.push(entry);
				});
			},
		);
		return Object.entries(entriesByDateAndTargetKey).map(
			([dateID, byTargetKey]) => {
				return {
					dateID,
					targets: Object.entries(byTargetKey).map(([targetKey, entries]) => ({
						targetKey,
						entries,
					})),
				};
			},
		);
	});

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
		private readonly userService: SneatAuthStateService,
	) {
		super('TrackerComponent', errorLogger);
		userService.authState
			.pipe(
				this.takeUntilDestroyed(),
				map((authState) => authState.user?.uid),
				distinctUntilChanged(),
			)
			.subscribe((uid) => {
				if (uid) {
					this.$trackByID.set(uid);
				}
			});
		const trackerIDEffect = effect(this.onSpaceOrTrackerIDChanged);
		this.destroyed$.subscribe(() => {
			trackerIDEffect?.destroy();
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
		const timeStamp = ts.toDate().toISOString();
		const request: IDeleteTrackerEntryRequest = {
			spaceID,
			trackerID,
			timeStamp,
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
		let value: unknown = this.numberInput?.value;
		if (!spaceID || !trackerID || value === undefined || value === '') {
			return;
		}
		const tracker = this.$tracker();
		if (
			tracker?.dbo?.valueType === 'int' ||
			tracker?.dbo?.valueType === 'float'
		) {
			value = Number(value);
		}
		const request: IAddTrackerEntryRequest = {
			spaceID,
			trackerID,
			trackByKind: this.trackBy,
			trackByID: this.$trackByID(),
			i: Number(value),
		};
		this.$isSubmitting.set(true);
		this.trackusApiService.addTrackerEntry(request).subscribe({
			next: () => {
				this.$isSubmitting.set(false);
				if (this.numberInput) {
					this.numberInput.value = '';
					this.setFocusToInput(this.numberInput);
				}
			},
			error: (err) => {
				this.$isSubmitting.set(false);
				this.errorLogger.logError(err, 'Failed to add tracker record');
			},
		});
	}
}
