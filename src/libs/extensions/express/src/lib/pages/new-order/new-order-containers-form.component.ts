import { Component, EventEmitter, Input, Output } from '@angular/core';
import { excludeZeroValues } from '@sneat/core';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-new-order-containers-form',
	templateUrl: './new-order-containers-form.component.html',
})
export class NewOrderContainersFormComponent {
	@Input() order?: ILogistOrderContext;
	@Output() readonly numberOfContainersChange = new EventEmitter<{ [size: string]: number }>();

	size20ft = 0;
	size20ftHighCube = 0;
	size40ft = 0;
	size40ftHighCube = 0;

	protected onSizeChanged(): void {
		const numberOfContainers = excludeZeroValues({
			'20ft': this.size20ft,
			'20ftHighCube': this.size20ftHighCube,
			'40ft': this.size40ftHighCube,
			'40ftHighCube': this.size40ftHighCube,
		});
		console.log('NewOrderContainersFormComponent.onSizeChanged(): numberOfContainers:', numberOfContainers);
		this.numberOfContainersChange.emit(numberOfContainers);
	}
}
