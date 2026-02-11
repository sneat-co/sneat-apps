import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCheckbox,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
} from '@ionic/angular/standalone';
import { formNexInAnimation } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { ClassName } from '@sneat/ui';
import { SpaceRelatedFormComponent } from '../space-related-form.component';

interface Role {
  checked?: boolean;
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'sneat-roles-form',
  templateUrl: 'roles-form.component.html',
  animations: [formNexInAnimation],
  imports: [
    FormsModule,
    IonCard,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonItemGroup,
    IonCheckbox,
  ],
  providers: [{ provide: ClassName, useValue: 'RolesFormComponent' }],
})
export class RolesFormComponent extends SpaceRelatedFormComponent {
  @Input() isActive = false;
  @Input() disabled = false;
  roles?: Role[];

  @Output() readonly rolesChange = new EventEmitter<string[]>();

  protected override onSpaceTypeChanged(space?: ISpaceContext): void {
    super.onSpaceTypeChanged(space);
    switch (space?.type) {
      case 'educator':
        if (location.pathname.includes('staff')) {
          this.roles = [
            { id: 'teacher', title: 'Teacher', icon: 'person' },
            { id: 'administrator', title: 'Administrator', icon: 'robot' },
          ];
        }
        break;
      default:
        break;
    }
  }

  roleChecked(event: Event): void {
    event.stopPropagation();
    const roles = this.roles
      ?.filter((role) => role.checked)
      .map((role) => role.id);
    this.rolesChange.emit(roles);
  }
}
