import { Component, computed, Input, signal, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { ContactTitlePipe } from '@sneat/contactus-shared';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import {
  emptyCalendarFilter,
  CalendarFilterService,
} from '../../../calendar-filter.service';
import { WeekdaysFormBase } from '../../../weekdays/weekdays-form-base';
import { ContactsFilterComponent } from './contacts-filter.component';
import { ICalendarFilter } from './calendar-filter';
import { ClassName } from '@sneat/ui';

@Component({
  imports: [
    ContactTitlePipe,
    ContactsFilterComponent,
    ReactiveFormsModule,
    IonCard,
    IonAccordionGroup,
    IonItem,
    IonIcon,
    IonInput,
    IonButtons,
    IonButton,
    IonItemGroup,
    IonItemDivider,
    IonGrid,
    IonRow,
    IonCol,
    IonCheckbox,
    IonAccordion,
    IonBadge,
    IonLabel,
  ],
  providers: [{ provide: ClassName, useValue: 'CalendarFilterComponent' }],
  selector: 'sneat-calendar-filter',
  templateUrl: 'calendar-filter.component.html',
})
export class CalendarFilterComponent extends WeekdaysFormBase {
  private readonly filterService = inject(CalendarFilterService);

  protected readonly $expanded = signal(false);
  public accordionValue?: string;
  private resetting = false;

  @Input({ required: true }) space?: ISpaceContext;
  @Input() showWeekdays = false;
  @Input() showRepeats = false;

  readonly text = new FormControl<string>('');

  // protected readonly $weekdays = computed(() => this.$filter().weekdays);
  protected readonly $repeats = computed(() => this.$filter().repeats);

  contactID = '';
  selectedContacts: IContactWithBriefAndSpace[] = [];
  contacts?: IContactWithBriefAndSpace[];

  protected readonly $repeatsWeekly = computed(() =>
    this.$repeats().includes('weekly'),
  );
  protected readonly $repeatsMonthly = computed(() =>
    this.$repeats().includes('monthly'),
  );
  protected readonly $repeatsQuarterly = computed(() =>
    this.$repeats().includes('quarterly'),
  );
  protected readonly $repeatsYearly = computed(() =>
    this.$repeats().includes('yearly'),
  );

  protected readonly $filter = signal<ICalendarFilter>(emptyCalendarFilter);

  protected readonly $contactIDs = computed(() => this.$filter().contactIDs);

  protected readonly $hasFilter = computed(() => {
    const filter = this.$filter();
    return (
      !!filter.text.trim() ||
      !!filter.weekdays.length ||
      !!filter.contactIDs.length ||
      !!filter.repeats?.length
    );
  });

  public constructor() {
    super(false);
    const filterService = this.filterService;

    filterService.filter.subscribe({
      next: this.onFilterChanged,
    });
  }

  protected onSelectedContactsChanged(contactIDs: readonly string[]): void {
      'ScheduleFilterComponent.onSelectedContactsChanged()',
      contactIDs,
    );
    this.onFilterChanged({ ...this.$filter(), contactIDs: [...contactIDs] });
  }

  private readonly onFilterChanged = (filter: ICalendarFilter): void => {
    if (this.$filter() === filter) {
      return;
    }
    this.$filter.set(filter);
    this.text.setValue(filter.text || '');
    const { contactIDs } = filter;
    if (contactIDs) {
      if (filter.contactIDs.length === 1) {
        this.contactID = contactIDs[0];
        this.accordionValue = 'filter';
        this.$expanded.set(true);
      }
    }
    // TODO: reset weekday & repeats controls
    this.emitChanged();
  };

  protected clearFilter(event?: Event): void {
    event?.stopPropagation();
    this.resetting = true;
    try {
      this.$filter.update((f) => ({
        ...f,
        contactIDs: [],
        repeats: [],
        weekdays: [],
      }));
      this.contactID = '';

      const resetFormControlOptions = {
        onlySelf: true,
        emitEvent: false,
        emitModelToViewChange: true,
        emitViewToModelChange: false,
      };
      this.text.setValue('', resetFormControlOptions);
      Object.values(this.weekdayById).forEach((wd) => wd.set(false));
    } catch (e) {
      console.error(e);
    }
    this.resetting = false;
    this.emitChanged();
  }

  protected accordionChanged(event: Event): void {
    event.stopPropagation();
    this.$expanded.set(!!(event as CustomEvent).detail.value);
  }

  protected repeatChanged(event: Event): void {
    const ce = event as CustomEvent;
    const { checked, value } = ce.detail;
    this.$filter.update((filter) => {
      const repeats = filter.repeats;
      const found = repeats.includes(value);
      if (checked && !found) {
        return { ...filter, repeats: [...repeats, value] };
      }
      if (!checked && found) {
        return { ...filter, repeats: repeats.filter((r) => r !== value) };
      }
      return filter;
    });
    this.emitChanged();
  }

  protected onTextKeyUp(): void {
    this.emitChanged();
  }

  protected override onWeekdayChanged(
    wd: WeekdayCode2,
    checked: boolean,
  ): void {
    super.onWeekdayChanged(wd, checked);
    this.emitChanged();
  }

  protected emitChanged(): void {
    if (this.resetting) {
      return;
    }
    this.$filter.update((filter) => ({
      ...filter,
      text: this.text.value || '',
      showRecurrings: true,
      showSingles: true,
      weekdays: this.selectedWeekdayCodes(),
    }));
    this.filterService.next(this.$filter());
  }
}
