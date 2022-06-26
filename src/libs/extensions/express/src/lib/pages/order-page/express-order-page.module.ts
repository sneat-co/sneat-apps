import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { ExpressOrderPageComponent } from './express-order-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExpressOrderPageComponent,
	},
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    OrderFormModule,
    OrderContainersModule,
  ],
	declarations: [
		ExpressOrderPageComponent,
	],
})
export class ExpressOrderPageModule {
}
