import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SqlEditorComponent} from './sql-editor.component';
import {FormsModule} from '@angular/forms';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CodemirrorModule,
  ],
  declarations: [
    SqlEditorComponent,
  ],
  exports: [
    SqlEditorComponent,
  ]
})
export class DatatugComponentsSqlEditorModule {}
