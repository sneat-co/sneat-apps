import { Directive, inject, Inject, Input } from '@angular/core';
import { IonItemSliding, ToastController } from '@ionic/angular/standalone';
import { eq } from '@sneat/core';
import { IAssetDocumentContext } from '@sneat/mod-assetus-core';
import { AssetService } from '@sneat/ext-assetus-components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { ignoreElements } from 'rxjs/operators';

@Directive()
export abstract class DocumentsBaseComponent extends SneatBaseComponent {
	@Input() space?: ISpaceContext;
	@Input() allDocuments?: IAssetDocumentContext[];

	public static readonly metadata = {
		inputs: ['space', 'allDocuments'],
	};

	protected readonly asset = inject(AssetService);
	protected readonly toastCtrl = inject(ToastController);

	protected constructor() {
		super();
	}

	deleteDocument(
		asset: IAssetDocumentContext,
		slidingItem: IonItemSliding,
	): void {
		this.asset
			.deleteAsset(this.space?.id || '', asset.id)
			.pipe(ignoreElements(), this.takeUntilDestroyed())
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
