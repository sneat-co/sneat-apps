import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  input,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import {
  ContactCommChannelType,
  IContactCommChannelProps,
} from '@sneat/contactus-core';
import {
  ContactService,
  IContactCommChannelRequest,
  IUpdateContactCommChannelRequest,
} from '@sneat/contactus-services';
import { ClassName, SneatBaseComponent } from '@sneat/ui';

export interface ICommChannelListItem extends IContactCommChannelProps {
  readonly id: string;
}

@Component({
  imports: [
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    IonLabel,
  ],
  providers: [
    {
      provide: ClassName,
      useValue: 'CommChannelItemComponent',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-comm-channel-item',
  templateUrl: 'comm-channel-item.component.html',
})
export class CommChannelItemComponent extends SneatBaseComponent {
  public readonly $channelType = input.required<ContactCommChannelType>();
  public $channel = input.required<ICommChannelListItem>();
  public $contactID = input.required<string>();
  public $spaceID = input.required<string>();

  protected readonly channelID = new FormControl();
  public readonly $lines = input.required<'none' | 'full' | undefined>();
  protected readonly $saving = signal(false);

  protected readonly contactService = inject(ContactService);

  constructor() {
    super();
    effect(() => {
      const channel = this.$channel();
      if (!this.channelID.dirty) {
        this.channelID.setValue(channel.id);
      }
    });
  }

  protected deleteChannel(event: Event): void {
    console.log('deleteChannel', event);
    const channelID = this.$channel().id;
    if (!channelID) {
      throw new Error('Unable to delete channel without ID');
    }
    if (!confirm(`Are you sure you want to delete ${channelID}?`)) {
      return;
    }
    this.$saving.set(true);
    const request: IContactCommChannelRequest = {
      spaceID: this.$spaceID(),
      contactID: this.$contactID(),
      channelType: this.$channelType(),
      channelID,
    };
    this.contactService
      .deleteContactCommChannel(request)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: () => this.$saving.set(false),
        error: (err) => {
          this.$saving.set(false);
          this.errorLogger.logError(
            err,
            'Failed to delete contact ' + this.$channelType(),
          );
        },
      });
  }

  protected saveChanges(event: Event): void {
    console.log('saveChanges', event);
    const channelID = (this.channelID.value || '').trim();
    if (!channelID) {
      this.channelID.markAsTouched();
      this.channelID.setErrors({ required: true });
      return;
    }
    this.$saving.set(true);
    const request: IUpdateContactCommChannelRequest = {
      spaceID: this.$spaceID(),
      contactID: this.$contactID(),
      channelID: this.$channel().id,
      channelType: this.$channelType(),
      newChannelID: channelID,
    };
    this.contactService
      .updateContactCommChannel(request)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: () => this.$saving.set(false),
        error: (err) => {
          this.errorLogger.logError(
            err,
            'Failed to update contact' + this.$channelType(),
          );
        },
      });
  }

  protected onTypeChanged(event: CustomEvent): void {
    console.log('onTypeChanged', event);
    const type = event.detail.value as 'private' | 'work';
    this.$saving.set(true);
    const request: IUpdateContactCommChannelRequest = {
      spaceID: this.$spaceID(),
      contactID: this.$contactID(),
      channelID: this.$channel().id,
      channelType: this.$channelType(),
      type,
    };
    this.contactService
      .updateContactCommChannel(request)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: () => this.$saving.set(false),
        error: (err) => {
          this.$saving.set(false);
          this.errorLogger.logError(
            err,
            'Failed to update type of contact ' + this.$channelType(),
          );
        },
      });
  }
}
