import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonCard,
  IonCheckbox,
  IonItem,
  IonItemDivider,
  IonLabel,
} from '@ionic/angular/standalone';
import { LogistSpaceRole, LogistSpaceRoles } from '../../dto';

@Component({
  selector: 'sneat-logist-space-roles',
  templateUrl: 'logist-space-roles.component.html',
  imports: [IonCard, IonItemDivider, IonLabel, IonItem, IonCheckbox],
})
export class LogistSpaceRolesComponent {
  protected readonly roles: {
    readonly id: LogistSpaceRole;
    readonly title: string;
  }[] = Object.entries(LogistSpaceRoles)
    .toSorted((a, b) => (a[1] > b[1] ? 1 : -1))
    .map((role) => ({ id: role[0] as LogistSpaceRole, title: role[1] }));

  @Input() selectedRoles: readonly string[] = [];
  @Output() selectedRolesChange = new EventEmitter<readonly string[]>();

  protected onRoleChanged(event: Event): void {
    console.log('onRoleChanged', event);
    const ce: CustomEvent = event as CustomEvent;
    const role = ce.detail.value as LogistSpaceRole;
    if (ce.detail.checked) {
      this.selectedRoles = [...this.selectedRoles, role];
    } else {
      this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    }
    this.selectedRolesChange.emit(this.selectedRoles);
  }
}
