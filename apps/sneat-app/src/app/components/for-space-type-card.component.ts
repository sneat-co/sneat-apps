import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItemDivider,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceType } from '@sneat/core';
import { SpacesListComponent } from '@sneat/space-components';
import {
  ISpaceContext,
  spaceContextFromBrief,
  zipMapBriefsWithIDs,
} from '@sneat/space-models';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { Subscription, takeUntil } from 'rxjs';

@Component({
  imports: [
    RouterModule,
    SpacesListComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonLabel,
    IonList,
    IonItemDivider,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-for-space-card',
  templateUrl: 'for-space-type-card.component.html',
  providers: [
    {
      provide: ClassName,
      useValue: 'ForSpaceTypeCardComponent',
    },
  ],
})
export class ForSpaceTypeCardComponent
  extends SneatBaseComponent
  implements OnChanges, OnDestroy
{
  private readonly userService = inject(SneatUserService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input() emptyTitle?: string;
  @Input() itemsTitle?: string;
  @Input() buttonColor?: string;
  @Input() newSpaceButtonText?: string;
  @Input() singleSpaceButtonText?: string;
  @Input() spaceTypes?: SpaceType[];

  protected readonly $spaces = signal<ISpaceContext[] | undefined>(undefined);

  private subscription?: Subscription;

  public constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spaceTypes']) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.watchUserRecord();
    }
  }

  private watchUserRecord(): void {
    this.subscription = this.userService.userState
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (user) => {
          this.$spaces.set(
            zipMapBriefsWithIDs(user.record?.spaces)
              ?.filter((t) =>
                this.spaceTypes?.some((tt) => tt === t.brief.type),
              )
              .map((t) => spaceContextFromBrief(t.id, t.brief)),
          );
// console.log(
            'ForSpaceTypeCardComponent.watchUserRecord() =>',
            this.spaceTypes,
            user.record?.spaces,
            this.$spaces(),
          );
          this.changeDetectorRef.markForCheck();
        },
      });
  }
}
