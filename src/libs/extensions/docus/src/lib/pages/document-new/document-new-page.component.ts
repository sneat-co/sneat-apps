//tslint:disable:no-unsafe-any
import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IAssetService, IMemberService} from 'sneat-shared/services/interfaces';
import {IMemberDto} from 'sneat-shared/models/dto/dto-member';

@Component({
	selector: 'app-document-new',
	templateUrl: './document-new-page.component.html',
	providers: [CommuneBasePageParams],
})
export class DocumentNewPageComponent extends CommuneBasePage {

	belongsTo: 'member' | 'commune' = 'commune';

	private memberId: string;
	public member: IMemberDto | undefined;

	public isMissingRequiredParams: boolean;

	public country: string;
	public docTitle: string;
	public docType: string;
	public docNumber: string;

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		private readonly assetService: IAssetService,
	) {
		super('documents', params);
		this.route.queryParams.subscribe(qp => {
			console.log('queryParams', qp);
			this.memberId = qp.member;
			this.docType = qp.type;
			if (this.memberId) {
				this.belongsTo = 'member';
				this.subscriptions.push(membersService.watchById(this.memberId)
					.subscribe(
						member => {
							this.member = member;
							if (member) {
								if (!this.communeRealId) {
									this.setPageCommuneIds('DocumentNewPage.memberFromObservable', {real: member.communeId});
								}
							}
						},
						this.errorLogger.logError,
					));
			}
		});
	}

	public submit(): void {
		const dto: IAssetDto = {
			title: this.docTitle,
			type: this.docType,
			number: this.docNumber,
			memberIds: this.memberId ? [this.memberId] : undefined,
			communeId: this.communeRealId,
		};
		this.assetService.addCommuneItem(dto)
			.subscribe(
				dtoAsset => {
					this.navCtrl.navigateForward(['document', dtoAsset.id])
						.catch(this.errorLogger.logError);
				},
				this.errorLogger.logError
			);
	}
}
