import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { HappeningBasePage } from '../happening-base-page';

@Component({
	selector: 'sneat-regular-happening-page',
	templateUrl: './regular-happening.page.html',
	providers: [TeamComponentBaseParams],
})
export class RegularHappeningPageComponent extends HappeningBasePage {

	public recurring: DtoRegularActivity;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		regularService: IRegularHappeningService,
	) {
		super('RegularHappeningPageComponent', route, params, regularService);
	}

	protected setHappeningDto(dto: IHappening): void {
		super.setHappeningDto(dto);
		this.recurring = dto as DtoRegularActivity;
	}
}
