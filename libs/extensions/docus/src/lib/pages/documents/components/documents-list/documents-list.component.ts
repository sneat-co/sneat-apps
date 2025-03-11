import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { AssetService } from '@sneat/extensions-assetus-components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetDocumentContext } from '@sneat/mod-assetus-core';
import { DocumentsBaseComponent } from '../documents-base.component';

@Component({
	selector: 'sneat-documents-list',
	templateUrl: './documents-list.component.html',
	...DocumentsBaseComponent.metadata,
	imports: [CommonModule, IonicModule],
})
export class DocumentsListComponent
	extends DocumentsBaseComponent
	implements OnChanges
{
	@Input() public filter = '';
	@Output() public readonly goDoc = new EventEmitter<IAssetDocumentContext>();

	protected filteredDocs?: IAssetDocumentContext[];

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		assetService: AssetService,
		toastCtrl: ToastController,
	) {
		super(errorLogger, assetService, toastCtrl);
	}

	protected readonly trackById = (i: number, record: { id: string }) =>
		record.id;

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('DocumentsListComponent.ngOnChanges', changes, [...this.allDocuments], ''+this.filter);
		if (changes['allDocuments'] || changes['filter']) {
			this.onDocsChanged();
		}
	}

	protected onDocsChanged(): void {
		this.filteredDocs = this.allDocuments;
		const text: string = this.filter;
		this.filteredDocs =
			this.allDocuments?.filter(
				(d) =>
					!text ||
					(d.brief?.title && d.brief.title.toLowerCase().includes(text)) ||
					(d.brief?.type && d.brief.type.toLowerCase().includes(text)),
			) || [];
	}
}
