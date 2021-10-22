import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectFormComponent } from './new-project-form.component';
import { IonicModule } from '@ionic/angular';
import { NewProjectService } from './new-project.service';
import { FormsModule } from '@angular/forms';
import { DatatugServicesProjectModule } from '@sneat/datatug/services/project';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DatatugServicesProjectModule,
	],
	declarations: [NewProjectFormComponent],
	exports: [NewProjectFormComponent],
	providers: [NewProjectService],
})
export class NewProjectFormModule {}
