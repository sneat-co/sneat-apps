import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DeleteOperationState } from '@sneat/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamContext, HappeningUIState } from '@sneat/team/models';
import { HappeningService, ICancelHappeningRequest } from '@sneat/team/services';
import { delay } from 'rxjs';

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

	public get disabled(): boolean {
		return !!this.happeningState;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly happeningService: HappeningService,
	) {
	}

	assign(to: 'member' | 'contact'): void {
		console.log(`SlotContextMenuComponent.assign(${to})`);
		this.notImplemented();
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
		this.stopEvent(event);
		if (!this.happening) {
			return;
		}
		this.happeningState = 'deleting';
		this.happeningService.deleteHappening(this.happening)
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

	private stopEvent(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
	}

	markCanceled(event: Event): void {
		console.log(`SlotContextMenuComponent.markCanceled()`);
		this.stopEvent(event);
		const team = this.team;
		if (!team) {
			return;
		}
		const happening = this.happening;
		if (!happening) {
			return;
		}
		this.happeningState = 'canceling';
		const request: ICancelHappeningRequest = {
			teamID: team.id,
			happeningID: happening.id,
			// date: '2022-06-12',
		};
		this.happeningService.cancelHappening(request)
			.subscribe({
				next: () => {
					this.happeningState = 'canceled';
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
}
