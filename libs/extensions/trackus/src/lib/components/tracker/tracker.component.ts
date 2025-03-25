import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import { ITracker } from '../../dbo/i-tracker-dbo';
import { TrackersServiceModule } from '../../trackers-service';
import { TrackusApiServiceModule } from '../../trackus-api.service';
import { TrackerFormComponent } from './tracker-form.component';
import { TrackerHistoryComponent } from './tracker-history.component';

@Component({
	selector: 'sneat-tracker',
	imports: [
		CommonModule,
		IonicModule,
		TrackersServiceModule,
		TrackusApiServiceModule,
		ContactusServicesModule,
		TrackerFormComponent,
		TrackerHistoryComponent,
	],
	templateUrl: './tracker.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerComponent extends SneatBaseComponent {
	public readonly $tracker = input.required<ITracker | undefined>();

	private readonly $spaceID = computed(() => this.$tracker()?.space?.id);

	protected readonly $contactusSpace = signal<IContactusSpaceDbo | undefined>(
		undefined,
	);

	constructor(contactusSpaceService: ContactusSpaceService) {
		super('TrackerComponent');

		let contactusSpaceSub: Subscription | undefined = undefined;

		const contactusSpaceEffect = effect(() => {
			contactusSpaceSub?.unsubscribe();
			const spaceID = this.$spaceID();
			if (!spaceID) {
				this.$contactusSpace.set(undefined);
				return;
			}
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

		this.destroyed$.subscribe(() => {
			contactusSpaceSub?.unsubscribe();
			contactusSpaceEffect?.destroy();
		});
	}

	protected share(): void {
		alert('Tracker sharing is not implemented yet');
	}
}
