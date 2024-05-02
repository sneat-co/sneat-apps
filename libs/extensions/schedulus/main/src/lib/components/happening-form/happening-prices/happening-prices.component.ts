import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { HappeningPriceFormComponent } from '../happening-price-form/happening-price-form.component';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-prices.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, HappeningPriceFormComponent],
})
export class HappeningPricesComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	protected showNewPriceForm = false;

	protected onNewPriceFormCanceled(): void {
		this.showNewPriceForm = false;
	}
}
