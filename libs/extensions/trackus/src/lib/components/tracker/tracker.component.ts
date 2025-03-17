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
import { SneatAuthStateService } from '@sneat/auth-core';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, map, Subscription } from 'rxjs';
import {
	ITrackerBrief,
	ITrackerDbo,
	ITrackerEntryBrief,
} from '../../dbo/i-tracker-dbo';
import { TrackersService, TrackersServiceModule } from '../../trackers-service';
import {
	IAddTrackerEntryRequest,
	IDeleteTrackerEntryRequest,
	TrackusApiService,
	TrackusApiServiceModule,
} from '../../trackus-api.service';

interface ITarget {
	readonly key: string;
	readonly kind: string;
	readonly id: string;
	readonly title: string;
	readonly entries: readonly ITrackerEntryBrief[];
	readonly sum?: number;
}

interface ListOfEntriesForDate {
	readonly dateID: string;
	readonly targets: ITarget[];
}

interface ITargetInfo {
	readonly title: string;
}

@Component({
	selector: 'sneat-tracker',
	imports: [
		CommonModule,
		IonicModule,
		TrackersServiceModule,
		TrackusApiServiceModule,
		ContactusServicesModule,
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

	private readonly $spaceID = computed(() => this.$space().id);

	private readonly $contactusSpace = signal<IContactusSpaceDbo | undefined>(
		undefined,
	);

	private $targetInfos = computed<Readonly<Record<string, ITargetInfo>>>(() => {
		const contacts = this.$contactusSpace()?.contacts;
		console.log('$targetInfos: contacts:', contacts);
		if (!contacts) {
			return {};
		}
		const targetInfos: Record<string, ITargetInfo> = {};
		Object.entries(contacts).forEach(([id, contact]) => {
			const targetKey = 'contact:' + id;
			targetInfos[targetKey] = {
				title: contact.names
					? `${contact.names?.firstName} ${contact.names?.lastName}`
					: targetKey,
			};
		});
		return targetInfos;
	});

	private trackBy: 'contact' | 'space' = 'contact';
	protected $trackByID = signal<string>('');

	protected readonly $tracker = signal<
		IIdAndOptionalBriefAndOptionalDbo<ITrackerBrief, ITrackerDbo> | undefined
	>(undefined);

	protected readonly $entriesByDateAndTarget = computed<ListOfEntriesForDate[]>(
		() => {
			const targetInfos = this.$targetInfos();
			console.log('$entriesByDateAndTarget: targetInfos=', targetInfos);
			const tracker = this.$tracker();
			const entriesByDateAndTarget: Record<
				string,
				Record<string, ITrackerEntryBrief[]>
			> = {};

			Object.entries(tracker?.dbo?.entries || {}).forEach(
				([targetKey, entries]) => {
					Object.entries(entries).forEach(([id, entry]) => {
						if (!entry.ts) {
							entry = { ...entry, ts: Timestamp.fromMillis(Number(id)) };
						}
						const dateID = entry.ts.toDate().toISOString().slice(0, 10);
						let entriesByTargetKey = entriesByDateAndTarget[dateID];
						if (!entriesByTargetKey) {
							entriesByDateAndTarget[dateID] = entriesByTargetKey = {};
						}
						let targetEntries = entriesByTargetKey[targetKey];
						if (!targetEntries) {
							entriesByTargetKey[targetKey] = targetEntries = [];
						}
						targetEntries.push(entry);
					});
				},
			);
			return Object.entries(entriesByDateAndTarget).map(
				([dateID, byTargetKey]) => {
					return {
						dateID,
						targets: Object.entries(byTargetKey).map(([key, entries]) => {
							const [kind, id] = key.split(':');
							const targetInfo = targetInfos[key];
							// console.log('targetKey:', key);
							// console.log('targetInfo:', targetInfo);
							const target: ITarget = {
								key,
								kind,
								id,
								entries,
								title: targetInfo?.title || id,
								sum: entries.reduce(
									(acc, entry) => acc + (entry.i || entry.f || 0),
									0,
								),
							};
							return target;
						}),
					};
				},
			);
		},
	);

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
		userService: SneatAuthStateService,
		private readonly contactusSpaceService: ContactusSpaceService,
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

		let contactusSpaceSub: Subscription | undefined = undefined;

		const contactusSpaceEffect = effect(() => {
			contactusSpaceSub?.unsubscribe();
			const spaceID = this.$spaceID();
			contactusSpaceSub = contactusSpaceService
				.watchSpaceModuleRecord(spaceID)
				.pipe(this.takeUntilDestroyed())
				.subscribe({
					next: (contactusSpace) => {
						console.log('contactusSpace:', contactusSpace);
						this.$contactusSpace.set(contactusSpace?.dbo || undefined);
					},
				});
		});

		const trackerIDEffect = effect(this.onSpaceOrTrackerIDChanged);

		this.destroyed$.subscribe(() => {
			contactusSpaceSub?.unsubscribe();
			trackerIDEffect?.destroy();
			contactusSpaceEffect?.destroy();
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

	protected deleteTargetDateRecord(key: string): void {
		console.log('deleteTargetDateRecord:', key);
	}

	protected deleteTrackerRecord(ts: Timestamp): void {
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
