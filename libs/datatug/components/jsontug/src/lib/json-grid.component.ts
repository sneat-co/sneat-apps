import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IJsonGridData } from '@sneat/ext-datatug-plugins';

@Component({
	selector: 'sneat-datatug-json-grid',
	templateUrl: 'json-grid.component.html',
	styleUrls: ['json-component.scss'],
	imports: [JsonPipe, NgIf, NgForOf],
})
export class JsonGridComponent {
	@Input() jsonGrid?: IJsonGridData;
}
