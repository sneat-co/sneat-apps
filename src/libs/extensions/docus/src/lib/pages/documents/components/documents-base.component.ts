import { Inject, Injectable, Input } from '@angular/core';
import { IonItemSliding, ToastController } from '@ionic/angular';
import { eq } from '@sneat/core';
import { IDocumentContext } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ignoreElements } from 'rxjs/operators';


@Injectable()
export abstract class DocumentsBaseComponent {

	@Input() allDocuments?: IDocumentContext[];

	protected constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly assetService: AssetService,
		protected readonly toastCtrl: ToastController,
	) {
	}

	deleteDocument(doc: IDocumentContext, slidingItem: IonItemSliding): void {
		this.assetService.deleteAsset(doc)
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
