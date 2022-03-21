import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectMenuTopComponent } from "./project-menu-top/project-menu-top.component";
import { IonicModule } from "@ionic/angular";
import { ProjectMenuComponent } from "./project-menu/project-menu.component";
import { FormsModule } from "@angular/forms";
import { DatatugQueriesMenuModule } from "@sneat/datatug/queries";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DatatugQueriesMenuModule,
	],
	declarations: [ProjectMenuComponent, ProjectMenuTopComponent],
	exports: [ProjectMenuComponent],
})
export class DatatugComponentsProjectModule {
}
