import { computed, signal, Signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  ContactCommChannelType,
  IContactCommChannelProps,
} from '@sneat/contactus-core';
import { SneatBaseComponent } from '@sneat/ui';
import { CommChannelFormComponent } from './comm-channel-form.component';
import {
  CommChannelItemComponent,
  ICommChannelListItem,
} from './comm-channel-item.component';

export const importsForChannelsListComponent = [
  IonItem,
  IonCard,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  CommChannelItemComponent,
  CommChannelFormComponent,
];

// @Directive({})
export abstract class CommChannelsListComponent extends SneatBaseComponent {
  protected $showAddForm = signal(false);

  protected readonly $channels: Signal<
    readonly ICommChannelListItem[] | undefined
  >;

  protected readonly $title = signal('');
  protected readonly $placeholder = signal('');

  protected constructor(
    protected readonly channelType: ContactCommChannelType,
    title: string,
    placeholder: string,
    $channels: Signal<
      Readonly<Record<string, IContactCommChannelProps>> | undefined
    >,
  ) {
    super();
    this.$channels = computed(() =>
      Object.entries($channels() || {}).map(([id, props]) =>
        Object.assign({ id }, props),
      ),
    );
    this.$title.set(title);
    this.$placeholder.set(placeholder);
  }
}
