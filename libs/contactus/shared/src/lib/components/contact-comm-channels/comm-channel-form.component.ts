import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	inject,
	input,
	Output,
	signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
	IonTextarea,
} from '@ionic/angular/standalone';
import { ContactCommChannelType, IContactContext } from '@sneat/contactus-core';
import {
	ContactService,
	IAddContactCommChannelRequest,
} from '@sneat/contactus-services';
import {
	ClassName,
	ISelectItem,
	SelectFromListComponent,
	SneatBaseComponent,
} from '@sneat/ui';

@Component({
	imports: [
		IonButton,
		IonButtons,
		IonIcon,
		IonInput,
		IonItem,
		IonLabel,
		IonSelect,
		IonTextarea,
		SelectFromListComponent,
		IonSelectOption,
		ReactiveFormsModule,
	],
	providers: [
		{
			provide: ClassName,
			useValue: 'CommChannelFormComponent',
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-comm-channel-form',
	templateUrl: 'comm-channel-form.component.html',
})
export class CommChannelFormComponent extends SneatBaseComponent {
	public readonly $contact = input.required<IContactContext>();
	public readonly $channelType = input.required<ContactCommChannelType>();
	public readonly $placeholder = input.required<string>();

	@Output() public readonly closeForm = new EventEmitter<void>();

	protected readonly $type = signal<'personal' | 'work' | undefined>(undefined);

	protected readonly channelID = new FormControl('', Validators.required);

	protected readonly types: readonly ISelectItem[] = [
		{ id: 'personal', title: 'Personal' },
		{ id: 'work', title: 'Work' },
	];

	protected onTypeChanged(value: string): void {
		this.$type.set(value as 'personal' | 'work');
	}

	private readonly contactService = inject(ContactService);

	protected readonly $saving = signal(false);

	protected addNewChannel(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		console.log('addNewChannel');
		const contact = this.$contact();
		if (!contact.id) {
			return;
		}
		const channelID = (this.channelID.value || '').trim();
		if (!channelID) {
			this.channelID.markAsTouched();
			this.channelID.setErrors({ required: true });
			return;
		}
		const request: IAddContactCommChannelRequest = {
			contactID: contact.id,
			spaceID: contact.space.id,
			channelType: this.$channelType(),
			type: 'private',
			channelID,
		};
		this.$saving.set(true);
		this.contactService.addContactCommChannel(request).subscribe({
			next: () => {
				this.closeForm.emit();
			},
			error: (err) => {
				this.$saving.set(false);
				this.errorLogger.logError(err, `Failed to add ${this.$channelType()}`);
			},
		});
	}
}
