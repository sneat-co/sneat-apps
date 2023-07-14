import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TelegramMenuPageComponent } from './telegram-menu-page.component';

const routes: Routes = [
	{
		path: '',
		component: TelegramMenuPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		TelegramMenuPageComponent,
	],
})
export class TelegramMenuPageModule {

}
