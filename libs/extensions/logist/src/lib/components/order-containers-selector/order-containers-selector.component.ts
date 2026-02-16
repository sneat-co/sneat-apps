import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ILogistOrderContext } from '../../dto/order-dto';
import { IContainer } from './condainer-interface';
import { OrderContainerFormComponent } from './order-container-form.component';

@Component({
  selector: 'sneat-order-containers-selector',
  templateUrl: './order-containers-selector.component.html',
  imports: [OrderContainerFormComponent],
})
export class OrderContainersSelectorComponent implements OnChanges, OnInit {
  @Input({ required: true }) order?: ILogistOrderContext;
  @Input() container?: IContainer;
  @Input() disabled?: boolean;

  protected containers?: IContainer[];

  @Input() selectedContainerIDs: string[] = [];
  @Output() readonly selectedContainerIDsChange = new EventEmitter<string[]>();
  @Output() selectedContainersChange = new EventEmitter<IContainer[]>();

  protected hasUncheckedContainers(): boolean {
    return !!this.containers?.some((c) => !c.checked);
  }

  onToggled(container: IContainer): void {
    this.containers = this.containers?.map((c) =>
      c.id === container.id ? container : c,
    );
    const selectedContainers = this.containers?.filter((c) => c.checked) || [];
    this.selectedContainerIDs = selectedContainers.map((c) => c.id);
    this.selectedContainerIDsChange.emit(this.selectedContainerIDs);
    this.selectedContainersChange.emit(selectedContainers);
  }

  ngOnInit(): void {
    // Needed for modal dialog as ngOnChanges is not called for the first change
    this.setContainers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] || changes['container']) {
      // const previousOrder = orderChange.previousValue as ILogistOrderContext | undefined;
      this.setContainers();
    }
  }

  private setContainers(): void {
    if (this.container) {
      this.containers = [this.container];
      return;
    }
    this.containers = this.order?.dbo?.containers?.map((c) => ({
      id: c.id,
      type: c.type,
      number: c.number,
      checked: !!this.containers?.find((cc) => cc.id === c.id)?.checked,
    }));
  }
}
