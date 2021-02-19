import {Component} from '@angular/core';
import {IProjDbModelBrief} from '@sneat/datatug/models';

@Component({
	selector: 'datatug-db-schema',
	templateUrl: './db-model-page.component.html',
})
export class DbModelPage {

	public dbModelBrief: IProjDbModelBrief;
	public tab: 'tables' | 'views' | 'sp' = 'tables';
	public envTab = 'sit';
	public envs = ['dev', 'sit', 'prod'];

	constructor() {
		this.dbModelBrief = history.state.dbmodel;
	}

}
