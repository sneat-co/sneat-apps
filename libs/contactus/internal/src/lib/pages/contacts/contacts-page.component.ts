import {
	ChangeDetectionStrategy,
	Component,
	computed,
	OnDestroy,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	ContactsComponent,
	ContactsComponentCommand,
} from '@sneat/contactus-shared';
import { IIdAndBrief, listItemAnimations } from '@sneat/core';
import { setHrefQueryParam } from '@sneat/core';
import { ContactRole, IContactBrief } from '@sneat/contactus-core';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
	SpaceItemsBaseComponent,
} from '@sneat/space-components';
import {
	ContactusServicesModule,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'sneat-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [SpaceComponentBaseParams],
	animations: [listItemAnimations],
	imports: [
		FormsModule,
		IonicModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		ContactsComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPageComponent
	extends SpaceItemsBaseComponent
	implements OnDestroy
{
	protected readonly $allContacts = signal<
		undefined | readonly IIdAndBrief<IContactBrief>[]
	>(undefined);

	// public readonly $filter = signal<string>('');
	public readonly $role = signal<ContactRole | undefined>(undefined);
	private contactsSubscription?: Subscription;

	protected $pageTitle = computed(() => {
		const role = this.$role();
		if (role) {
			return `${role.toUpperCase() + role.substr(1)}s`;
		}
		return 'Contacts';
	});

	protected readonly $selectedContacts = signal<
		readonly IIdAndBrief<IContactBrief>[]
	>([]);

	protected selectedContactsChanged(
		contacts: readonly IIdAndBrief<IContactBrief>[],
	): void {
		this.$selectedContacts.set(contacts);
	}

	constructor(
		// private readonly contactService: ContactService,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactsPageComponent', '');
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.$role.set(role[1] as ContactRole);
		}
		const allContacts = window.history.state
			.contacts as IIdAndBrief<IContactBrief>[];
		this.$allContacts.set(allContacts);

		this.route.queryParamMap.pipe(this.takeUntilDestroyed()).subscribe({
			next: (q) => {
				this.$role.set((q.get('role') as ContactRole) || undefined);
			},
		});
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		this.contactsSubscription?.unsubscribe();
		if (this.contactsSubscription) {
			this.contactsSubscription.unsubscribe();
		}
		if (!this.space) {
			return;
		}

		this.contactusSpaceService.watchContactBriefs(this.space.id).subscribe({
			next: (contacts) => {
				this.setSpaceContacts(contacts || []);
			},
		});
	}

	protected $titleIcon = computed(() => {
		switch (this.$role()) {
			case 'tenant':
				return '🤠';
			case 'landlord':
				return '🤴';
			case 'applicant':
				return '🤔';
			default:
				return '📇';
		}
	});

	private readonly setSpaceContacts = (
		contacts: IIdAndBrief<IContactBrief>[],
	): void => {
		console.log('ContactsPageComponent.setSpaceContacts()', contacts);
		this.$allContacts.set(contacts);
	};

	protected onRoleChanged(role?: ContactRole): void {
		this.$role.set(role);
		const url = setHrefQueryParam('role', role || '');
		history.replaceState(undefined, document.title, url);
	}

	protected readonly command = new Subject<ContactsComponentCommand>();

	public override ngOnDestroy(): void {
		this.command.complete();
		super.ngOnDestroy();
	}
}
