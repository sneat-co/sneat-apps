import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { excludeZeroValues } from '@sneat/core';
import { ILogistOrderContext } from '../../dto';

@Component({
  selector: 'sneat-new-order-containers-form',
  templateUrl: './new-order-containers-form.component.html',
  imports: [
    IonCard,
    IonItemDivider,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    FormsModule,
  ],
})
export class NewOrderContainersFormComponent {
  @Input() order?: ILogistOrderContext;
  @Output() readonly numberOfContainersChange = new EventEmitter<
    Record<string, number>
  >();

  size20ft = 0;
  size20ftHighCube = 0;
  size40ft = 0;
  size40ftHighCube = 0;

  protected onSizeChanged(): void {
    const numberOfContainers = excludeZeroValues({
      '20ft': this.size20ft,
      '20ftHighCube': this.size20ftHighCube,
      '40ft': this.size40ft,
      '40ftHighCube': this.size40ftHighCube,
    });
    console.log(
      'NewOrderContainersFormComponent.onSizeChanged(): numberOfContainers:',
      numberOfContainers,
    );
    this.numberOfContainersChange.emit(numberOfContainers);
  }
}
