import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IHappeningContext } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-pricing.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class HappeningPricingComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	protected get priceLabel(): string {
		return this.happening?.brief?.type === 'recurring'
			? 'Price per visit'
			: 'Price';
	}
}
