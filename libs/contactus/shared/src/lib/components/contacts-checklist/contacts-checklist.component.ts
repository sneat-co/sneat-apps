import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	input,
	Input,
	OnChanges,
	Output,
	signal,
	computed,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { personName } from '@sneat/components';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';

export interface ICheckChangedArgs {
	event: Event;
	id: string;
	checked: boolean;
	resolve: () => void;
	reject: (reason?: unknown) => void;
}

interface IContactWithCheck extends IIdAndBrief<IContactBrief> {
	readonly isChecked: boolean;
}

@Component({
	selector: 'sneat-contacts-checklist',
	templateUrl: './contacts-checklist.component.html',
	imports: [IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsChecklistComponent
	extends SneatBaseComponent
	implements OnChanges
{
	public readonly $lastItemLine = input<
		undefined | 'full' | 'none' | 'inset'
	>();

	public readonly $spaceRoles = input<readonly string[]>(['member']);
	public readonly $spaceRolesToExclude = input<undefined | readonly string[]>();
	public readonly $onlySelected = input<boolean>(false);
	public readonly $checkedContactIDs = input.required<readonly string[]>();

	@Input({ required: true }) space?: ISpaceContext;
	@Input() roles: string[] = ['member'];

	@Input() noContactsMessage = 'No members found';

	@Output() readonly checkedChange = new EventEmitter<ICheckChangedArgs>();

	private contactusSpaceSubscription?: Subscription;

	protected readonly $spaceContacts = signal<
		IIdAndBrief<IContactBrief>[] | undefined
	>(undefined);

	protected readonly $contactsToDisplay = computed<
		undefined | readonly IContactWithCheck[]
	>(() => {
		const contacts = this.$spaceContacts(),
			roles = this.$spaceRoles(),
			rolesToExclude = this.$spaceRolesToExclude(),
			onlySelected = this.$onlySelected(),
			checkedInProgress = this.$checkedInProgress(),
			uncheckedInProgress = this.$uncheckedInProgress(),
			checkedContactIDs = this.$checkedContactIDs();

		const isSelected = (contactID: string) =>
			!uncheckedInProgress.includes(contactID) &&
			(checkedContactIDs.includes(contactID) ||
				checkedInProgress.includes(contactID));

		const hasIncludedRole = roles.length
			? (c: IIdAndBrief<IContactBrief>) =>
					roles.some((r) => c.brief?.roles?.includes(r))
			: () => true;

		const hasExcludedRole = rolesToExclude
			? (c: IIdAndBrief<IContactBrief>) =>
					rolesToExclude.some((r) => c.brief?.roles?.includes(r))
			: () => false;

		if (!contacts) {
			return undefined;
		}

		console.log(
			'ContactsChecklistComponent.subscribeForContactBriefs() =>',
			contacts,
			roles,
			rolesToExclude,
		);

		return contacts
			.filter((c) => hasIncludedRole(c) && !hasExcludedRole(c))
			.map((c) => ({
				id: c.id,
				brief: c.brief,
				isChecked: isSelected(c.id),
			}))
			.filter((c) => !onlySelected || c.isChecked);
	});

	protected readonly contactID = (
		_: number,
		contact: IIdAndBrief<IContactBrief>,
	) => contact.id;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactsChecklistComponent');
	}

	private subscribeForContactBriefs(space: ISpaceContext): void {
		console.log(
			`ContactsChecklistComponent.subscribeForContactBriefs(space=${space?.id})`,
		);
		this.contactusSpaceSubscription = this.contactusSpaceService
			.watchContactBriefs(space.id)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (contacts) => {
					this.$spaceContacts.set(contacts);
				},
			});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsChecklistComponent.ngOnChanges()', changes);
		if (changes['space']) {
			const spaceChanges = changes['space'];
			const previousSpace = spaceChanges.previousValue as ISpaceContext;

			if (previousSpace?.id !== this.space?.id) {
				this.contactusSpaceSubscription?.unsubscribe();
				if (this.space?.id) {
					this.subscribeForContactBriefs(this.space);
				}
			}
		}
	}

	protected isDisabled(contactID: string): boolean {
		return (
			this.$checkedInProgress().includes(contactID) ||
			this.$uncheckedInProgress().includes(contactID)
		);
	}

	protected readonly $checkedInProgress = signal<readonly string[]>([]);
	protected readonly $uncheckedInProgress = signal<readonly string[]>([]);

	protected onCheckboxChange(
		event: Event,
		contact: IIdAndBrief<IContactBrief>,
	): void {
		const ce = event as CustomEvent;
		const cID = contact.id;

		console.log('onCheckboxChange()', ce);
		const checked = !!ce.detail.checked;
		if (checked) {
			if (!this.$checkedInProgress().includes(cID)) {
				this.$checkedInProgress.update((v) => [...v, cID]);
			}
		} else if (!this.$uncheckedInProgress().includes(cID)) {
			this.$uncheckedInProgress.update((v) => [...v, cID]);
		}
		const clearInProgress = () => {
			console.log('clearInProgress()', cID, checked);
			if (checked) {
				this.$checkedInProgress.update((v) => v.filter((id) => id !== cID));
			} else {
				this.$uncheckedInProgress.update((v) => v.filter((id) => id !== cID));
			}
			this.changeDetectorRef.markForCheck();
		};
		new Promise<void>((resolve, reject) => {
			this.checkedChange.emit({
				event: ce,
				id: cID,
				checked,
				resolve,
				reject,
			});
		})
			.then(clearInProgress)
			.catch((err) => {
				this.errorLogger.logError(err);

				// Restore checkbox state with a delay
				// to allow users to see that check change was registered and processed
				setTimeout(clearInProgress, 500);
			});
	}

	protected readonly personName = personName;
}
