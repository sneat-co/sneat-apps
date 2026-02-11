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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ClassName,
      useValue: 'ContactEmailsComponent',
    },
  ],
  selector: 'sneat-contact-emails',
  templateUrl: 'comm-channels-list.component.html',
})
export class ContactEmailsComponent extends CommChannelsListComponent {
  public readonly $contact = input.required<IContactContext>();

  constructor() {
    super(
      'email',
      'Emails',
      'email@address',
      computed(() => this.$contact().dbo?.emails),
    );
  }
}
