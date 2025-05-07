import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	Output,
} from '@angular/core';
import { IonCheckbox, IonItem, IonSpinner } from '@ionic/angular/standalone';
import { personName } from '@sneat/components';
import { IContactWithBrief, IContactWithCheck } from '@sneat/contactus-core';

interface IItemWithEvent<T> {
	event: Event;
	item: T;
}

@Component({
	selector: 'sneat-contacts-checklist-item',
	templateUrl: 'contacts-checklist-item.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonItem, IonCheckbox, IonSpinner],
})
export class ContactsChecklistItemComponent {
	public readonly $contact = input.required<IContactWithCheck>();
	private readonly $contactID = computed(() => this.$contact().id);
	public readonly $isLast = input.required<boolean>();
	public readonly $lastItemLine = input<
		undefined | 'full' | 'none' | 'inset'
	>();

	public readonly $checkedInProgress = input.required<readonly string[]>();
	public readonly $uncheckedInProgress = input.required<readonly string[]>();

	@Output() public readonly checkboxChange = new EventEmitter<
		IItemWithEvent<IContactWithBrief>
	>();

	protected onCheckboxChange(event: Event, contact: IContactWithBrief): void {
		this.checkboxChange.emit({ event, item: contact });
	}

	protected readonly $isDisabled = computed(() => {
		const contactID = this.$contactID();
		return (
			this.$checkedInProgress().includes(contactID) ||
			this.$uncheckedInProgress().includes(contactID)
		);
	});
	protected readonly personName = personName;
}
