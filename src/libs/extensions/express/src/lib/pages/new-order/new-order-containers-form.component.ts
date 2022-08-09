import { Component, EventEmitter, Input, Output } from '@angular/core';
import { excludeZeroValues } from '@sneat/core';
import { IExpressOrderContext } from '../../dto';

@Component({
	selector: 'sneat-new-order-containers-form',
	templateUrl: './new-order-containers-form.component.html',
})
export class NewOrderContainersFormComponent {
	@Input() order?: IExpressOrderContext;
	@Output() readonly numberOfContainersChange = new EventEmitter<{ [size: string]: number }>();

	size8ft = 0;
	size9ft = 0;
	size20ft = 0;
	size40ft = 0;

	onSizeChanged(): void {
		console.log('onSizeChanged(), size8ft:', this.size8ft, 'size9ft:', this.size9ft, 'size20ft:', this.size20ft, 'size40ft:', this.size40ft);
		this.numberOfContainersChange.emit(excludeZeroValues({
			'8ft': this.size8ft,
			'9ft': this.size9ft,
			'20ft': this.size20ft,
			'40ft': this.size40ft,
		}));
	}
}
