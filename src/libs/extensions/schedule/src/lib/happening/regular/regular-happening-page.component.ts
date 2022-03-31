import {Component, OnInit} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IRegularHappeningService} from 'sneat-shared/services/interfaces';
import {HappeningBasePage} from '../happening-base-page';
import {DtoRegularActivity, IHappening} from 'sneat-shared/models/dto/dto-happening';

@Component({
	selector: 'app-activity',
	templateUrl: './regular-happening.page.html',
	providers: [CommuneBasePageParams],
})
export class RegularHappeningPageComponent extends HappeningBasePage implements OnInit {

	public regular: DtoRegularActivity;

	constructor(
		params: CommuneBasePageParams,
		regularService: IRegularHappeningService,
	) {
		super(params, regularService);
	}

	ngOnInit(): void {
		super.ngOnInit();
	}

	protected setHappeningDto(dto: IHappening): void {
		super.setHappeningDto(dto);
		this.regular = dto as DtoRegularActivity;
	}
}
