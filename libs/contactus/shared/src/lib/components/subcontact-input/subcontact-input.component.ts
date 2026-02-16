import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  ContactRole,
  ContactType,
  IContactContext,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsSelectorService } from '../contacts-selector/contacts-selector.service';
import { IContactSelectorOptions } from '../contacts-selector/contacts-selector.interfaces';

@Component({
  selector: 'sneat-subcontact-input',
  templateUrl: './subcontact-input.component.html',
  imports: [IonItem, IonLabel, IonInput, IonButtons, IonButton, IonIcon],
})
export class SubcontactInputComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly contactSelectorService = inject(ContactsSelectorService);

  @Input() canReset = false;
  @Input() readonly = false;
  @Input({ required: true }) space?: ISpaceContext;
  @Input() label?: string;
  @Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
  @Input() role?: ContactRole;
  @Input() subLabel = 'by';
  @Input() subType?: ContactType;

  @Input() contact?: IContactContext;
  @Output() contactChange = new EventEmitter<IContactContext>();

  get labelText(): string {
    return (
      this.label ||
      (this.role && `${this.role[0].toUpperCase()}${this.role.substr(1)}`) ||
      'Contact'
    );
  }

  get contactLink(): string {
    return `/company/${this.space?.type}/${this.space?.id}/contact/${this.contact?.id}`;
  }

  reset(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.contact = undefined;
    this.contactChange.emit(undefined);
  }

  openContactSelector(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.space) {
      this.errorLogger.logError(
        'ContactInputComponent.openContactSelector(): team is required',
        undefined,
      );
      return;
    }
    const selectorOptions: IContactSelectorOptions = {
      componentProps: {
        space: this.space,
        contactRole: this.role,
      },
    };
    this.contactSelectorService
      .selectSingleInModal(selectorOptions)
      .then((contact) => {
        // 'ContactInputComponent.openContactSelector() contact:',
        // contact,
        if (contact) {
          this.contactChange.emit(contact);
        }
      })
      .catch(
        this.errorLogger.logErrorHandler('failed to open contact selector'),
      );
  }
}
