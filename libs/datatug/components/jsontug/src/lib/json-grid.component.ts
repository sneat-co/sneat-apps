import { Component, Input } from '@angular/core';
import { IJsonGridData } from '@sneat/datatug-plugins';

@Component({
	selector: 'sneat-datatug-json-grid',
	templateUrl: 'json-grid.component.html',
	styleUrls: ['json-component.scss'],
})
export class JsonGridComponent {
	@Input() jsonGrid?: IJsonGridData;
}
