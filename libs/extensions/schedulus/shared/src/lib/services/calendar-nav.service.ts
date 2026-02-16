import { inject, Injectable, NgModule } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ISlotUIEvent } from '@sneat/mod-schedulus-core';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { SpaceNavService } from '@sneat/space-services';

@Injectable()
export class CalendarNavService {
  private readonly errorLogger = inject(ErrorLogger);
  private readonly spaceNavService = inject(SpaceNavService);

  public navigateToHappeningPage(args: ISlotUIEvent): void {
// console.log('Navigating happeningPage', args);
    const happening: IHappeningContext = args.slot.happening;
    const page = `happening/${happening.id}`;
    this.spaceNavService
      .navigateForwardToSpacePage(happening.space, page, {
        state: { happening },
      })
      .catch(
        this.errorLogger.logErrorHandler(
          'failed to navigate to recurring happening page',
        ),
      );
  }
}

@NgModule({
  providers: [CalendarNavService],
})
export class CalendarNavServicesModule {}
