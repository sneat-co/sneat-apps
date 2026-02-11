import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonRow,
} from '@ionic/angular/standalone';
import {
  ContactRole,
  ContactType,
  IContactContext,
} from '@sneat/contactus-core';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { ILogistOrderContext } from '../../dto';

@Component({
  selector: 'sneat-contact-with-ref-num',
  templateUrl: './contact-with-ref-num.component.html',
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    ContactInputComponent,
    IonItem,
    IonInput,
    FormsModule,
  ],
})
export class ContactWithRefNumComponent {
  @Input() readonly = false;
  @Input() contactColSize = 8;
  @Input() order?: ILogistOrderContext;
  @Input() contactType?: ContactType;
  @Input() contactRole?: ContactRole;

  @Input() contact?: IContactContext;
  @Output() readonly contactChange = new EventEmitter<
    undefined | IContactContext
  >();

  @Input() refNumber = '';
  @Output() readonly refNumberChange = new EventEmitter<string>();

  get refNumberColSize(): number {
    return 12 - this.contactColSize;
  }

  protected onRefNumberChange(): void {
    this.refNumberChange.emit(this.refNumber);
  }

  protected onContactChanged(contact?: IContactContext): void {
    this.contactChange.emit(contact);
  }
}
