import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Input,
	signal,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { IPersonNames } from '@sneat/auth-models';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { NamesFormComponent } from '../../components/contact-forms/person-forms/names-form';
import { ClassName, SneatBaseModalComponent } from '@sneat/ui';

@Component({
	imports: [
		IonButton,
		IonButtons,
		IonContent,
		IonHeader,
		IonIcon,
		IonTitle,
		IonToolbar,
		NamesFormComponent,
		IonFooter,
		IonLabel,
	],
	providers: [
		{
			provide: ClassName,
			useValue: 'ContactNamesModalComponent',
		},
	],
	selector: 'sneat-contact-names-modal',
	templateUrl: './contact-names-modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactNamesModalComponent extends SneatBaseModalComponent {
	@Input({ required: true }) spaceID?: string;
	@Input({ required: true }) contactID?: string;
	@Input({ required: true }) public names: IPersonNames = {};

	private readonly contactService = inject(ContactService);

	protected readonly $saving = signal(false);

	protected onNamesChanged(names: IPersonNames): void {
		this.names = names;
	}

	protected saveChanges(): void {
		this.$saving.set(true);
		const contactID = this.contactID;
		if (!contactID) {
			this.errorLogger.logError('Contact ID is required');
			return;
		}
		const spaceID = this.spaceID;
		if (!spaceID) {
			this.errorLogger.logError('Space ID is required');
			return;
		}
		const names = this.names;
		if (!names) {
			this.errorLogger.logError('Names are required');
			return;
		}
		const request: IUpdateContactRequest = {
			contactID,
			spaceID,
			names,
		};
		this.contactService.updateContact(request).subscribe({
			next: () => {
				this.$saving.set(false);
				this.dismissModal(names);
			},
			error: (err) => {
				this.$saving.set(false);
				this.errorLogger.logError(err);
			},
		});
	}

	protected readonly personalbar = personalbar;
}
