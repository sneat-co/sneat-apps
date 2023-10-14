import { Component, Input } from '@angular/core';
import { IAssetContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-real-estate-location',
	templateUrl: './real-estate-location.component.html',
})
export class RealEstateLocationComponent {
	@Input() asset?: IAssetContext;
}
