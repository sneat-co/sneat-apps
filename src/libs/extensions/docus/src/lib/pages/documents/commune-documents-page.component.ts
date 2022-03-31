/* tslint:disable */
import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IAssetService, ICommuneIds} from 'sneat-shared/services/interfaces';
import {IAssetDto, IDocument} from 'sneat-shared/models/dto/dto-asset';
import {IMemberDto} from 'sneat-shared/models/dto/dto-member';
import {CommuneTopPage} from '../../../../pages/constants';

@Component({
	selector: 'app-commune-documents',
	templateUrl: './commune-documents-page.component.html',
	providers: [CommuneBasePageParams],
})
export class CommuneDocumentsPageComponent extends CommuneBasePage {

	public segment: 'type' | 'owner' | 'list' = 'type';

	public documents: IDocument[];
	public rootDocs: IDocument[];

	constructor(
		params: CommuneBasePageParams,
		private assetService: IAssetService,
	) {
		super(CommuneTopPage.home, params);
		this.documents = window.history.state.documents as IAssetDto[];
	}

	onCommuneIdsChanged(communeIds: ICommuneIds) {
		super.onCommuneIdsChanged(communeIds);
		console.log('DocumentsPage: communeId', this.communeRealId);
		if (this.communeRealId) {
			this.subscriptions.push(
				this.assetService.watchByCommuneId(this.communeRealId)
					.subscribe(documents => {
							documents = documents.filter(a => a.categoryId === 'docs');
							if (documents && (!this.documents || this.documents.length !== documents.length)) { // TODO: deep equal
								this.documents = documents;
								this.rootDocs = documents.filter(d => !d.parentAssetId);
							}
						},
					),
			);
		}
	}

	public goType(type: string) {
		console.log(`goType(${type})`);
	}

	public goDoc(doc: IDocument) {
		this.navigateForward('document', {id: doc.id}, {assetDto: doc}, {excludeCommuneId: true});
	}

	goNewDoc = (type?: string, member?: IMemberDto) => {
		const queryParams: { type?: string, member?: string } = type ? {type} : {};
		if (member) {
			queryParams['member'] = member.id;
		}
		const state = member ? {member} : undefined;
		this.navigateForward('new-document', queryParams, state);
	};

	filter: string;

	applyFilter(filter: string) {
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		// this.contacts = !filter && !role
		//     ? this.allContacts
		//     : this.allContacts.filter(c =>
		//         (!filter || c.title.toLowerCase().indexOf(filter) >= 0)
		//         && (!role || c.roles && c.roles.includes(role))
		//     );
	}
}
