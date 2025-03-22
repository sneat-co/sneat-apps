import { Component } from '@angular/core';
import { LogistSpaceService } from '../../services/logist-space.service';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-main-page',
	templateUrl: './logist-space-page.component.html',
	standalone: false,
})
export class LogistSpacePageComponent extends LogistSpaceBaseComponent {
	constructor(logistTeamService: LogistSpaceService) {
		super('LogistSpacePageComponent', logistTeamService);
	}
}
