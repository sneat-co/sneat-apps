import { Component, EventEmitter, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { eq, listItemAnimations } from '@sneat/core';
import { AssetService } from '@sneat/extensions/assetus/components';
import { DocumentService } from '@sneat/extensions/docus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IDocumentContext } from '@sneat/team/models';
import { DocumentsBaseComponent } from '../documents-base.component';

interface IDocumentType {
	id: string;
	title: string;
	emoji?: string;
	documents?: IDocumentContext[];
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

	docTypes: IDocumentType[] = [
		{ id: 'passport', title: 'Passports', emoji: '📘' },
		// {id: 'visa', title: 'Visas'},
		{ id: 'driving_license', title: 'Driving licenses', emoji: '🚗' },
		{ id: 'rent_lease', title: 'Rent lease', emoji: '🏘️' },
		{ id: 'insurance', title: 'Insurance', emoji: '💸' },
		{ id: 'birth_certificate', title: 'Birth certificates', emoji: '👶' },
		{ id: 'marriage_certificate', title: 'Marriage certificates', emoji: '💍' },
		{ id: 'other', title: 'Other', emoji: '🗂️' },
	];

	@Output() goNewDoc = new EventEmitter<string>();
	@Output() goDocType = new EventEmitter<string>();
	@Output() goDoc = new EventEmitter<IDocumentContext>();

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		documentService: DocumentService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, documentService, toastCtrl);
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

	readonly id = (i: number, v: { id: string }) => v.id;

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
			} else  {
				if (!other.documents) {
					other.documents = [];
				}
				other.documents.push(d);
			}
		});
	}
}
