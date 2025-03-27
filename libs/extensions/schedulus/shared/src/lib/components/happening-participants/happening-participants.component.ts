import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	OnChanges,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	ContactsChecklistComponent,
	ContactSelectorService,
	ContactSelectorServiceModule,
	ICheckChangedArgs,
} from '@sneat/contactus-shared';
import { AnalyticsService } from '@sneat/core';
import {
	addRelatedItem,
	getRelatedItemIDs,
	removeRelatedItem,
} from '@sneat/dto';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import {
	HappeningService,
	IHappeningContactRequest,
	IHappeningContactsRequest,
} from '../../services/happening.service';

@Component({
	selector: 'sneat-happening-participants',
	templateUrl: 'happening-participants.component.html',
	imports: [
		IonicModule,
		ContactsChecklistComponent,
		ContactSelectorServiceModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningParticipantsComponent {
	// @Input({ required: true }) space?: ISpaceContext;
	public readonly $happening = input.required<IHappeningContext>();
	// @Input({ required: true }) happening?: IHappeningContext;

	public readonly $space = computed(() => this.$happening().space);
	protected readonly $membersTabLabel = computed(() =>
		this.$space().type === 'family' ? 'Family members' : 'Team members',
	);

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	protected readonly $relatedContactIDs = computed<readonly string[]>(() => {
		const happening = this.$happening();
		return getRelatedItemIDs(
			happening.dbo?.related || happening.brief?.related,
			'contactus',
			'contacts',
		);
	});

	private readonly contactSelectorService = inject(ContactSelectorService);

	private readonly analytics = inject(AnalyticsService);

	constructor(private readonly happeningService: HappeningService) {}

	protected onCheckChanged(args: ICheckChangedArgs): void {
		console.log('HappeningParticipantsComponent.onCheckChanged()', args);
		this.analytics.logEvent(
			`happening/participants/${args.checked ? 'checked' : 'unchecked'}`,
		);
		// this.populateParticipants();

		const space = this.$space();
		const happening = this.$happening();

		if (!happening.id) {
			this.addRemoveRelated([args]);
			args.resolve();
			return;
		}
		const request: IHappeningContactRequest = {
			spaceID: space.id,
			happeningID: happening?.id,
			contact: { id: args.id },
		};
		const apiCall = args.checked
			? this.happeningService.addParticipant
			: this.happeningService.removeParticipant;
		apiCall(request).subscribe({
			next: () => {
				this.addRemoveRelated([args]);
				args.resolve();
			},
			error: args.reject,
		});
	}

	private readonly emitHappeningChange = (happening: IHappeningContext) =>
		this.happeningChange.emit(happening);

	private addRemoveRelated(args: readonly ICheckChangedArgs[]): void {
		let happening = this.$happening();
		const { brief, dbo } = happening;
		if (!brief || !dbo) {
			return;
		}
		let happeningBase: IHappeningBase = {
			...(dbo || brief),
		};
		args.forEach((arg) => {
			const addOrRemove = arg.checked ? addRelatedItem : removeRelatedItem;

			happeningBase = {
				...happeningBase,
				related: addOrRemove(
					happeningBase.related,
					'contactus',
					'contacts',
					happening.space.id || '',
					arg.id,
				),
			};
		});

		happening = {
			...happening,
			brief: {
				...(brief || {}),
				...happeningBase,
			},
			dbo: {
				...(dbo || {}), // TODO: It does not make much sense to update DTO as brief should be enough?
				...happeningBase,
			},
		};
		this.emitHappeningChange(happening);
	}

	protected addContact(event: Event, source: string): void {
		this.analytics.logEvent('happening/participants/add_contact', { source });
		const spaceID = this.$space().id;
		if (!spaceID) {
			return;
		}
		const happeningID = this.$happening().id;
		this.contactSelectorService
			.selectMultipleInModal({
				selectedItems: [],
				componentProps: {
					space: this.$space(),
				},
			})
			.then((selectedContacts) => {
				console.log(
					`${selectedContacts?.length || 0} contacts select by user to be added as participants`,
				);
				const existingContactIDs = this.$relatedContactIDs();
				const contactsToAdd = selectedContacts?.filter(
					(c) => !existingContactIDs.includes(c.id),
				);
				if (contactsToAdd?.length) {
					const request: IHappeningContactsRequest = {
						spaceID,
						happeningID,
						contacts: contactsToAdd.map((c) => ({
							id: c.id,
						})),
					};
					this.happeningService.addParticipants(request).subscribe({
						next: () => {
							console.log(
								`${contactsToAdd.length} contacts added as participants`,
							);
							const args: readonly ICheckChangedArgs[] = request.contacts.map(
								(c) => ({
									event,
									id: c.id,
									checked: true,
									resolve: () => void 0,
									reject: () => void 0,
								}),
							);
							this.addRemoveRelated(args);
						},
					});
				} else {
					console.log('selected contacts already added as participants');
				}
			})
			.catch((err) => alert(err));
	}
}
