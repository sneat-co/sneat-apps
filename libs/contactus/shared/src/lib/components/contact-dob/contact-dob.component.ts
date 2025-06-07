import {
	Component,
	ChangeDetectionStrategy,
	input,
	computed,
	inject,
	signal,
} from '@angular/core';
import { DateInputComponent } from '@sneat/components';
import { IContactContext } from '@sneat/contactus-core';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { ClassName, SneatBaseComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-contact-dob',
	templateUrl: './contact-dob.component.html',
	imports: [DateInputComponent],
	providers: [
		{
			provide: ClassName,
			useValue: 'ContactDobComponent',
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDobComponent extends SneatBaseComponent {
	constructor() {
		super();
	}

	public readonly $contact = input.required<IContactContext | undefined>();
	public readonly $updating = signal(false);

	protected readonly $dob = computed(() => {
		const contact = this.$contact();
		return contact?.dbo ? contact.dbo.dob || '' : undefined;
	});

	protected readonly today = new Date().toISOString().slice(0, 10);

	private readonly contactService = inject(ContactService);

	protected onDobChanged(dateOfBirth: string | undefined): void {
		const contact = this.$contact();
		if (!contact) {
			return;
		}
		const spaceID = contact.space.id;

		const request: IUpdateContactRequest = {
			spaceID,
			contactID: contact.id,
			dateOfBirth,
		};
		this.$updating.set(true);
		this.contactService.updateContact(request).subscribe({
			next: (): void => {
				this.$updating.set(false);
			},
			error: (err) => {
				this.$updating.set(false);
				this.errorLogger.logError(
					err,
					'failed to update contact date of birth',
				);
			},
		});
	}
}
