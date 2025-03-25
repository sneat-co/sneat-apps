import {
	Component,
	signal,
	ViewChild,
	AfterViewInit,
	inject,
	input,
} from '@angular/core';
import { IonicModule, IonInput } from '@ionic/angular';
import { SneatAuthStateService } from '@sneat/auth-core';
import { SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, map } from 'rxjs';
import { ITracker } from '../../dbo/i-tracker-dbo';
import {
	IAddTrackerPointRequest,
	TrackusApiService,
} from '../../trackus-api.service';

@Component({
	selector: 'sneat-tracker-form',
	templateUrl: './tracker-form.component.html',
	imports: [IonicModule],
})
export class TrackerFormComponent
	extends SneatBaseComponent
	implements AfterViewInit
{
	public readonly $tracker = input.required<ITracker | undefined>();
	// private readonly $trackerID = computed(() => this.$tracker()?.id);

	private trackBy: 'contact' | 'space' = 'contact';
	protected $trackByID = signal<string>('');
	@ViewChild('numberInput') numberInput?: IonInput;

	protected readonly $isSubmitting = signal<boolean>(false);

	private readonly trackusApiService = inject(TrackusApiService);

	constructor(userService: SneatAuthStateService) {
		super('TrackerFormComponent');
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
	}

	public ngAfterViewInit(): void {
		this.setFocusToInput(this.numberInput);
	}

	protected addTrackerRecord(): void {
		const tracker = this.$tracker();
		let value: unknown = this.numberInput?.value;
		if (!tracker || value === undefined || value === '') {
			return;
		}
		if (
			tracker?.dbo?.valueType === 'int' ||
			tracker?.dbo?.valueType === 'float'
		) {
			value = Number(value);
		}
		const request: IAddTrackerPointRequest = {
			spaceID: tracker.space.id,
			trackerID: tracker.id,
			trackByKind: this.trackBy,
			trackByID: this.$trackByID(),
			i: Number(value),
		};
		this.$isSubmitting.set(true);
		this.trackusApiService.addTrackerPoint(request).subscribe({
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
