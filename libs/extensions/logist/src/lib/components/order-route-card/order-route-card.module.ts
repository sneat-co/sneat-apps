import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountryInputComponent } from '@sneat/components';
import { OrderRouteCardComponent } from './order-route-card.component';
import { TransitPointItemComponent } from './transit-point-item.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, CountryInputComponent],
	declarations: [OrderRouteCardComponent, TransitPointItemComponent],
	exports: [OrderRouteCardComponent],
})
export class OrderRouteCardModule {}
