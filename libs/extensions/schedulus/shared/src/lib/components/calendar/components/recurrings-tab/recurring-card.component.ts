import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import {
  IHappeningContext,
  IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { takeUntil } from 'rxjs';
import { HappeningService } from '../../../../services/happening.service';

@Component({
  selector: 'sneat-recurring-card',
  templateUrl: './recurring-card.component.html',
  imports: [IonCard],
})
export class RecurringCardComponent implements OnDestroy {
  private readonly happeningService = inject(HappeningService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly spaceNavService = inject(SpaceNavService);

  private readonly destroyed = new EventEmitter<void>();
  @Input() recurring?: IHappeningWithUiState;
  @Input({ required: true }) space?: ISpaceContext;

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  goHappening(happening?: IHappeningWithUiState): void {
    if (!this.space) {
      this.errorLogger.logErrorHandler(
        'not able to navigate to happening without a space context',
      );
      return;
    }
    this.spaceNavService
      .navigateForwardToSpacePage(this.space, `happening/${happening?.id}`, {
        state: { happening },
      })
      .catch(
        this.errorLogger.logErrorHandler(
          'failed to navigate to happening page',
        ),
      );
    // this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
  }

  deleteRecurring(
    event: Event,
    happeningWithUiState?: IHappeningWithUiState,
  ): void {
    event.stopPropagation();
    if (!happeningWithUiState) {
      return;
    }
    if (!this.space?.id) {
      return;
    }
    const happening: IHappeningContext = {
      id: happeningWithUiState.id,
      space: { id: this.space?.id },
      brief: happeningWithUiState.brief,
      dbo: happeningWithUiState.dbo,
    };
    this.happeningService
      .deleteHappening(happening)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        error: this.errorLogger.logErrorHandler(
          'failed to delete recurring happening',
        ),
      });
  }
}
