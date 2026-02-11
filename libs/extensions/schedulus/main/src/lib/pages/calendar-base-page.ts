import { SpaceBaseComponent } from '@sneat/space-components';

export abstract class CalendarBasePage extends SpaceBaseComponent {
  protected constructor() {
    super();
    this.$defaultBackUrlSpacePath.set('calendar');
  }
}
