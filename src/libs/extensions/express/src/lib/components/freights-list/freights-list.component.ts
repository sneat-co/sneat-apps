import { Component, Input } from '@angular/core';
import { IFreightContext } from '../../dto/freight';

@Component({
	selector: 'sneat-freights-list',
	templateUrl: './freights-list.component.html',
	styleUrls: ['./freights-list.component.scss'],
})
export class FreightsListComponent {

	@Input() freights?: IFreightContext[];

}
