import { Component } from '@angular/core';
import { SneatBaseAppComponent } from '@sneat/app';
import { TopMenuService } from '@sneat/core';

@Component({
	selector: 'sneat-root',
	templateUrl: './freights-app.component.html',
	styleUrls: ['./freights-app.component.scss'],
})
export class FreightsAppComponent extends SneatBaseAppComponent {

	constructor(topMenuService: TopMenuService) {
		super(topMenuService);
	}
}
