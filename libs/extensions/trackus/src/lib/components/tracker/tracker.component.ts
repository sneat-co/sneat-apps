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
import { TrackersService, TrackersServiceModule } from '../../trackers-service';
import { TrackusApiServiceModule } from '../../trackus-api.service';
import { TrackerFormComponent } from './tracker-form.component';
import { TrackerHistoryComponent } from './tracker-history.component';

// import { QRCodeComponent } from 'angularx-qrcode';

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
	// private readonly $trackerID = computed(() => this.$tracker()?.id);

	// public readonly $trackerID = input.required<string | undefined>();

	private readonly $spaceID = computed(() => this.$tracker()?.id);

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
}
