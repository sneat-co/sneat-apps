import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PopoverController,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto';

@Component({
  selector: 'sneat-logist-order-print-menu',
  templateUrl: './order-print-menu.component.html',
  imports: [IonItemDivider, IonIcon, IonLabel, IonItem, RouterLink],
})
export class OrderPrintMenuComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly popoverController = inject(PopoverController);

  @Input({ required: true }) space?: ISpaceContext;
  @Input() order?: ILogistOrderContext;

  print(event: Event, path: string): void {
    // TODO: can we dismiss popover declaratively?
    event.stopPropagation();
    this.popoverController
      .dismiss()
      .catch(
        this.errorLogger.logErrorHandler(
          'Failed to dismiss popover controller',
        ),
      );
  }
}
