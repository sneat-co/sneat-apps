import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectFromListModule } from '@sneat/components';
import { AssetVehicleType, carMakes, IMake, IModel } from '@sneat/dto';

@Component({
	standalone: true,
	selector: 'sneat-make-model-card',
	templateUrl: './make-model-card.component.html',
	imports: [
		CommonModule,
		IonicModule,
		SelectFromListModule,
		FormsModule,
	],
})
export class MakeModelCardComponent {
	@Input() vehicleType?: AssetVehicleType;
	@Input() make?: string;
	@Input() model?: string;

	@Output() makeChange = new EventEmitter<string>();
	@Output() modelChange = new EventEmitter<string>();


	public makes: IMake[] = Object.keys(carMakes).map(id => ({ id, title: id }));
	public models: IModel[] = [{ id: 'A4', title: 'A4' }, { id: 'A6', title: 'A6' }];

	protected isKnownMake(): boolean {
		return !!this.make && !!carMakes[this.make];
	}

	protected isKnownModel(): boolean {
		const model = this.model?.toLowerCase();
		return !!model && !!this.models?.length && this.models.some(m => m.id == model || m.title.toLowerCase() === model);
	}

	protected onMakeChanged(event: Event): void {
		console.log('makeChanged', event, this.make);
		const make = this.make ? carMakes[this.make] : undefined;
		if (make) {
			this.models = make.models.map(v => ({ id: v.model, title: v.model }));
		} else {
			console.log('make not found by id: ' + this.make);
			this.models = [];
		}
		this.makeChange.emit(this.make);
		if (this.model) {
			this.model = '';
		}
		this.onModelChanged(event);
	}

	protected onModelChanged(event: Event): void {
		console.log('onModelChanged', event, this.model);
		this.modelChange.emit(this.model);
	}

}
