import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DocumentsBaseComponent} from '../documents-base.component';
import {ToastController} from '@ionic/angular';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IRecord} from 'rxstore';
import {IAssetService, IErrorLogger} from 'sneat-shared/services/interfaces';

@Component({
	selector: 'app-documents-list',
	templateUrl: './documents-list.component.html',
})
export class DocumentsListComponent extends DocumentsBaseComponent implements OnChanges {

	filteredDocs: IAssetDto[];
	@Input() filter: string;
	@Output() goDoc = new EventEmitter<IAssetDto>();
	trackById = (i: number, record: IRecord) => record.id;

	constructor(
		errorLogger: IErrorLogger,
		assetService: IAssetService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, assetService, toastCtrl);
	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('DocumentsListComponent.ngOnChanges', changes, [...this.allDocuments], ''+this.filter);
		this.onDocsChanged();
	}

	protected onDocsChanged(): void {
		this.filteredDocs = this.allDocuments
			&& this.allDocuments.filter(d => !d.parentAssetId && (!this.filter
				|| d.title && d.title
					.toLowerCase()
					.indexOf(this.filter) >= 0));
	}
}
