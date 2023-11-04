import { Component, Input } from '@angular/core';
import { IAssetContext } from '@sneat/mod-assetus-core';

@Component({
	selector: 'sneat-real-estate-location',
	templateUrl: './real-estate-location.component.html',
})
export class RealEstateLocationComponent {
	@Input() asset?: IAssetContext;
}
