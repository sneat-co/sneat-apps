import {Component, Input} from '@angular/core';
import {Asset} from 'sneat-shared/models/ui/ui-asset';

@Component({
	selector: 'app-real-estate-location',
	templateUrl: './real-estate-location.component.html',
})
export class RealEstateLocationComponent {

	@Input() asset: Asset;
}
