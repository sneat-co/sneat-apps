import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TeamMenuComponent } from "./team-menu.component";
import { IonicModule } from "@ionic/angular";
import { TeamPageContextModule } from "../team-page-context";
import { RouterModule } from "@angular/router";

const exports = [TeamMenuComponent];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		TeamPageContextModule,
		RouterModule,
	],
	declarations: [...exports],
	exports
})
export class TeamMenuComponentModule {
}
