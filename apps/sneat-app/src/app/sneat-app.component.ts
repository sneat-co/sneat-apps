import { Component } from '@angular/core';
import { TopMenuService } from '@sneat/core';
@Component({
	selector: 'sneat-app-root',
	templateUrl: 'sneat-app.component.html',
})
export class SneatAppComponent {
	constructor(public readonly topMenuService: TopMenuService) {}
}
