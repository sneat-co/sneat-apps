import {
	ChangeDetectionStrategy,
	Component,
	effect,
	EventEmitter,
	input,
	Input,
	Output,
	signal,
} from '@angular/core';
import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { ContactType } from '@sneat/contactus-core';
import { Observable } from 'rxjs';
import { IContactAddEventArgs } from '../../contact-events';
import { NewCompanyFormComponent } from './new-company-form.component';
import { NewContactBaseFormComponent } from './new-contact-base-form-component';
import {
	NewContactFormCommand,
	NewPersonFormComponent,
} from './new-person-form.component';

type NewContactFormTab = 'person' | 'company' | 'location';

@Component({
	selector: 'sneat-new-contact-form',
	templateUrl: './new-contact-form.component.html',
	imports: [
		IonSegment,
		IonSegmentButton,
		NewPersonFormComponent,
		NewCompanyFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewContactFormComponent extends NewContactBaseFormComponent {
	protected $tab = signal<NewContactFormTab | undefined>(undefined);

	@Input() command?: Observable<NewContactFormCommand>;
	@Input() selectGroupAndRole$?: Observable<IContactAddEventArgs | undefined>;

	@Output() public readonly creatingChange = new EventEmitter<boolean>();

	constructor() {
		super('NewContactFormComponent');
		effect(() => {
			const contactType = this.$contactType();
			switch (contactType) {
				case 'person':
				case 'company':
				case 'location':
					this.$tab.set(contactType);
					break;
				case undefined:
					this.$tab.set('person');
			}
		});
	}

	protected onTabChange(event: CustomEvent): void {
		const tab = event.detail.value as 'person' | 'company';
		this.$tab.set(tab);
	}
}
