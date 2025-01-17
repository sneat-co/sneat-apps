import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import {
	ISlotUIContext,
	ISlotUIEvent,
} from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'calendar-week-tab.component.html',
	standalone: false,
})
export class CalendarWeekTabComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;
}
