import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	signal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonCheckbox,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
} from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListComponent } from '@sneat/components';
import { ErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { NumberKind, TrackBy, TrackerValueType } from '../../dbo/i-tracker-dbo';
import {
	ICreateTrackerRequest,
	TrackusApiService,
} from '../../trackus-api.service';

@Component({
	selector: 'sneat-new-tracker-form',
	templateUrl: './new-tracker-form.component.html',
	imports: [
		IonLabel,
		IonItem,
		IonInput,
		SelectFromListComponent,
		ReactiveFormsModule,
		IonItemDivider,
		IonButton,
		IonCheckbox,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [TrackusApiService],
})
export class NewTrackerFormComponent {
	public readonly space = input.required<ISpaceContext>();
	public readonly category = input.required<string>();
	protected readonly $category = signal<string | undefined>(undefined);
	protected readonly $categoryState = computed(() => {
		const category = this.$category();
		return category === undefined ? this.category() : category;
	});
	protected readonly $valueType = signal<TrackerValueType | ''>('');
	protected readonly $askNumberKind = computed<boolean>(() => {
		const valueType = this.$valueType();
		return (
			valueType === 'int' || valueType === 'float' || valueType === 'money'
		);
	});
	protected readonly $numberKind = signal<NumberKind | ''>('');

	protected readonly $submitDisabled = computed<boolean>(() => {
		return (
			!this.$valueType() ||
			!this.$categoryState() ||
			(this.$askNumberKind() && !this.$numberKind())
		);
	});

	protected readonly $showTrackBy = computed<boolean>(() => {
		return (
			(this.$valueType() && !this.$askNumberKind()) || !!this.$numberKind()
		);
	});

	protected readonly $trackBy = signal<TrackBy[]>([]);

	protected readonly titleFormControl = new FormControl(
		'',
		Validators.required,
	);

	private readonly $title = signal<string>('');

	protected readonly form = new FormGroup([this.titleFormControl]);

	private readonly errorLogger = inject(ErrorLogger);
	private readonly trackusApiService = inject(TrackusApiService);

	protected readonly trackByOptions: readonly ISelectItem[] = [
		{
			id: 'contact',
			title: 'Contact',
		},
		{
			id: 'asset',
			title: 'Asset',
		},
	];

	protected readonly typeOptions: readonly ISelectItem[] = [
		{
			id: 'int',
			title: 'Integer number',
		},
		{
			id: 'float',
			title: 'Float number',
		},
		{
			id: 'money',
			title: 'Money',
		},
	];

	protected readonly numberTypes: readonly ISelectItem[] = [
		{
			id: 'absolute',
			title: 'Absolute current value',
			description1:
				'Records absolute current values that is not summed up over time',
			description2: '(e.g., mileage, odometer readings, etc.)',
		},
		{
			id: 'Summable',
			title: 'Summable value',
			description1: 'Records values that can be summed over time',
			description2: '(e.g., distance, expenses, etc.)',
		},
	];

	protected readonly categories: readonly ISelectItem[] = [
		{
			id: 'fitness',
			title: 'Fitness',
			emoji: '🏋',
		},
		{
			id: 'health',
			title: 'Health',
			emoji: '⚕️',
		},
	];

	protected onValueTypeChange = (value: string) => {
		this.$valueType.set(value as TrackerValueType);
	};
	protected onNumberTypeChange = (value: string) => {
		this.$numberKind.set(value as NumberKind);
	};

	protected onTitleChange = (event: CustomEvent) => {
		this.$title.set((event.detail.value as string) || '');
	};

	protected onTrackByChange = (trackBy: TrackBy, event: CustomEvent) => {
		const checked = (event.target as HTMLInputElement).checked;
		const trackByState = this.$trackBy();
		if (checked) {
			this.$trackBy.set([...trackByState, trackBy]);
		} else {
			this.$trackBy.set(trackByState.filter((v) => v !== trackBy));
		}
	};

	protected submit(): void {
		console.log(
			`submit: category=${this.$category()}, valueType=${this.$valueType()}, numberType=${this.$numberKind()}`,
		);
		if (!this.form.valid) {
			console.log('Form is not valid');
			return;
		}

		const valueType = this.$valueType();
		if (!valueType) {
			console.log('Value type is not selected');
			return;
		}
		const request: ICreateTrackerRequest = {
			spaceID: this.space().id,
			trackBy: this.$trackBy(),
			categories: [this.$categoryState()],
			title: this.titleFormControl.value || '',
			valueType,
			numberKind: this.$numberKind() || undefined,
		};
		this.trackusApiService.createTracker(request).subscribe({
			next: (response) => {
				console.log(`Tracker created with ID=${response.trackerID}`);
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to create tracker');
			},
		});
	}
}
