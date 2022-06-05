import { Directive, Inject, Injectable, Input } from '@angular/core';
import { IonItemSliding, ToastController } from '@ionic/angular';
import { eq } from '@sneat/core';
import { DocumentService } from '@sneat/extensions/docus';
import { IDocumentContext } from '@sneat/team/models';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ignoreElements } from 'rxjs/operators';


@Directive()
export abstract class DocumentsBaseComponent {

	@Input() allDocuments?: IDocumentContext[];

	static metadata = {
		inputs: ['allDocuments'],
	};

	protected constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly documentService: DocumentService,
		protected readonly toastCtrl: ToastController,
	) {
	}

	deleteDocument(doc: IDocumentContext, slidingItem: IonItemSliding): void {
		this.documentService.deleteDocument(doc)
			.pipe(ignoreElements())
			.subscribe({
				complete: async () => {
					const toast = await this.toastCtrl.create({
						message: `Document deleted: ${doc.id}`,
					});
					await toast.present();
					await slidingItem.close();
					this.allDocuments = this.allDocuments?.filter(d => !eq(d.id, doc.id));
					this.onDocsChanged();
				},
				error: err => {
					slidingItem.close()
						.catch(e => {
							console.error(e);
						});
					this.errorLogger.logError(err);
				},
			});
	}

	protected abstract onDocsChanged(): void;
}
