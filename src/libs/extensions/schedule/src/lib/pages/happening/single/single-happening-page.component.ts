import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {ISingleHappeningService} from 'sneat-shared/services/interfaces';
import {HappeningBasePage} from '../happening-base-page';
import {IHappening, IHappeningSingle} from 'sneat-shared/models/dto/dto-happening';

@Component({
	selector: 'app-event',
	templateUrl: './single-happening-page.component.html',
	providers: [CommuneBasePageParams],
})
export class SingleHappeningPageComponent extends HappeningBasePage {

	singleHappening: IHappeningSingle;

	constructor(
		params: CommuneBasePageParams,
		singleHappeningService: ISingleHappeningService,
	) {
		super(params, singleHappeningService);
	}

	protected setHappening(dto: IHappening): void {
		super.setHappening(dto);
		this.singleHappening = dto as IHappeningSingle;
	}
}
