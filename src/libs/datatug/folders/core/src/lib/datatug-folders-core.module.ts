import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatatugFoldersService } from "./datatug-folders.service";

@NgModule({
	imports: [CommonModule],
	providers: [DatatugFoldersService],
})
export class DatatugFoldersCoreModule {
}
