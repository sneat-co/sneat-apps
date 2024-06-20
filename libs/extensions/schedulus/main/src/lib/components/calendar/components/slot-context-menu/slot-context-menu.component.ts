import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnInit,
	signal,
	SimpleChanges,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IContactBrief, IContactusTeamDtoAndID } from '@sneat/contactus-core';
import { excludeUndefined, IIdAndBrief } from '@sneat/core';
import { hasRelatedItemID } from '@sneat/dto';
import {
	HappeningUIState,
	IHappeningContext,
	HappeningStatus,
	IHappeningSlot,
	IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ISelectMembersOptions,
	MembersSelectorService,
} from '@sneat/contactus-shared';
import { contactContextFromBrief } from '@sneat/contactus-services';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import {
	HappeningService,
	ICancelHappeningRequest,
	IDeleteSlotRequest,
	IHappeningContactRequest,
	ISlotRefRequest,
	ISlotRequest,
} from '@sneat/team-services';
import { NEVER, Observable } from 'rxjs';
import { HappeningSlotModalService } from '../../../happening-slot-form/happening-slot-modal.service';

const notImplemented = 'Sorry, not implemented yet';

@Component({
	selector: 'sneat-slot-context-menu',
	templateUrl: 'slot-context-menu.component.html',
})
export class SlotContextMenuComponent {
	@Input() team: ITeamContext = { id: '' };
	@Input() contactusTeam?: IContactusTeamDtoAndID;

	@Input() dateID?: string;
	@Input() public slotContext?: ISlotUIContext;

	protected readonly happening = signal<IHappeningContext | undefined>(
		undefined,
	);

	protected happeningState?: HappeningUIState;

	public get isCancelled(): boolean {
		return (
			this.slotContext?.happening.brief?.status === 'canceled' ||
			!!this.slotContext?.adjustment?.cancellation
		);
	}

	public get disabled(): boolean {
		return !!this.happeningState;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly happeningService: HappeningService,
		private readonly membersSelectorService: MembersSelectorService,
		private readonly happeningSlotModalService: HappeningSlotModalService,
	) {}

	assign(event: Event, to: 'member' | 'contact'): void {
		console.log(`SlotContextMenuComponent.assign(${to})`);
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (!team || !this.slotContext) {
			return;
		}
		const members =
			zipMapBriefsWithIDs(this.contactusTeam?.dbo?.contacts)?.map((mb) =>
				contactContextFromBrief(mb, team),
			) || [];
		const happening = this.slotContext.happening;
		const selectedMembers = members.filter((m) =>
			hasRelatedItemID(
				happening?.dbo?.related || happening?.brief?.related,
				'contactus',
				'contacts',
				this.team?.id || '',
				m.id,
			),
		);
		const options: ISelectMembersOptions = {
			members,
			selectedMembers,
			onAdded: this.onMemberAdded,
			onRemoved: this.onMemberRemoved,
		};
		this.popoverController.dismiss().catch(console.error);
		this.membersSelectorService
			.selectMembersInModal(options)
			.then((selectedMembers) => {
				console.log('selected members:', selectedMembers);
			});
	}

	move(): void {
		console.log(`SlotContextMenuComponent.move()`);
		this.notImplemented();
	}

