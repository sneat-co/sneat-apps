import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { IProjDbModelBrief } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-db-schema',
	templateUrl: './db-model-page.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, SneatCardListComponent],
})
export class DbModelPageComponent {
	public dbModelBrief?: IProjDbModelBrief;
	public tab: 'tables' | 'views' | 'sp' = 'tables';
	public envTab = 'sit';
	public envs = ['dev', 'sit', 'prod'];

	constructor() {
		this.dbModelBrief = history.state['dbmodel'];
	}
}
