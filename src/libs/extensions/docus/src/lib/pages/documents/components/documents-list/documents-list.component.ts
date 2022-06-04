import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IAssetDto } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { DocumentService } from '@sneat/extensions/docus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext, IDocumentContext } from '@sneat/team/models';
import { DocumentsBaseComponent } from '../documents-base.component';

@Component({
	selector: 'sneat-documents-list',
	templateUrl: './documents-list.component.html',
})
export class DocumentsListComponent extends DocumentsBaseComponent implements OnChanges {

	filteredDocs?: IDocumentContext[];

	@Input() filter = '';
	@Output() goDoc = new EventEmitter<IDocumentContext>();

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		documentService: DocumentService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, documentService, toastCtrl);
	}

	readonly trackById = (i: number, record: { id: string }) => record.id;

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('DocumentsListComponent.ngOnChanges', changes, [...this.allDocuments], ''+this.filter);
		this.onDocsChanged();
	}

	protected onDocsChanged(): void {
		const text: string = this.filter;
		this.filteredDocs = this.allDocuments
			?.filter(d => (!text || d.brief?.title && d.brief.title.toLowerCase()?.indexOf(text) >= 0))
			|| [];
	}
}
