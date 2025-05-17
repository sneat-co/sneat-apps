import {
	ChangeDetectorRef,
	Directive,
	EventEmitter,
	Inject,
	Injectable,
	input,
	Input,
	Output,
	signal,
} from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import {
	addSpace,
	IContactusSpaceDboAndID,
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { isoStringsToDate } from '@sneat/core';
import { getRelatedItemIDs } from '@sneat/dto';
import { IHappeningContext, WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { getWd2 } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { WithSpaceInput } from '@sneat/space-services';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { NEVER, Observable } from 'rxjs';
import {
	HappeningService,
	IHappeningContactRequest,
} from '../services/happening.service';

@Injectable()
export class HappeningBaseComponentParams {
	constructor(
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
		public readonly happeningService: HappeningService,
		public readonly spaceNavService: SpaceNavService,
		public readonly contactsSelectorService: ContactsSelectorService,
		public readonly modalController: ModalController,
		// public readonly happeningSlotModalService: HappeningSlotModalService,
	) {}
}

/* The meatadata should be passed to component declaration as:

	```
	@Component({
		selector: 'some-component',

		// Next 2 rows allow to inherit metadata
		providers: [...HappeningBaseComponent.providers],
		...BaseComponent.metadata
	})
	class SomeComponent extends BaseComponent
	```
 */
@Directive()
export abstract class HappeningBaseComponent extends WithSpaceInput {
	static providers = [HappeningBaseComponentParams];

	static metadata = {
		inputs: ['space', 'happening'],
		outputs: ['deleted'],
	};

	public readonly $happening = input.required<IHappeningContext>();

	public readonly $contactusSpace = input.required<
		IContactusSpaceDboAndID | undefined
	>();

	@Output() readonly deleted = new EventEmitter<string>();

	get date(): Date | undefined {
		const happeningDbo = this.$happening().dbo;
		if (!happeningDbo?.dates?.length) {
			return undefined;
		}
		return isoStringsToDate(happeningDbo.dates[0]);
	}

	get wd(): WeekdayCode2 | undefined {
		const date = this.date;
		return date && getWd2(date);
	}

	public deleting = false;

	get happeningService() {
		return this.happeningBaseComponentParams.happeningService;
	}

	get contactsSelectorService() {
		return this.happeningBaseComponentParams.contactsSelectorService;
	}

	protected constructor(
		className: string,
		private readonly happeningBaseComponentParams: HappeningBaseComponentParams,
		protected changeDetectorRef: ChangeDetectorRef,
	) {
		super(className);
	}

	protected goHappening(event: Event): void {
		event.stopPropagation();
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return;
		}
		console.log('goHappening()', happening, space);
		this.spaceNavService
			.navigateForwardToSpacePage(space, `happening/${happening.id}`, {
				state: { happening },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to happening page',
				),
			);
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	protected delete(event: Event): void {
		console.log('HappeningCardComponent.delete()');
		event.stopPropagation();
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return;
		}
		if (!happening) {
			this.errorLogger.logError(
				new Error(
					'Single happening card has no happening context at moment of delete attempt',
				),
			);
			return;
		}
		if (
			!confirm(`
DELETING: ${happening?.brief?.title}

Are you sure you want to delete this happening?

This operation can NOT be undone.`)
		) {
			return;
		}
		this.deleting = true;

		const happeningWithSpace: IHappeningContext = happening?.space
			? happening
			: {
					...happening,
					space: space || { id: '' },
				};

		this.happeningService
			.deleteHappening(happeningWithSpace)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: () => this.deleted.emit(),
				error: (e) => {
					this.errorLogger.logError(e, 'Failed to delete happening');
					this.deleting = false;
				},
			});
	}

	protected selectMembers(event: Event): void {
		event.stopPropagation();
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return;
		}
		const spaceID = space?.id;
		if (!spaceID) {
			return;
		}
		const spaceContacts: IContactWithBriefAndSpace[] | undefined =
			zipMapBriefsWithIDs(this.$contactusSpace()?.dbo?.contacts)?.map(
				addSpace(space),
			);

		this.contactsSelectorService
			.selectMultipleContacts({
				selectedItems:
					spaceContacts?.filter((m) =>
						getRelatedItemIDs(
							happening?.brief?.related,
							'contactus',
							'contacts',
							space.id,
						)?.includes(m.id),
					) || [],
				items: signal(spaceContacts), // TODO: provide proper observable
				onAdded: this.onContactAdded,
				onRemoved: this.onMemberRemoved,
			})
			.catch((err) => {
				this.errorLogger.logError(err, 'Failed to select members');
			});
	}

	private readonly onContactAdded = (
		contact: IContactWithBrief,
	): Observable<void> => {
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			spaceID: space.id,
			happeningID: happening.id,
			contact: { id: contact.id },
		};
		return this.happeningService.addParticipant(request);
	};

	protected spaceAndHappening(): [ISpaceContext, IHappeningContext] {
		const happening = this.$happening();
		if (!happening) {
			console.error(this.className + ': $happening is not set');
		}
		const space = this.$space();
		if (!space) {
			console.error(this.className + ': $space is not set');
		}
		return [space, happening];
	}

	private readonly onMemberRemoved = (
		member: IContactWithBrief,
	): Observable<void> => {
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			spaceID: space.id,
			happeningID: happening.id,
			contact: { id: member.id },
		};
		return this.happeningService.removeParticipant(request);
	};
}
