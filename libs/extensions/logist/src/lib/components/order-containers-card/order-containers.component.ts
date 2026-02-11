import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  ModalController,
  IonCard,
  IonCol,
  IonGrid,
  IonItemDivider,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderContainersGridComponent } from '../order-containers-grid/order-containers-grid.component';
import { OrderContainerComponent } from './order-container.component';

@Component({
  selector: 'sneat-order-containers-card',
  templateUrl: './order-containers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    OrderContainerComponent,
    IonItemDivider,
    IonLabel,
    OrderContainersGridComponent,
  ],
})
export class OrderContainersComponent implements OnChanges {
  private readonly modalController = inject(ModalController);

  @Input({ required: true }) space?: ISpaceContext;

  @Input() order?: ILogistOrderContext;
  @Output() orderChange = new EventEmitter<ILogistOrderContext>();

  protected selectedContainer?: IOrderContainer;

  containers?: readonly IOrderContainer[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      this.containers = this.order?.dbo?.containers || [];
      if (this.containers?.length) {
        const selectedContainer = this.selectedContainer;
        if (selectedContainer) {
          this.selectedContainer = this.containers?.find(
            (c) => c.id === selectedContainer.id,
          );
        }
        if (!selectedContainer) {
          this.selectedContainer = this.containers?.[0];
        }
      } else {
        this.selectedContainer = undefined;
      }
    }
  }

  // async openNewContainerForm() {
  // 	const modal = await this.modalController.create({
  // 		component: NewContainerComponent,
  // 		componentProps: {
  // 			order: this.order,
  // 			team: this.team,
  // 		}
  // 	});
  // 	await modal.present();
  // }

  onContainerSelected(container: IOrderContainer) {
    console.log('OrderContainersComponent.onContainerSelected():', container);
    this.selectedContainer = container;
  }

  indexOfContainer(container: IOrderContainer): number | undefined {
    return this.containers?.findIndex((c) => c.id === container.id);
  }
}
