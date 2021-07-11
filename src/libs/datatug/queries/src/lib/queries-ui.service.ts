import {ActionSheetController} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {QueryType} from '@sneat/datatug/models';
import {QueryEditorStateService} from './query-editor-state-service';
import {RandomId} from '@sneat/random';

@Injectable()
export class QueriesUiService {
	constructor(
		private readonly actionSheet: ActionSheetController,
		private queryEditorStateService: QueryEditorStateService,
	) {
	}

	async openNewQuery(): Promise<void> {
		const createNewQuery = (type: QueryType) => () => {
			console.log(type);
			this.queryEditorStateService.newQuery({
				id: RandomId.newRandomId(7),
				isNew: true,
				queryType: type,
			});
		}
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
				}
			]
		});
		await actionSheet.present();
		// const result = await actionSheet.onDidDismiss();
		// console.log('onDidDismiss resolved with role', result)
	}
}
