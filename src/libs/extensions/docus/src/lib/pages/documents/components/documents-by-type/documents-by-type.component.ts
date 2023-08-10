import { Component, EventEmitter, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { listItemAnimations } from '@sneat/animations';
import { eq } from '@sneat/core';
import { IDocumentAssetDto, standardDocTypesByID } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext } from '@sneat/team/models';
import { DocumentsBaseComponent } from '../documents-base.component';

interface IDocumentType {
	id: string;
	title: string;
	emoji?: string;
	documents?: IAssetContext<IDocumentAssetDto>[];
	expanded?: boolean;
}

@Component({
	selector: 'sneat-documents-by-type',
	templateUrl: './documents-by-type.component.html',
	styleUrls: ['./documents-by-type.component.scss'],
	animations: [listItemAnimations],
	...DocumentsBaseComponent.metadata,
})
export class DocumentsByTypeComponent extends DocumentsBaseComponent implements OnChanges {

	docTypes: IDocumentType[] = Object.values(standardDocTypesByID).map(v => ({ ...v }));

	@Output() goNewDoc = new EventEmitter<string>();
	@Output() goDocType = new EventEmitter<string>();
	@Output() goDoc = new EventEmitter<IAssetContext<IDocumentAssetDto>>();

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		assetService: AssetService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, assetService, toastCtrl);
	}

	selectDocType(docType: IDocumentType): void {
		this.docTypes.some(v => {
			if (eq(v.id, docType.id) && !(v.documents && v.documents.length)) {
				this.newDoc(docType);
				return true;
			}
			v.expanded = eq(v.id, docType.id) && !v.expanded;
			return false;
		});
	}

	newDoc(docType: IDocumentType, event?: Event): void {
		if (event) {
			event.stopPropagation();
		}
		this.goNewDoc.emit(docType.id);
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	ngOnChanges(changes: SimpleChanges): void {
		console.log('DocumentsListComponent.ngOnChanges', changes, this.allDocuments && [...this.allDocuments]);
		if (changes['allDocuments'] && this.allDocuments) {
			this.onDocsChanged();
		}
	}

	protected onDocsChanged(): void {
		this.docTypes.forEach(dt => dt.documents = []);
		const other = this.docTypes[this.docTypes.length - 1];
		this.allDocuments?.forEach(d => {
			const docType = this.docTypes.find(dt => eq(dt.id, d.brief?.type));
			if (docType) {
				if (!docType.documents) {
					docType.documents = [];
				}
				docType.documents.push(d);
			} else {
				if (!other.documents) {
					other.documents = [];
				}
				other.documents.push(d);
			}
		});
	}
}
