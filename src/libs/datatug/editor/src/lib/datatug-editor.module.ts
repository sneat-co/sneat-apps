import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorStateStore} from "./editor-state-store";

@NgModule({
	imports: [CommonModule],
	providers: [
		EditorStateStore,
	]
})
export class DatatugEditorModule {
}
