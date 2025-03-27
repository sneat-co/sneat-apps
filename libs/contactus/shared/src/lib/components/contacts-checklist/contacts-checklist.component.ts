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
	event: CustomEvent;
	id: string;
	checked: boolean;
	resolve: () => void;
	reject: (reason?: unknown) => void;
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

	@Input({ required: true }) space?: ISpaceContext;
	@Input() roles: string[] = ['member'];

	@Input({ required: true }) checkedContactIDs: readonly string[] = [];
	@Input() noContactsMessage = 'No members found';

	@Output() readonly checkedChange = new EventEmitter<ICheckChangedArgs>();

	private contactusSpaceSubscription?: Subscription;
	protected readonly contacts = signal<
		IIdAndBrief<IContactBrief>[] | undefined
	>(undefined);

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
					const roles = this.$spaceRoles();
					const hasIncludedRole = roles.length
						? (c: IIdAndBrief<IContactBrief>) =>
								roles.some((r) => c.brief?.roles?.includes(r))
						: () => true;

					const rolesToExclude = this.$spaceRolesToExclude();
					const hasExcludedRole = rolesToExclude
						? (c: IIdAndBrief<IContactBrief>) =>
								rolesToExclude.some((r) => c.brief?.roles?.includes(r))
						: () => false;

					console.log(
						'ContactsChecklistComponent.subscribeForContactBriefs() =>',
						contacts,
						roles,
						rolesToExclude,
					);

					this.contacts.set(
						contacts
							.filter((c) => hasIncludedRole(c) && !hasExcludedRole(c))
							.map((c) => ({ id: c.id, brief: c.brief as IContactBrief })),
					);
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

	protected isChecked(contact: IIdAndBrief<IContactBrief>): boolean {
		// const participantID = `${this.team?.id}_${contact.id}`;
		const participantID = contact.id;
		return (
			!this.uncheckedInProgress.includes(contact.id) &&
			(this.checkedContactIDs.includes(participantID) ||
				this.checkedInProgress.includes(contact.id))
		);
	}

	protected isDisabled(contactID: string): boolean {
		return (
			this.checkedInProgress.includes(contactID) ||
			this.uncheckedInProgress.includes(contactID)
		);
	}

	protected checkedInProgress: string[] = [];
	protected uncheckedInProgress: string[] = [];

	protected onCheckboxChange(
		event: Event,
		contact: IIdAndBrief<IContactBrief>,
	): void {
		const ce = event as CustomEvent;
		const { id } = contact;
		console.log('onCheckboxChange()', ce);
		const checked = !!ce.detail.checked;
		if (checked && !this.checkedInProgress.includes(id)) {
			this.checkedInProgress = [...this.checkedInProgress, id];
		} else if (!checked && !this.uncheckedInProgress.includes(id)) {
			this.uncheckedInProgress = [...this.uncheckedInProgress, id];
		}
		const clearInProgress = () => {
			console.log('clearInProgress()', id, checked);
			if (checked) {
				this.checkedInProgress = this.checkedInProgress.filter((v) => v !== id);
			} else {
				this.uncheckedInProgress = this.uncheckedInProgress.filter(
					(v) => v !== id,
				);
			}
			this.changeDetectorRef.markForCheck();
		};
		new Promise<void>((resolve, reject) => {
			this.checkedChange.emit({ event: ce, id, checked, resolve, reject });
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
