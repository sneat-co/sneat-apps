import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonRouterLink,
	IonSpinner,
} from '@ionic/angular/standalone';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { IHappeningWithUiState } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { HappeningCardComponent } from '../../../happening-card/happening-card.component';

@Component({
	imports: [
		IonCard,
		IonButtons,
		IonButton,
		IonItem,
		IonLabel,
		IonIcon,
		IonRouterLink,
		RouterLink,
		IonCardContent,
		IonSpinner,
		HappeningCardComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-recurrings-tab',
	templateUrl: 'recurrings-tab.component.html',
})
export class RecurringsTabComponent {
	public readonly $space = input.required<ISpaceContext | undefined>();

	public readonly $recurrings = input.required<
		readonly IHappeningWithUiState[] | undefined
	>();

	public readonly $contactusSpace = input.required<
		IContactusSpaceDboAndID | undefined
	>();

	public readonly $allRecurrings = input.required<
		readonly IHappeningWithUiState[] | undefined
	>();

	protected readonly $numberOfHidden = computed(
		() =>
			(this.$allRecurrings()?.length || 0) - (this.$recurrings()?.length || 0),
	);

	private filterService = inject(CalendarFilterService);
	protected readonly resetFilter = (event: Event) =>
		this.filterService.resetScheduleFilter(event);

	// @Input({ required: true }) recurrings?: readonly IHappeningWithUiState[];
	// @Input({ required: true }) allRecurrings?: readonly IHappeningWithUiState[];
	// @Input({ required: true }) space?: ISpaceContext;

	// protected readonly resetFilter: (event: Event) => void;

	// protected get numberOfHidden(): number {
	// 	return (this.allRecurrings?.length || 0) - (this.recurrings?.length || 0);
	// }

	// constructor(filterService: CalendarFilterService) {
	// 	this.resetFilter = filterService.resetFilterHandler;
	// }
}
