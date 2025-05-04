import {
	Component,
	inject,
	Input,
	OnInit,
	ViewChild,
	signal,
	ChangeDetectionStrategy,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
	IonTextarea,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import {
	HappeningService,
	HappeningServiceModule,
	IUpdateHappeningTextsRequest,
} from '../../services/happening.service';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { SneatBaseModalComponent } from '@sneat/ui';

@Component({
	imports: [
		IonButton,
		IonButtons,
		IonIcon,
		IonInput,
		IonItem,
		IonLabel,
		ReactiveFormsModule,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonFooter,
		IonTextarea,
		HappeningServiceModule,
		IonSpinner,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './happening-title-modal.component.html',
	selector: 'sneat-happening-title-modal',
})
export class HappeningTitleModalComponent
	extends SneatBaseModalComponent
	implements OnInit
{
	@Input({ required: true }) happening?: IHappeningContext;

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;

	protected readonly title = new FormControl<string>('', Validators.required);
	protected readonly summary = new FormControl<string>('');
	protected readonly description = new FormControl<string>('');

	protected readonly form = new FormGroup({
		title: this.title,
	});

	protected onEnter(event: Event): void {
		console.log('onEnter()', event);
	}

	private happeningService = inject(HappeningService);

	constructor() {
		super('HappeningTitleModalComponent');
	}

	ngOnInit(): void {
		const h = this.happening || { id: '', space: { id: '' } };
		this.title.setValue(h?.dbo?.title || h?.brief?.title || h.id);
	}

	protected readonly $isSubmitting = signal(false);

	protected submit(): void {
		const spaceID = this.happening?.space?.id;
		const happeningID = this.happening?.id;
		if (!spaceID) {
			throw new Error('space ID is not defined');
		}
		if (!happeningID) {
			throw new Error('happening ID is not defined');
		}
		const title = this.title.value;
		if (!title) {
			return;
		}
		const request: IUpdateHappeningTextsRequest = {
			spaceID,
			happeningID,
			title,
			summary: this.summary.value || undefined,
			description: this.description.value || undefined,
		};
		this.$isSubmitting.set(true);
		this.happeningService.updateHappeningTexts(request).subscribe({
			next: () => {
				this.$isSubmitting.set(false);
				this.dismissModal();
			},
			error: (error) => {
				this.$isSubmitting.set(false);
				this.errorLogger.logError(error, 'Failed to update happening texts');
			},
		});
	}
}
