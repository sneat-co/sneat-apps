import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, IonInput, ToastController } from '@ionic/angular';
import { AssetKind, CommuneKind } from 'sneat-shared/models/kinds';
import { CommuneBasePage } from 'sneat-shared/pages/commune-base-page';
import { IAssetDto, IDocument } from 'sneat-shared/models/dto/dto-asset';
import { eq, IAssetService } from 'sneat-shared/services/interfaces';
import { CommuneBasePageParams } from 'sneat-shared/services/params';

@Component({
	selector: 'sneat-commune-document',
	templateUrl: './commune-document-page.component.html',
	providers: [CommuneBasePageParams],
})
export class CommuneDocumentPageComponent
	extends CommuneBasePage
	implements OnInit
{
	document: IDocument | undefined;
	parentAsset: IAssetDto | undefined;

	mode: 'view' | 'edit' | 'saving' = 'view';

	@ViewChild('docNumber', { static: true }) docNumber: IonInput;
	@ViewChild('docIssued', { static: true }) docIssued: IonDatetime;
	@ViewChild('docExpires', { static: true }) docExpires: IonDatetime;

	startEditing(): void {
		this.mode = 'edit';
		if (this.docNumber) {
			this.docNumber.setFocus().catch((err) => {
				this.errorLogger.logError(
					err,
					'Faield to set focus to docNumber',
					false,
				);
			});
		}
		// if (!this.document.number) {
		//     this.docNumber.setFocus();
		// } else if (!this.document.expires) {
		//     this.docExpires.open();
		// } else if (!this.document.issued) {
		//     this.docIssued.open();
		// }
	}

	cancelEditing(): void {
		this.mode = 'view';
	}

	constructor(
		params: CommuneBasePageParams,
		private readonly toastCtrl: ToastController,
		private readonly assetService: IAssetService,
	) {
		super('documents', params);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.route.queryParamMap.subscribe((params) => {
			const documentId = params.get('id');
			console.log('id', documentId);
			if (documentId) {
				this.subscriptions.push(
					this.assetService.watchById(documentId).subscribe((document) => {
						this.document = document as IDocument;
						if (document) {
							this.setPageCommuneIds('document', { real: document.communeId });
							if (document.parentAssetId) {
								this.assetService
									.getById(document.parentAssetId)
									.subscribe((parentAsset) => {
										this.parentAsset = parentAsset;
									});
							}
						}
					}),
				);
			}
		});
	}

	saveChanges(): void {
		this.mode = 'view';
		const document = this.document;
		if (!document) {
			throw new Error('!document');
		}
		const documentId = document.id;
		if (!documentId) {
			throw new Error('!documentId');
		}
		this.assetService
			.readwriteTx([AssetKind, CommuneKind], (tx) =>
				this.assetService.updateRecord(tx, documentId, (dto) => {
					const docDto = dto as IDocument;
					let changed = false;
					if (!eq(docDto.number, document.number)) {
						docDto.number = document.number;
						changed = true;
					}
					const updateDatetime = (field: string) => {
						const v = document[field]?.substring(0, 'yyyy-MM-dd'.length);
						if (docDto[field] !== v) {
							docDto[field] = v;
							changed = true;
						}
					};
					updateDatetime('expires');
					updateDatetime('issued');
					return { dto: docDto, changed };
				}),
			)
			.subscribe(async (assetDto) => {
				this.document = assetDto;
				const toast = await this.toastCtrl.create({
					color: 'light',
					message: '✔️ Changes saved',
					showCloseButton: true,
					keyboardClose: true,
					duration: 3000,
				});
				await toast.present();
			});
	}
}