	edit(event: Event): void {
		console.log(`SlotContextMenuComponent.edit()`);
		const happening = this.slotContext?.happening;
		if (!happening) {
			return;
		}
		if (!this.team) {
			return;
		}
		const recurring = this.dateID
			? {
					dateID: this.dateID,
					adjustment: this.slotContext?.adjustment,
				}
			: undefined;
		this.happeningSlotModalService
			.editSingleHappeningSlot(
				event,
				{ ...happening, team: this.team },
				recurring,
				this.slotContext?.slot,
			)
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed in editing single happening slot',
				),
			);
		this.dismissPopover();
	}

	delete(event: Event): void {
		console.log(`SlotContextMenuComponent.delete()`);
		const slot = this.slotContext;
		if (!slot) {
			return;
		}
		if (this.slotContext?.repeats === 'weekly' && !slot.wd) {
			throw new Error('this.slot?.repeats === "weekly" && !slot.wd');
		}
		const request = this.createDeleteSlotRequest(event);
		this.happeningState = 'deleting';
		this.happeningService.deleteSlot(request).subscribe({
			next: () => {
				this.happeningState = 'deleted';
				this.dismissPopover();
			},
			error: (err) => {
				setTimeout(() => {
					this.happeningState = undefined;
					this.errorLogger.logError(
						err,
						'Failed to delete happening from context menu',
					);
				}, 2000);
			},
		});
	}

	private dismissPopover(): void {
		this.popoverController.dismiss().catch(
			this.errorLogger.logErrorHandler('Failed to dismiss popover', {
				show: false,
				feedback: false,
			}),
		);
	}

	archive(): void {
		console.log(`SlotContextMenuComponent.archive()`);
		this.notImplemented();
	}

	private stopEvent(event: Event): {
		slotContext: ISlotUIContext;
		happening: IHappeningContext;
		team: ITeamContext;
	} {
		if (!this.team) {
			throw new Error('!this.team');
		}
		if (!this.slotContext) {
			throw new Error('!this.slot');
		}
		event.stopPropagation();
		event.preventDefault();
		return {
			team: this.team,
			slotContext: this.slotContext,
			happening: this.slotContext.happening,
		};
	}

	private createSlotRefRequest(event: Event): ISlotRefRequest {
		const { slotContext, team, happening } = this.stopEvent(event);
		return {
			teamID: team.id,
			happeningID: happening.id,
			slotID: slotContext.slot.id,
		};
	}

	private createSlotRequest(
		event: Event,
		mode: 'whole' | 'slot',
	): ISlotRequest {
		const { slotContext, team, happening } = this.stopEvent(event);
		// const slotsCount = happening.brief?.slots?.length || happening.dto?.slots?.length || 0;
		const request: ISlotRequest = excludeUndefined({
			teamID: team.id,
			happeningID: happening.id,
			slotID: mode === 'slot' ? slotContext.slot.id : undefined,
			weekday: mode === 'slot' ? slotContext.wd : undefined,
			date:
				mode === 'slot' && happening.brief?.type === 'recurring'
					? this.dateID
					: undefined,
		});
		return request;
	}

	private createDeleteSlotRequest(event: Event): IDeleteSlotRequest {
		return this.createSlotRefRequest(event);
	}

	createCancellationRequest(
		event: Event,
		mode: 'whole' | 'slot',
	): ICancelHappeningRequest {
		return this.createSlotRequest(event, mode);
	}

	private setHappeningStatus(status: HappeningStatus): void {
		if (!this.slotContext) {
			return;
		}
		let happening = this.slotContext.happening;
		if (happening.brief) {
			happening = {
				...happening,
				brief: { ...happening.brief, status },
			};
		}
		if (happening.dbo) {
			happening = {
				...happening,
				dbo: { ...happening.dbo, status },
			};
		}
		this.slotContext = {
			...this.slotContext,
			happening,
		};
	}

	revokeCancellation(event: Event): void {
		console.log(`SlotContextMenuComponent.revokeCancellation()`);
		this.happeningState = 'revoking-cancellation';
		if (!this.slotContext) {
			return;
		}
		const mode: 'whole' | 'slot' =
			this.slotContext.happening.brief?.status === 'canceled'
				? 'whole'
				: 'slot';
		const request = this.createCancellationRequest(event, mode);
		this.happeningService.revokeHappeningCancellation(request).subscribe({
			next: () => {
				this.happeningState = undefined;
				this.setHappeningStatus('active');
				this.dismissPopover();
			},
			error: (err) => {
				setTimeout(() => {
					this.happeningState = undefined;
					this.errorLogger.logError(
						err,
						'Failed to delete happening from context menu',
					);
				}, 2000);
			},
		});
	}

	markCanceled(event: Event, mode: 'whole' | 'slot'): void {
		console.log(`SlotContextMenuComponent.markCanceled(mode=${mode})`);
		this.happeningState =
			mode == 'slot' ? 'cancelling-single' : 'cancelling-series';
		const request = this.createCancellationRequest(event, mode);
		this.happeningService.cancelHappening(request).subscribe({
			next: () => {
				this.happeningState = 'canceled';
				this.setHappeningStatus('canceled');
				this.dismissPopover();
			},
			error: (err) => {
				setTimeout(() => {
					this.happeningState = undefined;
					this.errorLogger.logError(
						err,
						'Failed to delete happening from context menu',
					);
				}, 2000);
			},
		});
	}

	notImplemented(): void {
		this.dismissPopover();
		setTimeout(() => alert(notImplemented), 100);
	}

	numberOfSlots(happening?: IHappeningContext): number {
		let n = 0;
		if (!happening) {
			return n;
		}
		const brief = happening?.brief;
		if (!brief) {
			return n;
		}
		const slots = brief.slots;
		if (!slots) {
			return n;
		}
		Object.values(slots).forEach((slot) => {
			slot.weekdays?.forEach(() => n++);
		});
		return n;
	}

	private readonly onMemberAdded = (
		member: IIdAndBrief<IContactBrief>,
	): Observable<void> => {
		console.log('SlotContextMenuComponent.onMemberAdded()', member);
		if (!this.slotContext) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		const happeningID = this.slotContext.happening.id;
		if (!happeningID) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID,
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
		console.log('SlotContextMenuComponent.onMemberRemoved()', member);
		if (!this.slotContext || !this.team) {
			return NEVER;
		}
		const request: IHappeningContactRequest = {
			teamID: this.team.id,
			happeningID: this.slotContext.happening.id,
			contact: { id: member.id },
		};
		return this.happeningService.removeParticipant(request);
	};
}
