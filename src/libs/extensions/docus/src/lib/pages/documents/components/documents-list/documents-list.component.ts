import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IAssetDto } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext } from '@sneat/team/models';
import { DocumentsBaseComponent } from '../documents-base.component';

@Component({
	selector: 'sneat-documents-list',
	templateUrl: './documents-list.component.html',
})
export class DocumentsListComponent extends DocumentsBaseComponent implements OnChanges {

	filteredDocs?: IAssetContext[];
	@Input() filter = '';
	@Output() goDoc = new EventEmitter<IAssetContext>();

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		assetService: AssetService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, assetService, toastCtrl);
	}

	readonly trackById = (i: number, record: { id: string }) => record.id;

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('DocumentsListComponent.ngOnChanges', changes, [...this.allDocuments], ''+this.filter);
		this.onDocsChanged();
	}

	protected onDocsChanged(): void {
		this.filteredDocs = this.allDocuments
			&& this.allDocuments.filter(d => !d.dto?.parentAssetID && (!this.filter
				|| d.brief?.title && d.brief.title
					.toLowerCase()
					.indexOf(this.filter) >= 0));
	}
}
