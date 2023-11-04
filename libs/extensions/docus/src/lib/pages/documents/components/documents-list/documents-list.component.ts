import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext, IDocumentAssetDto } from '@sneat/mod-assetus-core';
import { DocumentsBaseComponent } from '../documents-base.component';

@Component({
	selector: 'sneat-documents-list',
	templateUrl: './documents-list.component.html',
	...DocumentsBaseComponent.metadata,
})
export class DocumentsListComponent
	extends DocumentsBaseComponent
	implements OnChanges
{
	@Input() public filter = '';
	@Output() public readonly goDoc = new EventEmitter<
		IAssetContext<IDocumentAssetDto>
	>();

	protected filteredDocs?: IAssetContext<IDocumentAssetDto>[];

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
					(d.brief?.title && d.brief.title.toLowerCase().indexOf(text) >= 0) ||
					(d.brief?.type && d.brief.type.toLowerCase().indexOf(text) >= 0),
			) || [];
	}
}
