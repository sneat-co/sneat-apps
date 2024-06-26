import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { personName } from '@sneat/components';
import { ContactusTeamService } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
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
	standalone: true,
	imports: [CommonModule, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsChecklistComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() roles: string[] = ['member'];
	@Input({ required: true }) checkedContactIDs: readonly string[] = [];
	@Input() noContactsMessage = 'No members found';

	@Output() readonly checkedChange = new EventEmitter<ICheckChangedArgs>();

	private contactusTeamSubscription?: Subscription;
	protected readonly contacts = signal<
		IIdAndBrief<IContactBrief>[] | undefined
	>(undefined);

	protected readonly contactID = (
		_: number,
		contact: IIdAndBrief<IContactBrief>,
	) => contact.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly contactusTeamService: ContactusTeamService,
	) {}

	private subscribeForContactBriefs(team: ITeamContext): void {
		console.log(
			`ContactsChecklistComponent.subscribeForContactBriefs(team=${team?.id})`,
		);
		this.contactusTeamSubscription = this.contactusTeamService
			.watchContactBriefs(team.id)
			// .pipe(takeUntilDestroyed())
			.subscribe({
				next: (contacts) => {
					console.log(
						'ContactsChecklistComponent.subscribeForContactBriefs() =>',
						contacts,
					);
					const roles = this.roles;
					this.contacts.set(
						contacts
							.filter((c) => roles?.some((r) => c.brief?.roles?.includes(r)))
							.map((c) => ({ id: c.id, brief: c.brief as IContactBrief })),
					);
				},
			});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsChecklistComponent.ngOnChanges()', changes);
		if (changes['team']) {
			const teamChanges = changes['team'];
			const previousTeam = teamChanges.previousValue as ITeamContext;

			if (previousTeam?.id !== this.team?.id) {
				this.contactusTeamSubscription?.unsubscribe();
				if (this.team?.id) {
					this.subscribeForContactBriefs(this.team);
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
