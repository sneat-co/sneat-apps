import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewProjectFormComponent} from './new-project-form.component';
import {IonicModule} from '@ionic/angular';
import {NewProjectService} from './new-project.service';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [
		NewProjectFormComponent,
	],
	exports: [
		NewProjectFormComponent,
	],
	providers: [
		NewProjectService,
	]
})
export class NewProjectFormModule {
}
