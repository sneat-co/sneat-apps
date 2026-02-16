import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { SelectFromListComponent } from '@sneat/ui';
import { AssetType, carMakes, IMake, IModel } from '@sneat/mod-assetus-core';

@Component({
  selector: 'sneat-make-model-card',
  templateUrl: './make-model-card.component.html',
  imports: [SelectFromListComponent, FormsModule, IonItem, IonInput],
})
export class MakeModelCardComponent {
  @Input() assetType?: AssetType;
  @Input() make?: string;
  @Input() model?: string;

  @Output() makeChange = new EventEmitter<string>();
  @Output() modelChange = new EventEmitter<string>();

  @ViewChild('modelSelector', { static: false })
  modelSelector?: SelectFromListComponent;

  public makes: IMake[] = Object.keys(carMakes).map((id) => ({
    id,
    title: id,
  }));
  public models: IModel[] = [
    { id: 'A4', title: 'A4' },
    { id: 'A6', title: 'A6' },
  ];

  protected isKnownMake(): boolean {
    return !!this.make && !!carMakes[this.make];
  }

  protected isKnownModel(): boolean {
    const model = this.model?.toLowerCase();
    return (
      !!model &&
      !!this.models?.length &&
      this.models.some((m) => m.id == model || m.title.toLowerCase() === model)
    );
  }

  protected onMakeChanged(event: Event): void {
    const make = this.make ? carMakes[this.make] : undefined;
    if (make) {
      this.models = make.models.map((v) => ({ id: v.id, title: v.id }));
    } else {
      this.models = [];
    }
    this.makeChange.emit(this.make);
    if (this.model) {
      this.model = '';
    }
    this.onModelChanged(event);
    this.modelSelector?.focus();
  }

  protected onModelChanged(event: Event): void {
    this.modelChange.emit(this.model);
  }
}
