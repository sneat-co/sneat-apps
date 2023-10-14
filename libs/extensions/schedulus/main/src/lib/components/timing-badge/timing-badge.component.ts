import { Component, Input } from '@angular/core';
import { ITiming } from '@sneat/dto';

@Component({
	selector: 'sneat-timing-badge',
	templateUrl: 'timing-badge.component.html',
})
export class TimingBadgeComponent {
	@Input() timing?: ITiming;
}
