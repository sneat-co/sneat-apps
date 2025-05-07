import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonChip,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
} from '@ionic/angular/standalone';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { SneatBaseComponent } from '@sneat/ui';
import { ITracker, TrackerPointBrief } from '../../dbo/i-tracker-dbo';
import {
	IDeleteTrackerPointsRequest,
	TrackusApiService,
} from '../../trackus-api.service';

interface ITarget {
	readonly key: string;
	readonly kind: string;
	readonly id: string;
	readonly title: string;
	readonly points: readonly IIdAndBrief<TrackerPointBrief>[];
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
	selector: 'sneat-tracker-history',
	templateUrl: './tracker-history.component.html',
	imports: [
		DatePipe,
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonChip,
	],
})
export class TrackerHistoryComponent extends SneatBaseComponent {
	public readonly $tracker = input.required<ITracker | undefined>();
	public readonly $contactusSpace = input.required<
		IContactusSpaceDbo | undefined
	>();

	private readonly trackusApiService = inject(TrackusApiService);

	constructor() {
		super('TrackerHistoryComponent');
	}

	protected readonly $deletingTrackerPointRequests = signal<
		IDeleteTrackerPointsRequest[]
	>([]);

	private $targetInfos = computed<Readonly<Record<string, ITargetInfo>>>(() => {
		const contactusSpace = this.$contactusSpace();
		const contacts = contactusSpace?.contacts;
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

	protected readonly $entriesByDateAndTarget = computed<ListOfEntriesForDate[]>(
		() => {
			const targetInfos = this.$targetInfos();
			console.log('$entriesByDateAndTarget: targetInfos=', targetInfos);
			const tracker = this.$tracker();
			const entriesByDateAndTarget: Record<
				string,
				Record<string, IIdAndBrief<TrackerPointBrief>[]>
			> = {};

			Object.entries(tracker?.dbo?.entries || {}).forEach(
				([targetKey, entries]) => {
					Object.entries(entries).forEach(([id, brief]) => {
						let ts = brief.ts;
						if (!ts) {
							ts = Timestamp.fromMillis(Number(id));
							brief = { ...brief, ts };
						}
						const dateID = ts.toDate().toISOString().slice(0, 10);
						let entriesByTargetKey = entriesByDateAndTarget[dateID];
						if (!entriesByTargetKey) {
							entriesByDateAndTarget[dateID] = entriesByTargetKey = {};
						}
						let targetEntries = entriesByTargetKey[targetKey];
						if (!targetEntries) {
							entriesByTargetKey[targetKey] = targetEntries = [];
						}
						targetEntries.push({ id, brief });
					});
				},
			);
			const result = Object.entries(entriesByDateAndTarget).map(
				([dateID, byTargetKey]) => {
					return {
						dateID,
						targets: Object.entries(byTargetKey).map(([key, points]) => {
							const [kind, id] = key.split(':');
							const targetInfo = targetInfos[key];
							// console.log('targetKey:', key);
							// console.log('targetInfo:', targetInfo);
							const target: ITarget = {
								key,
								kind,
								id,
								points,
								title: targetInfo?.title || id,
								sum: points.reduce(
									(acc, entry) => acc + (entry.brief.i || entry.brief.f || 0),
									0,
								),
							};
							return target;
						}),
					};
				},
			);
			result.sort((a, b) => (a.dateID < b.dateID ? 1 : -1));
			return result;
		},
	);

	private deleteTrackerPoints(request: IDeleteTrackerPointsRequest): void {
		const deletingKeys = this.$deletingTrackerPointRequests();
		this.$deletingTrackerPointRequests.set([...deletingKeys, request]);
		const removeKey = () => {
			this.$deletingTrackerPointRequests.update((keys) =>
				keys.filter((k) => k !== request),
			);
		};
		this.trackusApiService.deleteTrackerPoints(request).subscribe({
			next: () => {
				removeKey();
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete tracker record');
				removeKey();
			},
		});
	}

	protected deleteTrackerPoint(entityRef: string, pointID: string): void {
		const tracker = this.$tracker();
		if (!tracker) {
			return;
		}
		const request: IDeleteTrackerPointsRequest = {
			spaceID: tracker.space.id,
			trackerID: tracker.id,
			entityRef,
			pointIDs: [pointID],
		};
		this.deleteTrackerPoints(request);
	}

	protected deleteTrackerPointsByDate(dateID: string) {
		const tracker = this.$tracker();
		if (!tracker) {
			return;
		}
		const request: IDeleteTrackerPointsRequest = {
			spaceID: tracker.space.id,
			trackerID: tracker.id,
			date: dateID,
		};
		this.deleteTrackerPoints(request);
	}

	protected deleteTrackerPointsByDateAndEntity(
		entityRef: string,
		dateID: string,
	): void {
		const tracker = this.$tracker();
		if (!tracker) {
			return;
		}
		const request: IDeleteTrackerPointsRequest = {
			spaceID: tracker.space.id,
			trackerID: tracker.id,
			entityRef,
			date: dateID,
		};
		this.deleteTrackerPoints(request);
	}
}
