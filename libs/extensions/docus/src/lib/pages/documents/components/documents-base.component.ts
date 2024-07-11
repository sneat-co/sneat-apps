import { Directive, Inject, Input } from '@angular/core';
import { IonItemSliding, ToastController } from '@ionic/angular';
import { eq } from '@sneat/core';
import {
	IAssetContext,
	IAssetDocumentContext,
	IAssetDocumentExtra,
} from '@sneat/mod-assetus-core';
import { AssetService } from '@sneat/extensions/assetus/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { ignoreElements } from 'rxjs/operators';

@Directive()
export abstract class DocumentsBaseComponent {
	@Input() team?: ISpaceContext;
	@Input() allDocuments?: IAssetDocumentContext[];

	public static readonly metadata = {
		inputs: ['team', 'allDocuments'],
	};

	protected constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly asset: AssetService,
		protected readonly toastCtrl: ToastController,
	) {}

	deleteDocument(
		asset: IAssetDocumentContext,
		slidingItem: IonItemSliding,
	): void {
		this.asset
			.deleteAsset(this.team?.id || '', asset.id)
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
