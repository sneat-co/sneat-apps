import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { CounterpartyRole, ILogistOrderContext, IOrderCounterparty } from '../../dto';

@Component({
	selector: 'sneat-order-agents',
	templateUrl: './order-agents.component.html',
})
export class OrderAgentsComponent implements OnChanges {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;

	@Output() added = new EventEmitter<IOrderCounterparty[]>();

	protected counterparties?: IOrderCounterparty[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.counterparties = this.order?.dto?.counterparties?.filter(c => c.role.endsWith('_agent'));
		}
	}

	protected selectRole(event: Event): void {
		this.popoverController.create({
			event: event,
			component: AgentRoleMenuComponent,
			componentProps: {
				team: this.team,
				order: this.order,
				selected: (counterparty: IOrderCounterparty) => {
					this.added.emit([counterparty]);
				},
			},
		}).then(popover => popover.present()).catch(this.errorLogger.logErrorHandler('Failed to open menu popover'));

	}
}

@Component({
	selector: 'sneat-order-agent-role-menu',
	template: `
		<ion-item-divider color="light">
			<ion-label>Select role</ion-label>
			<ion-buttons slot="end">
				<ion-button (click)="popoverController.dismiss()" color="medium">
					<ion-icon name="close"></ion-icon>
				</ion-button>
			</ion-buttons>
		</ion-item-divider>
		<ion-item button (click)="openContactSelector($event, 'dispatch_agent')">
			<ion-label>Dispatch freight agent</ion-label>
		</ion-item>
		<ion-item button (click)="openContactSelector($event, 'receive_agent')">
			<ion-label>Receive freight agent</ion-label>
		</ion-item>
	`,
})
export class AgentRoleMenuComponent {
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	@Input() selected?: (counterparty: IOrderCounterparty) => void;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly popoverController: PopoverController,
		private readonly contactSelectorService: ContactSelectorService,
	) {
	}

	protected openContactSelector(event: Event, role: CounterpartyRole): void {
		if (!this.team) {
			this.errorLogger.logError('OrderAgentsComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				team: this.team,
				contactType: 'company',
				contactRole: role,
			},
		};
		this.popoverController.dismiss().catch(this.errorLogger.logErrorHandler('Failed to dismiss popover'));
		this.contactSelectorService.selectSingleContactInModal(selectorOptions)
			.then(contact => {
				console.log('OrderAgentsComponent.openContactSelector() contact:', contact);
				const contactBrief = contact?.brief;
				if (!contactBrief) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					role,
					contactID: contact.id,
					title: contactBrief.title,
					address: contactBrief.address,
					countryID: contactBrief.countryID || '--',
				};
				if (!this.selected) {
					throw new Error('OrderAgentsComponent.openContactSelector(): selected callback is required')
				}
				this.selected(counterparty);
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

}
