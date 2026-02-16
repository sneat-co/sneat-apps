import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import {
  HappeningType,
  WeekdayCode2,
  NewHappeningParams,
  ScheduleNavService,
} from '@sneat/mod-schedulus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';

@Component({
  selector: 'sneat-calendar-add-buttons',
  templateUrl: './calendar-add-buttons.component.html',
  imports: [IonButtons, IonButton, IonIcon],
  providers: [{ provide: ClassName, useValue: 'CalendarAddButtonsComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarAddButtonsComponent extends WithSpaceInput {
  private readonly scheduleNavService = inject(ScheduleNavService);

  public readonly dateID = input.required<string | undefined>();
  public readonly weekdayID = input.required<WeekdayCode2 | undefined>();

  public constructor() {
    super();
  }

  protected newHappeningUrl(type: HappeningType): string {
    const params: string[] = [];
    if (this.weekdayID()) {
      params.push(`wd=${this.weekdayID()}`);
    }
    const dateID = this.dateID();
    if (dateID) {
      params.push(`date=${dateID}`);
    }
    return (
      `space/${this.$spaceType()}/${this.$spaceID()}/new-happening?type=${type}` +
      (params.length === 0 ? '' : `&${params.join('&')}`)
    );
  }

  protected goNewHappening(event: Event, type: HappeningType): boolean {
    const space = this.$space();
    event.preventDefault();
    event.stopPropagation();
    const params: NewHappeningParams = {
      type,
      wd: this.weekdayID() ? this.weekdayID() : undefined,
      date: this.dateID() ? this.dateID() : undefined,
    };
    this.scheduleNavService.goNewHappening(space, params);
    return false;
  }
}
