import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/angular/standalone';
import { IMeetingMember } from '@sneat/ext-meeting';
import { IRecord } from '@sneat/data';
import { ISpaceContext } from '@sneat/space-models';
import { IRetrospective } from '@sneat/ext-scrumspace-scrummodels';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

interface IRetroCount {
  title: string;
  count: number;
}

interface IMeetingMemberWithCounts extends IMeetingMember {
  id: string;
  counts?: Record<string, IRetroCount>;
}

@Component({
  selector: 'sneat-retro-members',
  templateUrl: './retro-members.component.html',
  imports: [
    IonCard,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonText,
    IonList,
    IonItem,
    IonCardContent,
    IonButton,
    IonIcon,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroMembersComponent {
  private errorLogger = inject<IErrorLogger>(ErrorLogger);

  readonly space = input<ISpaceContext>();
  readonly retrospective = input<IRecord<IRetrospective>>();

  public readonly membersTab = signal<'participants' | 'spectators' | 'absent'>(
    'participants',
  );

  public readonly participants = signal<IMeetingMemberWithCounts[] | undefined>(
    undefined,
  );
  public readonly spectators = signal<IMeetingMemberWithCounts[] | undefined>(
    undefined,
  );
  public readonly absents = signal<IMeetingMember[] | undefined>(undefined);

  constructor() {
    effect(() => {
      const retro = this.retrospective();
      // console.log('ngOnChanges', this.space, this.retrospective);
      try {
        const retrospective = retro?.dbo;
        if (retrospective) {
          const members = retro?.dbo?.members;
          if (members) {
            this.participants.set(
              members.filter((m) =>
                m.roles?.includes(MemberRoleEnum.contributor),
              ),
            );
            this.spectators.set(
              members?.filter((m) =>
                m.roles?.includes(MemberRoleEnum.spectator),
              ),
            );
          }
        }
      } catch (e) {
        this.errorLogger.logError(e, 'Failed to process ngOnChanges event');
      }
    });
  }
}
