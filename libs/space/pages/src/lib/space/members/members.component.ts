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
  NavController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItemDivider,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import {
  MemberRole,
  MemberRoleContributor,
  MemberRoleSpectator,
  IContactusSpaceDbo,
  IContactusSpaceDboAndID,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

@Component({
  selector: 'sneat-members',
  templateUrl: './members.component.html',
  imports: [
    FormsModule,
    IonCard,
    IonItemDivider,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonBadge,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
}) // TODO: use or delete unused MembersComponent
export class MembersComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly spaceService = inject(SpaceService);
  private readonly navController = inject(NavController);
  readonly navService = inject(SpaceNavService);

  public readonly contactusSpace = input.required<IContactusSpaceDboAndID>();

  public readonly membersRoleTab = signal<MemberRole | '*'>(
    MemberRoleContributor,
  );
  public readonly contributorsCount = signal<number | undefined>(undefined);
  public readonly spectatorsCount = signal<number | undefined>(undefined);

  constructor() {
    effect(() => {
      try {
        this.setMembersCount(this.contactusSpace()?.dbo);
      } catch (e) {
        this.errorLogger.logError(e, 'Failed to process team changes');
      }
    });
  }

  public goAddMember(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const contactusSpace = this.contactusSpace();
    if (!contactusSpace) {
      throw 'no team';
    }
    this.navService.navigateToAddMember(this.navController, contactusSpace);
  }

  public onSelfRemoved(): void {
    // this.unsubscribe('onSelfRemoved');
  }

  private setMembersCount(team?: IContactusSpaceDbo | null): void {
    if (team) {
      const count = (role: MemberRole): number =>
        zipMapBriefsWithIDs(team.contacts)?.filter((m) =>
          m.brief.roles?.includes(role),
        )?.length || 0;
      this.contributorsCount.set(count(MemberRoleContributor));
      this.spectatorsCount.set(count(MemberRoleSpectator));
    } else {
      this.contributorsCount.set(undefined);
      this.spectatorsCount.set(undefined);
    }
  }
}
