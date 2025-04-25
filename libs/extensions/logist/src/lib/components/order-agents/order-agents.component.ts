import { NgForOf, TitleCasePipe } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
} from '@ionic/angular/standalone';
import {
	ContactsSelectorService,
	IContactSelectorOptions,
} from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	CounterpartyRole,
	ILogistOrderContext,
	IOrderCounterparty,
} from '../../dto';
import { OrderCounterpartyComponent } from '../order-counterparty/order-counterparty.component';

@Component({
	selector: 'sneat-order-agents',
	templateUrl: './order-agents.component.html',
	imports: [
		IonItemGroup,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		NgForOf,
		OrderCounterpartyComponent,
		TitleCasePipe,
	],
})
export class OrderAgentsComponent implements OnChanges {
	@Input() public readonly = false;
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;

	@Output() added = new EventEmitter<IOrderCounterparty[]>();

	protected counterparties?: IOrderCounterparty[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.counterparties = this.order?.dbo?.counterparties?.filter((c) =>
				c.role.endsWith('_agent'),
			);
		}
	}

	protected selectRole(event: Event): void {
		this.popoverController
			.create({
				event: event,
				component: AgentRoleMenuComponent,
				componentProps: {
					space: this.space,
					order: this.order,
					selected: (counterparty: IOrderCounterparty) => {
						this.added.emit([counterparty]);
					},
				},
			})
			.then((popover) => popover.present())
			.catch(this.errorLogger.logErrorHandler('Failed to open menu popover'));
	}
}

@Component({
	selector: 'sneat-order-agent-role-menu',
	template: `
		<ion-item-divider color="light">
			<ion-label>Select role</ion-label>
			<ion-buttons slot="end">
				<ion-button (click)="popoverController.dismiss()" color="medium">
					<ion-icon name="close" />
				</ion-button>
			</ion-buttons>
		</ion-item-divider>
		<ion-item tappable (click)="openContactSelector($event, 'dispatch_agent')">
			<ion-label>Dispatch freight agent</ion-label>
		</ion-item>
		<ion-item tappable (click)="openContactSelector($event, 'receive_agent')">
			<ion-label>Receive freight agent</ion-label>
		</ion-item>
	`,
	imports: [IonItemDivider, IonLabel, IonButtons, IonButton, IonIcon, IonItem],
})
export class AgentRoleMenuComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
	@Input() selected?: (counterparty: IOrderCounterparty) => void;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly popoverController: PopoverController,
		private readonly contactSelectorService: ContactsSelectorService,
	) {}

	protected openContactSelector(event: Event, role: CounterpartyRole): void {
		if (!this.space) {
			this.errorLogger.logError(
				'OrderAgentsComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				space: this.space,
				contactType: 'company',
				contactRole: role,
			},
		};
		this.popoverController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss popover'));
		this.contactSelectorService
			.selectSingleInModal(selectorOptions)
			.then((contact) => {
				console.log(
					'OrderAgentsComponent.openContactSelector() contact:',
					contact,
				);
				const contactBrief = contact?.brief;
				if (!contactBrief) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					role,
					contactID: contact.id,
					title: contactBrief.title || contact?.id,
					address: contactBrief.address,
					countryID: contactBrief.countryID || '--',
				};
				if (!this.selected) {
					throw new Error(
						'OrderAgentsComponent.openContactSelector(): selected callback is required',
					);
				}
				this.selected(counterparty);
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}
}
