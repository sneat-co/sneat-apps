import {Component, EventEmitter, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DocumentsBaseComponent} from '../documents-base.component';
import {ToastController} from '@ionic/angular';
import {IDocument} from 'sneat-shared/models/dto/dto-asset';
import {listItemAnimations} from 'sneat-shared/animations/list-animations';
import {eq, IAssetService, IErrorLogger} from 'sneat-shared/services/interfaces';
import {IRecord} from 'rxstore';

interface IDocumentType {
	id: string | undefined;
	title: string;
	emoji?: string;
	documents?: IDocument[];
	expanded?: boolean;
}

@Component({
	selector: 'app-documents-by-type',
	templateUrl: './documents-by-type.component.html',
	styleUrls: ['./documents-by-type.component.scss'],
	animations: [listItemAnimations],
})
export class DocumentsByTypeComponent extends DocumentsBaseComponent implements OnChanges {

	docTypes: IDocumentType[] = [
		{id: 'passport', title: 'Passports', emoji: '📘'},
		// {id: 'visa', title: 'Visas'},
		{id: 'driving_license', title: 'Driving licenses', emoji: '🚗'},
		{id: 'rent_lease', title: 'Rent lease', emoji: '🏘️'},
		{id: 'insurance', title: 'Insurance', emoji: '💸'},
		{id: 'birth_certificate', title: 'Birth certificates', emoji: '👶'},
		{id: 'marriage_certificate', title: 'Marriage certificates', emoji: '💍'},
		{id: undefined, title: 'Other', emoji: '🗂️'},
	];

	@Output() goNewDoc = new EventEmitter<string>();
	@Output() goDocType = new EventEmitter<string>();
	@Output() goDoc = new EventEmitter<IDocument>();

	constructor(
		errorLogger: IErrorLogger,
		assetService: IAssetService,
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

	newDoc(docType: IDocumentType, event?: Event,): void {
		if (event) {
			event.stopPropagation();
		}
		this.goNewDoc.emit(docType.id);
	}

	trackById = (i: number, record: IRecord) => record.id;

	ngOnChanges(changes: SimpleChanges): void {
		console.log('DocumentsListComponent.ngOnChanges', changes, this.allDocuments && [...this.allDocuments]);
		if (changes.hasOwnProperty('allDocuments') && this.allDocuments) {
			this.onDocsChanged();
		}
	}

	protected onDocsChanged(): void {
		this.docTypes.forEach(dt => dt.documents = []);
		const other = this.docTypes[this.docTypes.length - 1];
		this.allDocuments.forEach(d => {
			const docType = this.docTypes.find(dt => eq(dt.id, d.type));
			if (docType) {
				if (!docType.documents) {
					docType.documents = [];
				}
				docType.documents.push(d);
			} else if (d.parentCategoryId !== 'docs') {
				if (!other.documents) {
					other.documents = [];
				}
				other.documents.push(d);
			}
		});
	}
}
