import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponentService } from "./app-component.service";
import { SneatLoggingModule } from "@sneat/logging";
import { SneatAnalyticsModule } from "@sneat/analytics";

@NgModule({
	imports: [
		CommonModule,
		SneatLoggingModule,
		SneatAnalyticsModule,
	],
	providers: [
		AppComponentService,
	],
})
export class SneatApplicationModule {
}
