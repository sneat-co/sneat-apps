import { Component, Input } from "@angular/core";
import { IRecordsetColumn } from "@sneat/datatug/dto";
import { IForeignKey } from "@sneat/datatug/models";

@Component({
	selector: "datatug-cell-popover",
	templateUrl: "./cell-popover.component.html",
	styleUrls: ["./cell-popover.component.scss"],
})
export class CellPopoverComponent {
	@Input() column?: IRecordsetColumn;
	@Input() value: any;
	@Input() fk?: IForeignKey;

	public tab: "rec" | "cols" | "refs" = "rec";
}
