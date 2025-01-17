import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactusSpaceService } from '@sneat/contactus-services';
import {
	ContactsChecklistComponent,
	ICheckChangedArgs,
} from '@sneat/contactus-shared';
import { addRelatedItem, getRelatedItemIDs } from '@sneat/dto';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';
import { HappeningService, IHappeningContactRequest } from '../..';

@Component({
	selector: 'sneat-happening-participants',
	templateUrl: 'happening-participants.component.html',
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		ContactsChecklistComponent,
		FormsModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningParticipantsComponent implements OnChanges {
	// @Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) happening?: IHappeningContext;

	protected get space(): ISpaceContext | undefined {
		return this.happening?.space;
	}

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public checkedContactIDs: readonly string[] = [];
	public contacts: number[] = [];
	public tab: 'members' | 'others' = 'members';

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
		console.log(
			'HappeningParticipantsComponent.ngOnChanges()',
			changes,
			this.happening?.dbo?.related,
		);
		if (changes['happening']) {
			this.checkedContactIDs = getRelatedItemIDs(
				this.happening?.dbo?.related || this.happening?.brief?.related,
				'contactus',
				'contacts',
				this.space?.id,
			);
			console.log('checkedContactIDs', this.checkedContactIDs, this.happening);
		}
	}

	public get membersTabLabel(): string {
		return this.space?.brief?.type === 'family'
			? 'Family members'
			: 'Team members';
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
		if (!this.happening?.id || !this.space?.id) {
			args.resolve();
			return;
		}
		const request: IHappeningContactRequest = {
			spaceID: this.space.id,
			happeningID: this.happening?.id,
			contact: { id: args.id },
		};
		const apiCall = args.checked
			? this.happeningService.addParticipant
			: this.happeningService.removeParticipant;
		apiCall(request).subscribe({
			next: () => {
				if (args.checked && !this.checkedContactIDs.includes(args.id)) {
					this.checkedContactIDs = [...this.checkedContactIDs, args.id];
				} else if (!args.checked && this.checkedContactIDs.includes(args.id)) {
					this.checkedContactIDs = this.checkedContactIDs.filter(
						(id) => id !== args.id,
					);
				}
				args.resolve();
			},
			error: args.reject,
		});
	}

	private readonly emitHappeningChange = () =>
		this.happeningChange.emit(this.happening);

	private populateParticipants(): void {
		if (!this.happening) {
			return;
		}
		const { brief, dbo } = this.happening;
		if (!brief || !dbo) {
			return;
		}
		let happeningBase: IHappeningBase = {
			...(dbo || brief),
		};
		this.checkedContactIDs.forEach((contactID) => {
			happeningBase = {
				...happeningBase,
				related: addRelatedItem(
					happeningBase.related,
					'contactus',
					'contacts',
					this.space?.id || '',
					contactID,
				),
			};
		});
		this.happening = {
			...this.happening,
			brief: {
				...(this.happening.brief || {}),
				...happeningBase,
			},
			dbo: {
				// TODO: It does not make much sense to update DTO as brief should be enough?
				...(this.happening.dbo || {}),
				...happeningBase,
			},
		};
		this.emitHappeningChange();
	}

	addContact(): void {
		this.contacts.push(1);
	}
}
