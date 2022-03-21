import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { SneatCardListComponent } from "./sneat-card-list.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
	],
	declarations: [SneatCardListComponent],
	exports: [SneatCardListComponent],
})
export class SneatCardListModule {
}
