import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';
import { excludeUndefined } from '@sneat/core';
import { IContactContext } from '@sneat/contactus-core';
import { first, takeUntil } from 'rxjs';
import { ClassName, ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { SpaceBaseComponent } from '@sneat/space-components';
import { OrderAgentsComponent } from '../../components/order-agents/order-agents.component';
import { OrderCounterpartyComponent } from '../../components/order-counterparty/order-counterparty.component';
import {
  CounterpartyRole,
  IOrderCounterparty,
  OrderDirection,
} from '../../dto';
import {
  ICreateLogistOrderRequest,
  ILogistOrderContext,
} from '../../dto/order-dto';
import { LogistOrderService, LogistSpaceService } from '../../services';
import { NewOrderContainersFormComponent } from './new-order-containers-form.component';

@Component({
  selector: 'sneat-new-logist-order-page',
  templateUrl: 'new-logist-order-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    SelectFromListComponent,
    FormsModule,
    IonItemDivider,
    IonLabel,
    NewOrderContainersFormComponent,
    IonCardContent,
    IonButton,
    OrderCounterpartyComponent,
    OrderAgentsComponent,
  ],
  providers: [{ provide: ClassName, useValue: 'NewLogistOrderPageComponent' }],
})
export class NewLogistOrderPageComponent extends SpaceBaseComponent {
  private readonly freightOrdersService = inject(LogistOrderService);
  private readonly logistSpaceService = inject(LogistSpaceService);
  private readonly contactService = inject(ContactService);

  public order: ILogistOrderContext = {
    id: '',
    space: this.space || { id: '', type: 'company' },
    dbo: {
      status: 'draft',
      direction: 'export',
      createdAt: { seconds: 0, nanoseconds: 0 },
      createdBy: '',
      updatedAt: { seconds: 0, nanoseconds: 0 },
      updatedBy: '',
      // route: {
      // 	origin: { id: 'origin', countryID: '' },
      // 	destination: { id: 'destination', countryID: '' },
      // },
    },
  };

  protected direction?: OrderDirection;

  protected readonly directions: ISelectItem[] = [
    { id: 'export', title: 'Export' },
    { id: 'import', title: 'Import' },
    { id: 'internal', title: 'Internal' },
  ];

  private numberOfContainers: Record<string, number> = {};

  protected readonly = false;

  public constructor() {
    super();
  }

  get formIsValid(): boolean {
    return (
      !!this.order.dbo?.route?.origin?.countryID &&
      !!this.order.dbo?.route?.destination?.countryID
    );
  }

  protected override onSpaceIdChanged() {
    super.onSpaceIdChanged();
    if (!this.space?.id) {
      return;
    }
    this.logistSpaceService
      .watchLogistSpaceByID(this.space.id)
      .pipe(this.takeUntilDestroyed(), takeUntil(this.spaceIDChanged$))
      .subscribe({
        next: (logistTeam) => {
          if (logistTeam.dbo?.contactID) {
            this.loadSpaceContact(logistTeam.dbo.contactID);
          }
        },
        error: this.errorLogger.logErrorHandler(
          'failed to load logist module record',
        ),
      });
  }

  private loadSpaceContact(contactID: string): void {
    const space = this.space;
    if (!space) {
      throw new Error('No space context');
    }
    this.contactService
      .watchContactById(space, contactID)
      .pipe(first())
      .subscribe({
        next: this.processSpaceContact,
        error: this.errorLogger.logErrorHandler(
          'failed to load logist team default contact',
        ),
      });
  }

  private readonly processSpaceContact = (contact: IContactContext): void => {
    const contactDto = contact.dbo;
    if (!contactDto) {
      return;
    }
    const orderDto = this.order.dbo;
    if (!orderDto) {
      return;
    }

    contact.dbo.roles?.forEach((role) => {
      const orderCounterparty: IOrderCounterparty = {
        contactID: contact.id,
        title: contactDto.title || contact.id,
        countryID: contactDto.countryID || '',
        address: contactDto.address,
        role: role as CounterpartyRole,
      };
      this.order = {
        ...this.order,
        dbo: {
          ...orderDto,
          counterparties: [
            ...(orderDto.counterparties || []),
            orderCounterparty,
          ],
        },
      };
    });
  };

  onOrderChanged(order: ILogistOrderContext): void {
    this.order = order;
  }

  onNumberOfContainersChanged(v: Record<string, number>): void {
      'NewLogistOrderPageComponent.onNumberOfContainersChanged():',
      v,
    );
    this.numberOfContainers = v;
  }

  createOrder(): void {
    if (!this.space?.id) {
      throw new Error('no team context');
    }
    if (!this.order?.dbo) {
      throw new Error('!this.order?.dto');
    }
    if (!this.order?.dbo?.counterparties?.some((c) => c.role === 'buyer')) {
      alert('Buyer is required');
      return;
    }

    if (!Object.keys(this.numberOfContainers).length) {
      console.error('No containers', this.numberOfContainers);
      alert('No containers');
      return;
    }

    // if (!this.order?.dto?.counterparties?.some(c => c.role === 'dispatcher')) {
    // 	alert('At least 1 dispatcher is required');
    // 	return;
    // }
    // if (!this.order?.dto?.route?.origin?.countryID) {
    // 	alert('Origin country is required');
    // 	return;
    // }
    // if (!this.order?.dto?.route?.destination?.countryID) {
    // 	alert('Destination country is required');
    // 	return;
    // }
    if (!this.direction) {
      alert('Direction is required');
      return;
    }
    const request: ICreateLogistOrderRequest = excludeUndefined({
      spaceID: this.space.id,
      order: {
        ...this.order.dbo,
        direction: this.direction,
        route: undefined, //TODO: decide what to do //Object.keys(this.order?.dto?.route || {}).length ? this.order.dto.route : undefined,
      },
      numberOfContainers: Object.keys(this.numberOfContainers).length
        ? this.numberOfContainers
        : undefined,
    });

    this.freightOrdersService.createOrder(request).subscribe({
      next: (response) => {
        this.navController
          .navigateRoot(['..', 'order', response.order.id], {
            relativeTo: this.route,
          })
          .catch(
            this.errorLogger.logErrorHandler('failed to navigate to order'),
          );
      },
      error: this.errorLogger.logErrorHandler('failed to create new order'),
    });
  }

  cancel(): void {
    this.navController
      .pop()
      .catch(this.errorLogger.logErrorHandler('failed to cancel new order'));
  }

  protected onCounterpartiesAdded(counterparties: IOrderCounterparty[]): void {
      'NewLogistOrderPageComponent.onCounterpartiesAdded():',
      counterparties,
    );
    const orderDto = this.order.dbo;
    if (!orderDto) {
      return;
    }
    const orderCounterparties = orderDto.counterparties || [];
    counterparties = counterparties.filter(
      (c) =>
        !orderCounterparties?.some(
          (oc) => oc.contactID === c.contactID && oc.role === c.role,
        ),
    );
    this.order = {
      ...this.order,
      dbo: {
        ...orderDto,
        counterparties: [...orderCounterparties, ...counterparties],
      },
    };
      'NewLogistOrderPageComponent.onCounterpartiesAdded() =>',
      this.order,
    );
  }
}
