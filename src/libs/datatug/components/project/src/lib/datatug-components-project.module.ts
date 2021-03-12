import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectContextMenuComponent} from './project-context-menu/project-context-menu.component';
import {IonicModule} from "@ionic/angular";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		ProjectContextMenuComponent
	],
	exports: [
		ProjectContextMenuComponent
	],
})
export class DatatugComponentsProjectModule {
}
