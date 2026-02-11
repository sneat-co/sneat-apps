import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';
import {
  CommChannelsListComponent,
  importsForChannelsListComponent,
} from './comm-channels-list.component';
import { ClassName } from '@sneat/ui';

@Component({
  imports: importsForChannelsListComponent,
  providers: [
    {
      provide: ClassName,
      useValue: 'ContactPhonesComponent',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-contact-phones',
  templateUrl: 'comm-channels-list.component.html',
})
export class ContactPhonesComponent extends CommChannelsListComponent {
  public readonly $contact = input.required<IContactContext>();

  constructor() {
    super(
      'phone',
      'Phones',
      'Phone #',
      computed(() => this.$contact().dbo?.phones),
    );
  }
}
