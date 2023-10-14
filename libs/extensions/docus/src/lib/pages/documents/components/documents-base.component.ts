import { Directive, Inject, Input } from '@angular/core';
import { IonItemSliding, ToastController } from '@ionic/angular';
import { eq } from '@sneat/core';
import { IDocumentAssetDto } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext } from '@sneat/team/models';
import { ignoreElements } from 'rxjs/operators';

@Directive()
export abstract class DocumentsBaseComponent {
	static metadata = {
		inputs: ['allDocuments'],
	};

	@Input() allDocuments?: IAssetContext<IDocumentAssetDto>[];

	protected constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly asset: AssetService,
		protected readonly toastCtrl: ToastController,
	) {}

	deleteDocument(asset: IAssetContext, slidingItem: IonItemSliding): void {
		this.asset
			.deleteAsset(asset)
			.pipe(ignoreElements())
			.subscribe({
				complete: async () => {
					const toast = await this.toastCtrl.create({
						message: `Document deleted: ${asset.id}`,
					});
					await toast.present();
					await slidingItem.close();
					this.allDocuments = this.allDocuments?.filter(
						(d) => !eq(d.id, asset.id),
					);
					this.onDocsChanged();
				},
				error: (err) => {
					slidingItem.close().catch((e) => {
						console.error(e);
					});
					this.errorLogger.logError(err);
				},
			});
	}

	protected abstract onDocsChanged(): void;
}
