import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpQueryEditorComponent } from './http-query-editor.component';
import { DatatugComponentsJsontugModule } from '@datatug/jsonrows';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsJsontugModule,
	],
	declarations: [HttpQueryEditorComponent],
	exports: [HttpQueryEditorComponent],
})
export class HttpQueryEditorModule {}
