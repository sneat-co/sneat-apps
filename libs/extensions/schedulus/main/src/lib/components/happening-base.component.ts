import {
	ChangeDetectorRef,
	Directive,
	EventEmitter,
	Inject,
	Injectable,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IContactBrief, IContactusTeamDtoAndID } from '@sneat/contactus-core';
import { IIdAndBrief, isoStringsToDate } from '@sneat/core';
import { IHappeningContext, WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { MembersSelectorService } from '@sneat/contactus-shared';
import { getWd2 } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { contactContextFromBrief } from '@sneat/contactus-services';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { IHappeningContactRequest, TeamNavService } from '@sneat/team-services';
import { NEVER, Observable, takeUntil } from 'rxjs';
import { HappeningService } from '@sneat/team-services';
import { ScheduleModalsService } from '../services/schedule-modals.service';

@Injectable()
export class HappeningBaseComponentParams {
	constructor(
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
		public readonly happeningService: HappeningService,
		public readonly teamNavService: TeamNavService,
		public readonly membersSelectorService: MembersSelectorService,
		public readonly modalController: ModalController,
		public readonly scheduleModalsService: ScheduleModalsService,
	) {}
}

@Directive()
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
export abstract class HappeningBaseComponent implements OnChanges, OnDestroy {
	static providers = [HappeningBaseComponentParams];

	static metadata = {
		inputs: ['team', 'happening'],
		outputs: ['deleted'],
	};

	protected readonly destroyed = new EventEmitter<void>();

	@Input() team: ITeamContext = { id: '' };
	@Input() contactusTeam?: IContactusTeamDtoAndID;
	@Input() happening?: IHappeningContext;

	@Output() readonly deleted = new EventEmitter<string>();

	get date(): Date | undefined {
		if (!this.happening?.dto?.dates?.length) {
			return undefined;
		}
		return isoStringsToDate(this.happening.dto.dates[0]);
	}

	get wd(): WeekdayCode2 | undefined {
		const date = this.date;
		return date && getWd2(date);
	}

	public deleting = false;

	protected readonly id = (_: number, o: { id: string }) => o.id;
	protected readonly index = (i: number): number => i;

	get errorLogger() {
		return this.happeningBaseComponentParams.errorLogger;
	}

	get happeningService() {
		return this.happeningBaseComponentParams.happeningService;
	}

	get membersSelectorService() {
		return this.happeningBaseComponentParams.membersSelectorService;
	}

	get teamNavService() {
		return this.happeningBaseComponentParams.teamNavService;
	}

	protected constructor(
		private readonly happeningBaseComponentParams: HappeningBaseComponentParams,
		protected changeDetectorRef: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	public notImplemented(): void {
		alert('Sorry, not implemented yet.');
	}

	goHappening(event: Event): void {
		event.stopPropagation();
		if (!this.team) {
			this.errorLogger.logErrorHandler(
				'not able to navigate to happening without team context',
			);
			return;
		}
		console.log('goHappening()', this.happening, this.team);
		this.teamNavService
			.navigateForwardToTeamPage(this.team, `happening/${this.happening?.id}`, {
				state: { happening: this.happening },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to happening page',
				),
			);
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	delete(event: Event): void {
		console.log('HappeningCardComponent.delete()');
		event.stopPropagation();
		if (!this.happening) {
			this.errorLogger.logError(
				new Error(
					'Single happening card has no happening context at moment of delete attempt',
				),
			);
			return;
		}
		if (
			!confirm(`
DELETING: ${this.happening?.brief?.title}

Are you sure you want to delete this happening?

This operation can NOT be undone.`)
		) {
			return;
		}
		this.deleting = true;

		const happening: IHappeningContext = this.happening.team
			? this.happening
			: {
					...this.happening,
					team: this.team || { id: '' },
			  };

		this.happeningService
			.deleteHappening(happening)
			.pipe(takeUntil(this.destroyed))
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
		const team = this.team;
		if (!team) {
			return;
		}
		const teamID = team?.id;
		if (!teamID) {
			return;
		}
		const teamMembers: IIdAndBrief<IContactBrief>[] | undefined =
			zipMapBriefsWithIDs(this.contactusTeam?.dto?.contacts)?.map((m) =>
				contactContextFromBrief(m, team),
			);

		this.membersSelectorService
			.selectMembersInModal({
				selectedMembers:
					teamMembers?.filter(
						(m) =>
							Object.keys(this.happening?.brief?.participants || [])?.some(
								(id) => id === m.id,
							),
					) || [],
				members: teamMembers,
				onAdded: this.onMemberAdded,
				onRemoved: this.onMemberRemoved,
			})
			.catch((err) => {
				this.errorLogger.logError(err, 'Failed to select members');
			});
	}

	private readonly onMemberAdded = (
		member: IIdAndBrief<IContactBrief>,
	): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID: this.happening.id,
			contact: { id: member.id },
		};
		return this.happeningService.addParticipant(request);
		// result
		// 	.pipe(takeUntil(this.destroyed))
		// 	.subscribe({
		// 		next: () => {
		// 			this.changeDetectorRef.markForCheck();
		// 		},
		// 	});
	};

	private readonly onMemberRemoved = (
		member: IIdAndBrief<IContactBrief>,
	): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID: this.happening.id,
			contact: { id: member.id },
		};
		return this.happeningService.removeParticipant(request);
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log(
			'HappeningCardComponent.ngOnChanges()',
			this.happening?.id,
			changes,
		);
	}

	protected removeMember(member: IIdAndBrief<IContactBrief>): void {
		console.log('removeMember', member);
		if (!this.happening) {
			return;
		}
		if (!this.team) {
			return;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID: this.happening.id,
			contact: { id: member.id },
		};
		this.happeningService.removeParticipant(request).subscribe({
			next: () => {
				if (this.happening?.brief?.contactIDs) {
					this.happening = {
						...this.happening,
						brief: {
							...this.happening.brief,
							contactIDs: this.happening.brief.contactIDs.filter(
								(id) => id !== member.id,
							),
						},
					};
				}
				if (this.happening?.dto?.contactIDs) {
					this.happening = {
						...this.happening,
						dto: {
							...this.happening.dto,
							contactIDs: this.happening.dto.contactIDs.filter(
								(id) => id !== member.id,
							),
						},
					};
				}
				this.changeDetectorRef.markForCheck();
			},
			error: this.errorLogger.logErrorHandler(
				'Failed to remove member from happening',
			),
		});
	}
}

@Directive()
export class HappeningComponent extends HappeningBaseComponent {
	constructor(
		happeningBaseComponentParams: HappeningBaseComponentParams,
		changeDetectorRef: ChangeDetectorRef,
	) {
		super(happeningBaseComponentParams, changeDetectorRef);
	}
}
