import { Component, Input, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ILogistOrderContext } from '../../dto';
import { IContainer } from './condainer-interface';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

@Component({
  selector: 'sneat-order-containers-selector-dialog',
  templateUrl: './order-containers-selector-dialog.component.html',
  imports: [
    IonHeader,
    DialogHeaderComponent,
    IonContent,
    OrderContainersSelectorComponent,
    IonButton,
    IonLabel,
  ],
})
export class OrderContainersSelectorDialogComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  @Input() title = 'Select containers';
  @Input() order?: ILogistOrderContext;
  @Input() onSelected?: (items: IContainer[] | null) => void;

  private selectedContainers: IContainer[] = [];

  onSelectedContainersChanged(selectedContainers: IContainer[]): void {
    this.selectedContainers = selectedContainers;
  }

  submit(): void {
    this.onSelected?.(this.selectedContainers);
  }
}
