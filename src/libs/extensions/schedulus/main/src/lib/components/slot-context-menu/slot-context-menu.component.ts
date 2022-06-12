import { Component, Inject, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { HappeningStatus } from '@sneat/dto';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISelectMembersOptions, MembersSelectorService } from '@sneat/team/components';
import { HappeningUIState, IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { HappeningService, ICancelHappeningRequest, memberContextFromBrief } from '@sneat/team/services';
import { NEVER, Observable } from 'rxjs';

const notImplemented = 'Sorry, not implemented yet';

@Component({
	selector: 'sneat-slot-context-menu',
	templateUrl: 'slot-context-menu.component.html',
})
export class SlotContextMenuComponent {
	@Input() team?: ITeamContext;
	@Input() public slot?: ISlotItem;
	happeningState?: HappeningUIState;

	public get happening(): IHappeningContext | undefined {
		return this.slot?.happening;
	}

	public get isCancelled(): boolean {
		return this.happening?.brief?.status === 'canceled';
	}

	public get disabled(): boolean {
		return !!this.happeningState;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly happeningService: HappeningService,
		private readonly membersSelectorService: MembersSelectorService,
	) {
	}

	assign(event: Event, to: 'member' | 'contact'): void {
		console.log(`SlotContextMenuComponent.assign(${to})`);
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (!team) {
			return;
		}
		const members = this.team?.dto?.members?.map(mb => memberContextFromBrief(mb, team)) || [];
		const selectedMembers = members.filter(m => this.happening?.brief?.memberIDs?.some(id => id === m.id));
		const options: ISelectMembersOptions = {
			members,
			selectedMembers,
			onAdded: this.onMemberAdded,
			onRemoved: this.onMemberRemoved,
		};
		this.popoverController.dismiss().catch(console.error);
		this.membersSelectorService.selectMembersInModal(options)
			.then(selectedMembers => {
				console.log('selected members:', selectedMembers);
			});
	}

	move(): void {
		console.log(`SlotContextMenuComponent.edit()`);
		this.notImplemented();
	}

	edit(): void {
		console.log(`SlotContextMenuComponent.edit()`);
		this.notImplemented();
	}

	delete(event: Event): void {
		console.log(`SlotContextMenuComponent.delete()`);
		const { happening } = this.stopEvent(event);
		this.happeningState = 'deleting';
		this.happeningService.deleteHappening(happening)
			.subscribe({
				next: () => {
					this.happeningState = 'deleted';
					this.dismissPopover();
				},
				error: err => {
					setTimeout(() => {
						this.happeningState = undefined;
						this.errorLogger.logError(err, 'Failed to delete happening from context menu');
					}, 2000);
				},
			});
	}

	private dismissPopover(): void {
		this.popoverController.dismiss().catch(this.errorLogger.logErrorHandler('Failed to dismiss popover', {
			show: false,
			feedback: false,
		}));
	}

	archive(): void {
		console.log(`SlotContextMenuComponent.archive()`);
		this.notImplemented();
	}

	private stopEvent(event: Event): { slot: ISlotItem, happening: IHappeningContext; team: ITeamContext } {
		if (!this.team) {
			throw new Error('!this.team');
		}
		if (!this.happening) {
			throw new Error('!this.happening');
		}
		if (!this.slot) {
			throw new Error('!this.slot');
		}
		event.stopPropagation();
		event.preventDefault();
		return { team: this.team, slot: this.slot, happening: this.slot.happening };
	}

	createCancellationRequest(event: Event): ICancelHappeningRequest {
		const { slot, team, happening } = this.stopEvent(event);
		const slotsCount = happening.brief?.slots?.length || happening.dto?.slots?.length || 0;
		return {
			teamID: team.id,
			happeningID: happening.id,
			slotIDs: slotsCount > 1 ? [slot.slotID] : undefined,
			// date: '2022-06-12',
		};
	}

	private setHappeningStatus(status: HappeningStatus): void {
		if (!this.slot) {
			return;
		}
		let happening = this.slot.happening;
		if (happening.brief) {
			happening = {
				...happening,
				brief: { ...happening.brief, status },
			};
		}
		if (happening.dto) {
			happening = {
				...happening,
				dto: { ...happening.dto, status },
			};
		}
		this.slot = {
			...this.slot,
			happening,
		};
	}

	revokeCancellation(event: Event): void {
		console.log(`SlotContextMenuComponent.revokeCancellation()`);
		this.happeningState = 'canceling';
		const request = this.createCancellationRequest(event);
		this.happeningService.revokeHappeningCancellation(request)
			.subscribe({
				next: () => {
					this.happeningState = undefined;
					this.setHappeningStatus('active');
					this.dismissPopover();
				},
				error: err => {
					setTimeout(() => {
						this.happeningState = undefined;
						this.errorLogger.logError(err, 'Failed to delete happening from context menu');
					}, 2000);
				},
			});
	}

	markCanceled(event: Event): void {
		console.log(`SlotContextMenuComponent.markCanceled()`);
		const request = this.createCancellationRequest(event);
		this.happeningService.cancelHappening(request)
			.subscribe({
				next: () => {
					this.happeningState = 'canceled';
					this.setHappeningStatus('canceled');
					this.dismissPopover();
				},
				error: err => {
					setTimeout(() => {
						this.happeningState = undefined;
						this.errorLogger.logError(err, 'Failed to delete happening from context menu');
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
		slots.forEach(slot => {
			slot.weekdays?.forEach(() => n++);
		});
		return n;
	}

	private readonly onMemberAdded = (member: IMemberContext): Observable<void> => {
		console.log('SlotContextMenuComponent.onMemberAdded()', member);
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		const result = this.happeningService.addMember(this.team.id, this.happening, member.id);
		// result
		// 	.pipe(takeUntil(this.destroyed))
		// 	.subscribe({
		// 		next: () => {
		// 			this.changeDetectorRef.markForCheck();
		// 		},
		// 	});
		return result;
	};

	private readonly onMemberRemoved = (member: IMemberContext): Observable<void> => {
		console.log('SlotContextMenuComponent.onMemberRemoved()', member);
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		return this.happeningService.removeMember(this.team?.id, this.happening, member.id);
	};

}
