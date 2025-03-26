import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactusSpaceService } from '@sneat/contactus-services';
import {
	ContactsChecklistComponent,
	ICheckChangedArgs,
} from '@sneat/contactus-shared';
import { addRelatedItem, getRelatedItemIDs } from '@sneat/dto';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import {
	HappeningService,
	IHappeningContactRequest,
} from '../../services/happening.service';

@Component({
	selector: 'sneat-happening-participants',
	templateUrl: 'happening-participants.component.html',
	imports: [IonicModule, ContactsChecklistComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningParticipantsComponent implements OnChanges {
	// @Input({ required: true }) space?: ISpaceContext;
	public readonly $happening = input.required<IHappeningContext>();
	// @Input({ required: true }) happening?: IHappeningContext;

	public readonly $space = computed(() => this.$happening().space);

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	protected readonly $checkedContactIDs = signal<readonly string[]>([]);

	protected readonly $tab = signal<'members' | 'others'>('members');

	// protected members?: readonly IIdAndBrief<IContactBrief>[];

	constructor(
		private readonly happeningService: HappeningService,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {}

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
		if (changes['happening']) {
			const checkedContactIDs = getRelatedItemIDs(
				happening.dbo?.related || happening.brief?.related,
				'contactus',
				'contacts',
				this.$space().id,
			);
			this.$checkedContactIDs.set(checkedContactIDs);
			console.log('checkedContactIDs', checkedContactIDs, happening);
		}
	}

	public get membersTabLabel(): string {
		const space = this.$space();
		return space.type === 'family' ? 'Family members' : 'Team members';
	}

	// protected get members(): readonly IContactContext[] | undefined {
	// 	const contactusSpace = this.contactusSpace,
	// 		space = this.space;
	//
	// 	if (!space || !contactusSpace) {
	// 		return;
	// 	}
	// 	return zipMapBriefsWithIDs(contactusSpace?.dbo?.contacts).map((m) =>
	// 		contactContextFromBrief(m, space),
	// 	);
	// }

	protected isMemberCheckChanged(args: ICheckChangedArgs): void {
		console.log('isMemberCheckChanged()', args);
		// this.populateParticipants();

		const addRemoveContactID = () => {
			const checkedContactIDs = this.$checkedContactIDs();
			if (args.checked && !checkedContactIDs.includes(args.id)) {
				this.$checkedContactIDs.set([...checkedContactIDs, args.id]);
			} else if (!args.checked && checkedContactIDs.includes(args.id)) {
				this.$checkedContactIDs.set(
					checkedContactIDs.filter((id) => id !== args.id),
				);
			}
		};

		const space = this.$space();
		const happening = this.$happening();

		if (!happening.id) {
			addRemoveContactID();
			this.populateParticipants();
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
				addRemoveContactID();
				args.resolve();
			},
			error: args.reject,
		});
	}

	private readonly emitHappeningChange = (happening: IHappeningContext) =>
		this.happeningChange.emit(happening);

	private populateParticipants(): void {
		let happening = this.$happening();
		const { brief, dbo } = happening;
		if (!brief || !dbo) {
			return;
		}
		let happeningBase: IHappeningBase = {
			...(dbo || brief),
		};
		this.$checkedContactIDs().forEach((contactID) => {
			happeningBase = {
				...happeningBase,
				related: addRelatedItem(
					happeningBase.related,
					'contactus',
					'contacts',
					happening.space.id || '',
					contactID,
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

	addContact(): void {
		alert('Not implemented yet');
	}

	protected onTabChanged(event: CustomEvent): void {
		this.$tab.set(event.detail.value);
	}
}
