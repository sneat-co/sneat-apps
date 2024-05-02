import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IHappeningContext } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-happening-price-form',
	templateUrl: 'happening-price-form.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class HappeningPriceFormComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	@Output() readonly canceled = new EventEmitter<void>();

	protected get priceLabel(): string {
		return this.happening?.brief?.type === 'recurring'
			? 'Price per visit'
			: 'Price';
	}
}
