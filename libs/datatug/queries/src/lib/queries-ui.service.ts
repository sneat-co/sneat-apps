import { ActionSheetController } from '@ionic/angular/standalone';
import { Injectable, inject } from '@angular/core';
import { QueryType } from '@sneat/ext-datatug-models';
import { QueryEditorStateService } from './query-editor-state-service';
import { RandomIdService } from '@sneat/random';
import { DatatugNavService } from '@sneat/ext-datatug-services-nav';
import { IProjectRef } from '@sneat/ext-datatug-core';

@Injectable()
export class QueriesUiService {
	private readonly randomIdService = inject(RandomIdService);
	private readonly actionSheet = inject(ActionSheetController);
	private readonly queryEditorStateService = inject(QueryEditorStateService);
	private readonly nav = inject(DatatugNavService);

	async openNewQuery(projectRef: IProjectRef): Promise<void> {
		console.log('openNewQuery', projectRef);
		const createNewQuery = (type: QueryType) => () => {
			console.log(type);
			const id = this.randomIdService.newRandomId({ len: 7 });
			const queryState = this.queryEditorStateService.newQuery({
				id: id,
				isNew: true,
				queryType: type,
				def: {
					id,
					draft: true,
					request: {
						queryType: QueryType.HTTP,
					},
				},
			});
			if (queryState.def) {
				this.nav.goQuery({ ref: projectRef }, queryState.def);
			}
		};
		const actionSheet = await this.actionSheet.create({
			header: 'New query',
			subHeader: 'Select type of query to be created',
			buttons: [
				{
					text: 'SQL',
					role: 'selected',
					handler: createNewQuery(QueryType.SQL),
				},
				{
					// icon: 'browser-outline',
					text: 'HTTP',
					role: 'selected',
					handler: createNewQuery(QueryType.HTTP),
				},
				{
					// icon: 'cancel',
					text: 'Cancel',
					role: 'cancel',
				},
			],
		});
		await actionSheet.present();
		// const result = await actionSheet.onDidDismiss();
		// console.log('onDidDismiss resolved with role', result)
	}
}
