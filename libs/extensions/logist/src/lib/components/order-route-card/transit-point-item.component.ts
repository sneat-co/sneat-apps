import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	IonItemDivider,
	IonItemGroup,
	IonLabel,
} from '@ionic/angular/standalone';
import { CountryInputComponent } from '@sneat/components';
import { ITransitPoint } from '../../dto';

@Component({
	selector: 'sneat-transit-point-item',
	templateUrl: './transit-point-item.component.html',
	imports: [IonItemGroup, IonItemDivider, IonLabel, CountryInputComponent],
})
export class TransitPointItemComponent {
	@Input() label = 'Transit point';

	@Input() transitPoint?: ITransitPoint;
	@Output() transitPointChange = new EventEmitter<ITransitPoint>();

	public onCountryChanged(countryID: string): void {
		console.log('TransitPointItemComponent.onCountryChanged()', countryID);
		const transitPoint = this.transitPoint;
		if (!transitPoint) {
			throw new Error('!transitPoint');
		}
		this.transitPoint = { ...transitPoint, countryID };
		this.transitPointChange.emit(this.transitPoint);
	}
}
