import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	SelectFromListComponent,
	SelectFromListModule,
} from '@sneat/components';
import { AssetType, carMakes, IMake, IModel } from '@sneat/mod-assetus-core';

@Component({
	standalone: true,
	selector: 'sneat-make-model-card',
	templateUrl: './make-model-card.component.html',
	imports: [CommonModule, IonicModule, SelectFromListModule, FormsModule],
})
export class MakeModelCardComponent {
	@Input() assetType?: AssetType;
	@Input() make?: string;
	@Input() model?: string;

	@Output() makeChange = new EventEmitter<string>();
	@Output() modelChange = new EventEmitter<string>();

	@ViewChild('modelSelector', { static: false })
	modelSelector?: SelectFromListComponent;

	public makes: IMake[] = Object.keys(carMakes).map((id) => ({
		id,
		title: id,
	}));
	public models: IModel[] = [
		{ id: 'A4', title: 'A4' },
		{ id: 'A6', title: 'A6' },
	];

	protected isKnownMake(): boolean {
		return !!this.make && !!carMakes[this.make];
	}

	protected isKnownModel(): boolean {
		const model = this.model?.toLowerCase();
		return (
			!!model &&
			!!this.models?.length &&
			this.models.some((m) => m.id == model || m.title.toLowerCase() === model)
		);
	}

	protected onMakeChanged(event: Event): void {
		console.log('makeChanged', event, this.make);
		const make = this.make ? carMakes[this.make] : undefined;
		if (make) {
			this.models = make.models.map((v) => ({ id: v.id, title: v.id }));
		} else {
			console.log('make not found by id: ' + this.make);
			this.models = [];
		}
		this.makeChange.emit(this.make);
		if (this.model) {
			this.model = '';
		}
		this.onModelChanged(event);
		this.modelSelector?.focus();
	}

	protected onModelChanged(event: Event): void {
		console.log('onModelChanged', event, this.model);
		this.modelChange.emit(this.model);
	}
}
