import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppVersionComponent } from './app-version.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		AppVersionComponent,
	],
	exports: [
		AppVersionComponent,
	]
})
export class AppVersionModule {
}
