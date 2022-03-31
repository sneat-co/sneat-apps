import {Input} from '@angular/core';
import {IonItemSliding, ToastController} from '@ionic/angular';
import {ignoreElements} from 'rxjs/operators';
import {IDocument} from 'sneat-shared/models/dto/dto-asset';
import {eq, IAssetService, IErrorLogger} from 'sneat-shared/services/interfaces';

export abstract class DocumentsBaseComponent {
	@Input() allDocuments: IDocument[];

	protected constructor(
		private readonly errorLogger: IErrorLogger,
		protected readonly assetService: IAssetService,
		protected readonly toastCtrl: ToastController,
	) {
	}

	protected abstract onDocsChanged(): void;

	deleteDocument(doc: IDocument, slidingItem: IonItemSliding): void {
		this.assetService.deleteAsset(doc)
			.pipe(ignoreElements())
			.subscribe({
				complete: async () => {
					const toast = await this.toastCtrl.create({
						message: `Document deleted: ${doc.id}`,
					});
					await toast.present();
					await slidingItem.close();
					this.allDocuments = this.allDocuments.filter(d => !eq(d.id, doc.id));
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
}
