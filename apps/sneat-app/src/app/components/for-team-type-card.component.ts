import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { SneatUserService } from '@sneat/auth-core';
import { TeamType } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext, teamContextFromBrief, zipMapBriefsWithIDs } from '@sneat/team/models';
import { SneatBaseComponent } from '@sneat/ui';
import {  Subscription, takeUntil } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-for-team-card',
  templateUrl: 'for-team-type-card.component.html',
})
export class ForTeamTypeCardComponent extends SneatBaseComponent implements OnChanges, OnDestroy {

  @Input() emptyTitle?: string;
  @Input() itemsTitle?: string;
  @Input() buttonColor?: string;
  @Input() newTeamButtonText?: string;
  @Input() singleTeamButtonText?: string;
  @Input() teamTypes?: TeamType[];

  teams?: ITeamContext[];

  private subscription?: Subscription;

  constructor(
    @Inject(ErrorLogger) errorLogger: IErrorLogger,
    private readonly userService: SneatUserService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super('ForTeamTypeCardComponent', errorLogger);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamTypes']) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.watchUserRecord();
    }
  }

  private watchUserRecord(): void {
    this.subscription = this.userService.userState
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: user => {
          this.teams = zipMapBriefsWithIDs(user.record?.teams)
            ?.filter(t => this.teamTypes?.some(tt => tt === t.brief.type))
            .map(t => teamContextFromBrief(t.id, t.brief));
          console.log('ForTeamTypeCardComponent =>', this.teamTypes, user.record?.teams, this.teams);
          this.changeDetectorRef.markForCheck();
        },
      });
  }
}
