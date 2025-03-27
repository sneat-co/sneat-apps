import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	OnChanges,
	Output,
	SimpleChanges,
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
export class HappeningParticipantsComponent implements OnChanges {
	// @Input({ required: true }) space?: ISpaceContext;
	public readonly $happening = input.required<IHappeningContext>();
	// @Input({ required: true }) happening?: IHappeningContext;

	public readonly $space = computed(() => this.$happening().space);

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	protected readonly $checkedContactIDs = computed<readonly string[]>(() => {
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

	// private contactusSpaceSubscription?: Subscription;
	// private onSpaceIdChanged(): void {
	// 	this.contactusSpaceSubscription?.unsubscribe();
	// 	const spaceID = this.space?.id;
	// 	if (!spaceID) {
	// 		return;
	// 	}
	// 	this.contactusSpaceSubscription = this.contactusSpaceService
	// 		.watchContactBriefs(spaceID)
	// 		.subscribe({
	// 			next: (contactBriefs) => {
	// 				this.members = contactBriefs;
	// 			},
	// 			error: (error) =>
	// 				console.error('Failed to load contactus space', error),
	// 		});
	// }

	ngOnChanges(changes: SimpleChanges): void {
		const happening = this.$happening();
		console.log(
			'HappeningParticipantsComponent.ngOnChanges()',
			changes,
			happening.dbo?.related,
		);
	}

	public get membersTabLabel(): string {
		const space = this.$space();
		return space.type === 'family' ? 'Family members' : 'Team members';
	}

	protected onCheckChanged(args: ICheckChangedArgs): void {
		console.log('HappeningParticipantsComponent.onCheckChanged()', args);
		this.analytics.logEvent(
			`happening/participants/${args.checked ? 'checked' : 'unchecked'}`,
		);
		// this.populateParticipants();

		const space = this.$space();
		const happening = this.$happening();

		if (!happening.id) {
			this.addRemoveRelated(args);
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
				this.addRemoveRelated(args);
				args.resolve();
			},
			error: args.reject,
		});
	}

	private readonly emitHappeningChange = (happening: IHappeningContext) =>
		this.happeningChange.emit(happening);

	private addRemoveRelated(args: ICheckChangedArgs): void {
		let happening = this.$happening();
		const { brief, dbo } = happening;
		if (!brief || !dbo) {
			return;
		}
		let happeningBase: IHappeningBase = {
			...(dbo || brief),
		};
		const addOrRemove = args.checked ? addRelatedItem : removeRelatedItem;

		happeningBase = {
			...happeningBase,
			related: addOrRemove(
				happeningBase.related,
				'contactus',
				'contacts',
				happening.space.id || '',
				args.id,
			),
		};

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

	protected addContact(source: string): void {
		this.analytics.logEvent('happening/participants/add_contact', { source });
		this.contactSelectorService
			.selectMultipleInModal({
				selectedItems: [],
				componentProps: {
					space: this.$space(),
				},
			})
			.then((selectedContacts) => {
				alert(`You've selected ${selectedContacts?.length || 0} contacts:`);
			})
			.catch((err) => alert(err));
	}
}
